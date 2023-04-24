// 格式化计算表格数据
export const formatStatistics = (param) => {
  const {columns, data} = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }

    if (
      column.property === 'id'
      || column.property === 'remark'
      || column.property === 'reason'
      || column.property === 'voucher'
      || column.property === 'isReceived'
      || column.property === 'borrower'
    ) {
      return
    }

    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `¥ ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
}

// 时间格式化
function getDateRange(startOffset, endOffset) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() + 3600 * 1000 * 24 * startOffset)
  end.setTime(end.getTime() + 3600 * 1000 * 24 * endOffset)
  return [end, start]
}

// 日期选择格式化
export const shortcuts = [
  {
    text: '往后一周',
    value: () => getDateRange(7, 0),
  },
  {
    text: '往后一月',
    value: () => getDateRange(30, 0),
  },
  {
    text: '往后三月',
    value: () => getDateRange(90, 0),
  },
  {
    text: '往后半年',
    value: () => getDateRange(180, 0),
  },
  {
    text: '往后一年',
    value: () => getDateRange(365, 0),
  }
]
