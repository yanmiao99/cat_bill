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

// 获取系统色系
export const getTheme = () => {
  let resTheme = ''
  let theme = window.localStorage.getItem('vueuse-color-scheme');
  if (theme === 'dark') {
    resTheme = 'dark'
  } else if (theme === 'light') {
    resTheme = ''
  } else {
    const media = window.matchMedia('(prefers-color-scheme:dark)');
    if (media.matches) {
      resTheme = 'dark'
    } else {
      resTheme = ''
    }
  }
  return resTheme
}
