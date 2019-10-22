function basicRequest(url, successCallBack) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      successCallBack(res);
    },
  })
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 3000
});

var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

var getTempFileURL = async (fileList) => {
  const result = await wx.cloud.getTempFileURL({
    fileList: fileList,
  })
  return result.fileList
}

module.exports = {
  formatTime,
  showBusy,
  showSuccess,
  showModel,
  getTempFileURL
}


