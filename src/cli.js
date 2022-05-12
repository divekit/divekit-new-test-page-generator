import arg from 'arg';
import fs from 'fs-extra';
import ejs from 'ejs';
import parser from 'xml2json';
import {europeTimeString} from "./time";


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
        reports: args['--reports'] || 'target/unified.xml',
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
    const file = await fs.readFile(reportsDir, 'utf8');

    let testsuites = JSON.parse(parser.toJson(file)).suites.testsuite;
    if (!testsuites.length) {
        testsuites = [testsuites]
    }

    testsuites.forEach(testsuite => {
        if (!testsuite.testcase.length) {
            testsuite.testcase = [testsuite.testcase];
        }
    });

    const template = await fs.readFile(packageRoot + 'templates/report.ejs', 'utf8')
    const html = ejs.render(template, {testsuites, title: options.title, createdTimeStamp: europeTimeString()})
    return html;
}

const copyAssets = async () => {
    await fs.copy(packageRoot + 'assets/', 'public/')
}