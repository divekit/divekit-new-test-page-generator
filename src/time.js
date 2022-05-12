const {format, utcToZonedTime} = require("date-fns-tz")

export function europeTimeString() {
    const today = new Date()
    const timeZone = 'Europe/Paris'
    const timeInEurope = utcToZonedTime(today, timeZone)

    return format(timeInEurope, 'dd.MM.yyyy - HH:mm:ss')
}

