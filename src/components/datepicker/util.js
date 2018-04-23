export default {
  /**
     * demo:yyyy-MM-dd hh:mm:ss.S
     * @param  {[type]} fmt  [description]
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
  dateFormat (fmt, date) {
    let thisDate = date || new Date()
    var o = {
      'M+': thisDate.getMonth() + 1, // 月份
      'd+': thisDate.getDate(), // 日
      'h+': thisDate.getHours(), // 小时
      'm+': thisDate.getMinutes(), // 分
      's+': thisDate.getSeconds(), // 秒
      'q+': Math.floor((thisDate.getMonth() + 3) / 3), // 季度
      's': thisDate.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  dateConvertSec (s) {
    if (s) {
      return new Date(s.replace(/\.0$/, '').replace(/-/g, '/')).getTime()
    }
    return 0
  },
  getTodaySec () {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  },
  getMaxDate (start, end) {
    const startDate = new Date(start.replace(/\.0$/, '').replace(/-/g, '/'))
    const endDate = new Date(end.replace(/\.0$/, '').replace(/-/g, '/'))
    let startYaer = startDate.getFullYear()
    let startMonth = startDate.getMonth() + 1
    let endYear = endDate.getFullYear()
    let endMonth = endDate.getMonth() + 1
    let years = 0
    let months = 0
    if (endYear - startYaer < 0) {
      console.error('日期错误')
    } else if (endYear - startYaer === 0) {
      months = endMonth - startMonth + 1
    } else {
      years = endYear - startYaer - 1
      months = 12 - startMonth + 1 + endMonth + years * 12
    }
    return months
  },
  getAllPanelData (options) {
    let backward = options.backward ? options.backward : false
    let that = this
    let maxDate = options.maxDate
    if (!options.maxDate && !options.start) {
      console.error('maxDate或start必须有一个')
    }
    if (options.start && !options.end && !options.maxDate) {
      if (that.dateConvertSec(options.start) > that.getTodaySec()) {
        console.error('请添加结束日期')
      } else {
        options.end = that.dateFormat('yyyy-MM-dd')
      }
    }
    let start = options.start ? options.start.replace(/\.0$/, '').replace(/-/g, '/') : that.dateFormat('yyyy-MM-dd')
    if (options.start && options.end) {
      maxDate = that.getMaxDate(options.start, options.end) + 'm'
    }
    if (maxDate.indexOf('m') > -1) {
      let months = maxDate.replace('m', '') * 1
      if (months) {
        return that.getCalendarDataByMonth(months, start, backward)
      } else {
        console.error('maxDate parameter error')
      }
    } else {
      console.error('maxDate parameter error')
    }
  },
  getCalendarDataByMonth (months, start, backward) {
    let that = this
    let all = []
    if (backward) {
      while (months--) {
        let date = start ? new Date(start) : new Date()
        date.setFullYear(date.getFullYear(), date.getMonth() + months, 1)
        all.push({
          month: date.getFullYear() + '年' + (date.getMonth() + 1) + '月',
          days: that.getCurrentMonthTableData(date)
        })
      }
    } else {
      for (let i = 0; i < months; i++) {
        let date = start ? new Date(start) : new Date()
        date.setFullYear(date.getFullYear(), date.getMonth() + i, 1)
        all.push({
          month: date.getFullYear() + '年' + (date.getMonth() + 1) + '月',
          days: that.getCurrentMonthTableData(date)
        })
      }
    }
    return all
  },
  getCurrentMonthTableData (d) {
    let date = d || new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    date.setFullYear(year, month + 1, 0)
    let currentDays = date.getDate()
    let finalWeek = date.getDay()
    date.setDate(1)
    let firstWeek = date.getDay()

    let months = []
    while (firstWeek--) {
      months.push('')
    }
    for (let i = 0; i < currentDays; i++) {
      months.push(new Date(year, month, i + 1))
    }
    if (finalWeek < 6) {
      for (let i = 0, len = 6 - finalWeek; i < len; i++) {
        months.push('')
      }
    }
    return months
  }
}
