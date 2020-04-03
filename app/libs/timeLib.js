const moment = require('moment')
const momenttz = require('moment-timezone')
const timezone = 'Asia/Culacutta'

let now = () => {
    return moment.utc().format()
}

let getLocalTime = () => {
    return moment().tz(timezone).format()
}

let convertToLocalTime = (time) => {
    return momenttz.tz(time, timeZone).format('LLLL')
}

module.exports = {
    now: now,
    getLocalTime: getLocalTime,
    convertToLocalTime: convertToLocalTime
}