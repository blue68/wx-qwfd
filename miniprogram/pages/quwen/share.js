// miniprogram/pages/quwen/share.js
import Util from '../../utils/util';

const app = getApp();
let self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      cont: '',
      likes: 57,
      type: 3,
      userId: "",
    },
    width: 0,
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(options.info);
    self = this;
    let systemInfo = app.globalData.systemInfo;

    let windowHeight = systemInfo.screenHeight,
      windowWidth = systemInfo.screenWidth;
    self.setData({
      width: windowWidth * 0.9,
      height: windowHeight * 0.8,
      info: info
    });

    wx.showLoading();
    
    this.getImageWithUrl(function(res) {
      wx.hideLoading();

      self.setData({
        bgPath: res.path,
        bgWidth: res.width,
        bgHeight: res.height
      }, function () {
        self.draw();
      });
    });
  },

  draw: function() {
    const ctx = wx.createCanvasContext('myCanvas');
    let coverWidth = this.data.width, coverHeight = this.data.height;
    const infoCont = this.data.info.cont;
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDay();
    const date = d.getDate();
    const time = year + '.' + month + '.' + date;

    ctx.save();
    console.log(self.data.bgPath)
    ctx.drawImage(self.data.bgPath, 0, 0, coverWidth, coverHeight - 100);  

    ctx.setFontSize(16);
    ctx.setFillStyle('#FFFFFF');
    ctx.setTextAlign('right');
    
    const metrics = ctx.measureText(time).width;
    let timeX = coverWidth - 20, timeY = 50, contWidth = coverWidth - 40;
    ctx.fillText(time, timeX, timeY, metrics + 5);
    
    ctx.moveTo(timeX - metrics, timeY + 12);
    ctx.lineTo(timeX, timeY + 12);
    ctx.setStrokeStyle('#FFFFFF');
    ctx.stroke();

    let aliasDay = ['日', '一', '二', '三', '四', '五', '六'];
    ctx.fillText('星期' + aliasDay[day], timeX, timeY + 36);
    this.drawCont(ctx, infoCont, contWidth, 15, timeY + 100);
    
    ctx.setFillStyle('#FFFFFF');
    ctx.fillRect(0, coverHeight - 100, coverWidth, 100);
    ctx.fill();

    ctx.setFontSize(22);
    ctx.setFillStyle('#262626');
    ctx.setTextAlign('left');
    ctx.fillText('趣文沸点', 15, coverHeight - 60, ctx.measureText('趣文沸点').width + 5);

    ctx.setFontSize(14);
    ctx.setFillStyle('#919191');
    ctx.setTextAlign('left');
    ctx.fillText('段子、语录查询工具', 15, coverHeight - 30, ctx.measureText('段子、语录查询工具').width + 5);

    ctx.drawImage('/icons/wxcode.png', contWidth - 60, coverHeight - 96, 90, 90);

    ctx.draw();
  },

  drawCont: function (ctx, infoCont, contWidth, x, y) {
    let w = ctx.measureText(infoCont).width;
    ctx.setTextAlign('left');
    ctx.setFontSize(17);
    
    if (w < contWidth) {
      ctx.fillText(infoCont, x + 20, y + 30);
    } else {
      let lastIndex = 0;
      let h = y;
      let cw = 0;
      for (let i = 0; i < infoCont.length; i++) {
        cw += ctx.measureText(infoCont[i]).width;
        if (cw > contWidth) {
          ctx.fillText(infoCont.substring(lastIndex, i), x, h, cw + 10);
          lastIndex = i;
          cw = 0;
          h += 28;
        }
        if (i == infoCont.length - 1) {
          ctx.fillText(infoCont.substring(lastIndex, i + 1), x, h, cw + 10);
        }
      }
    }
  },

  getImageWithUrl: function(cb) {
    let num = Util.randomNum(13) + 1;
    wx.getImageInfo({
      src: 'cloud://wx-news123-1wmxj.7778-wx-news123-1wmxj-1256740107/imgs/share/' + num +'.jpg',
      success(res) {
        cb(res);
      }
    });
  },

  onSave: function() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.width,
      height: this.data.height,
      canvasId: 'myCanvas',
      quality: 1,
      success(res) {
        self.saveImageToPhotosAlbum(res.tempFilePath);
      }
    });
  },

  isWritePhotosAlbum: function(cb) {
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        cb()
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '您未授权相册功能，无法保存',
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#52a2d8",
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting['scope.record']) {
                    wx.showModal({
                      title: '提示',
                      content: '您未授权相册功能，无法保存',
                      showCancel: false,
                      success: function (res) { }
                    });
                  } else {
                    cb();
                  }
                },
                fail: () => { }
              });
            }
          }
        });
      }
    });
  },
  saveImageToPhotosAlbum: function(path) {
    this.isWritePhotosAlbum(function() {
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success(res) {
          wx.showToast({
            title: '保存成功',
            duration: 500,
            icon: 'none'
          });
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})