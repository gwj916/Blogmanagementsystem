export function formatDate(time) {
    var date = new Date(parseInt(time))
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var weekarr = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    var week = weekarr[date.getDay()];

    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (day >= 0 && day <= 9) {
        day = '0' + day;
    }
    if (hour >= 0 && hour <= 9) {
        hour = '0' + hour;
    }
    if (minute >= 0 && minute <= 9) {
        minute = '0' + minute;
    }
    if (second >= 0 && second <= 9) {
        second = '0' + second;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + ' ' + week;
}