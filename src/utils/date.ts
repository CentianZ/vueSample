export function getCurrentTime(date: Date) {
    let _date = new Date(date);
    let _hour = _date.getHours() + ''
    let _minute = _date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()
    let _second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return `${_hour}:${_minute}:${_second}`
}

export function getCurrentDate(date: Date) {
    let _date = new Date(date);
    let _year = _date.getFullYear() + ''
    let _month = _date.getMonth() < 10 ? '0'+ date.getMonth() : date.getMonth()
    let _day = _date.getDay() < 10 ? '0'+ date.getDay() : date.getDay()
    return `${_year}/${_month}/${_day}`
}

