import Util from '../../utils/util';
const app = getApp();
let self;

Page({
  data: {
    isLogin: true,
    publish: 0,
    imgUrls: [
      '/icons/qrcode.png'
    ]
  },
  onLoad: function () {
    this.isLogin();
  },
  onShow: function() {
    this.isLogin();
  },
  onGoLogin: function() {
    app.goToLogin();
  },
  onGoAbout: function() {
    wx.navigateTo({
      url: '/pages/about/index',
    });
  },
  onGoMylove: function() {
    wx.navigateTo({
      url: '/pages/jokelike/index',
    });
  },
  onGoMypublish: function () {
    wx.navigateTo({
      url: '/pages/mypublish/index',
    });
  },
  onShowGrllery: function() {
    Util.getTempFileURL(['cloud://wx-news123-1wmxj.7778-wx-news123-1wmxj-1256740107/qrcode.png']).then((d)=> {
      let obj = d ? d[0] : {};
      if(obj.errMsg == 'ok') {
        console.log(obj.tempFileURL)
        let imgs = [];
        imgs.push(obj.tempFileURL);
        wx.previewImage({
          current: obj.tempFileURL,
          urls: imgs
        })
      }
    });
  },
  hide: function() {

  },
  isLogin: function() {
    self = this;
    app.checkAuth(function (flag) {
      if (flag) {
        self.setData({
          isLogin: true,
          publish: app.globalData.publish
        });
      } else {
        self.setData({
          isLogin: false
        });
      }
    })
  }
});