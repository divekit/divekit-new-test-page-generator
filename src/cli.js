import arg from 'arg';
import fs from 'fs-extra';
import util from 'util';
import globModule from 'glob';
import ejs from 'ejs';
const glob = util.promisify(globModule);
import parser from 'xml2json';

const packageRoot = __dirname.replace('src', '');

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--output': String,
            '--reports': String,
            '--title': String,
            '-o': '--output',
            '-r': '--reports',
            '-t': '--title',
        }
    );
    return {
        output: args['--output'] || 'public',
        reports: args['--reports'] || 'target/surefire-reports',
        title: args['--title'] || 'Test Report',
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    let outputDir = options.output;
    let reportsDir = options.reports;
    try {
        await fs.ensureDir(outputDir);
        await fs.emptyDir(outputDir);
    } catch (error) {
        console.log('Couldnt create output directory!')
    }
    try {
        const html = await createHTML(reportsDir, options);
        await fs.writeFile('public/index.html', html)
        await copyAssets()
    } catch (error) {
        console.log(error);
    }
}

const createHTML = async (reportsDir, options) => {
    const fileList = await glob(reportsDir + '/*.xml')
    const files = await Promise.all(fileList.map(async file => await fs.readFile(file, 'utf8')))
    let testsuites = []
    files.forEach((file) => {
        const testsuite = JSON.parse(parser.toJson(file)).testsuite;
        delete testsuite.properties
        if(!testsuite.testcase.length){
            testsuite.testcase = [testsuite.testcase]
        }
        testsuite.testcase.map(testcase => {
            testcase.status = testcase.failure || testcase.error ? 'failed' : 'passed'
            testcase.hidden = testcase.name.toLowerCase().includes("hidden");
        });
        const nameSplit = testsuite.name.split('.');
        testsuite.name = nameSplit[nameSplit.length-1];
        testsuite.status = parseInt(testsuite.failures) || parseInt(testsuite.errors) > 0 ? 'failed' : 'passed'
        testsuites.push(testsuite);
    })
    const template = await fs.readFile(packageRoot + 'templates/report.ejs', 'utf8')
    const html = ejs.render(template, { testsuites, title: options.title, createdTimeStamp: getTimeStamp() })
    return html;
}

function getTimeStamp() {
    var today = new Date();

    var day = (today.getDate() < 10 ? "0" : "") + today.getDate();
    var month = (today.getMonth()+1 < 10 ? "0" : "") + (today.getMonth() + 1);
    var year = today.getFullYear();
    var date = day + '-' + month + '-' + year;

    var hours = (today.getHours() < 10 ? "0" : "") + today.getHours();
    var minutes = (today.getMinutes() < 10 ? "0" : "") + today.getMinutes();
    var seconds = (today.getSeconds() < 10 ? "0" : "") + today.getSeconds();
    var time = hours + ":" + minutes + ":" + seconds + " UTC";
    return date + ' ' + time;
}

const copyAssets = async () => {
    await fs.copy(packageRoot + 'assets/', 'public/')
}