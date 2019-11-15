const Md5 = require('./md5');
const APP_ID = '自己申请的APP_ID';
const APP_KEY = '自己申请的APP_KEY';

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

function timeStamp() {
  return  Math.round(new Date() / 1000);
}


function getNonce(len) {
  let str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let newStr = [];
  for(let i = 0; i < len; i ++) {
    let index =  Math.floor(Math.random() * (str.length - 0)) + 0;
    newStr.push(str.charAt(index));
  }
  return newStr.join('');
}


function ksort(obj) {
  let keys = Object.keys(obj).sort();
  let newObj = [];

  for (var i = 0; i < keys.length; i ++) {
    let k = keys[i], v = obj[k];

    if (v !== '') {
      let _v = encodeURIComponent(obj[k]);
      _v = _v.replace(/%20/ig, '+');
      newObj.push(`${k}=${_v}`);
    }
  }
  return newObj.join('&');
}

function getReqSign(param, appKey) {
  let t = ksort(param);
  let s = t +`&app_key=${appKey}`;

  return Md5(s).toUpperCase();
}


function getParam(data) {
  let newData = Object.assign(data, {
    "app_id": APP_ID,
    "time_stamp": timeStamp(),
    "nonce_str": getNonce(16)
  });

  let sign = getReqSign(newData, APP_KEY);
  return Object.assign(data, {
    "sign": sign
  });
}

function jsonToStringMp(data) {
  let ars = [];
  for(var k in data) {
    ars.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
  }
  return ars.join('&');
}


function basicRequest(url, successCb, failCb) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      successCb(res);
    },
    fail: function(e) {
      failCb(e);
    }
  })
}


function aiReq(param) {
  let _data = getParam(param.data);
  if (param.method && param.method.toLocaleUpperCase() == 'POST') {
    _data = jsonToStringMp(_data);
  }
  wx.request({
    url: param.url,
    header: {
      "Content-Type": param.header || "application/json"
    },
    data: _data,
    method: param.method || 'GET',
    dataType: param.dataType || 'json',
    responseType: param.responseType || 'text',
    success: param.success || null,
    fail: param.fail || null,
    complete: param.complete || null
  });
}


module.exports = {
  formatTime,
  showBusy,
  showSuccess,
  showModel,
  getTempFileURL,
  AiReq: aiReq,
  baseReq: basicRequest
}