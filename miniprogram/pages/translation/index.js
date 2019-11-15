import Util from '../../utils/util';
import Api from '../../utils/aiApi';

const app = getApp();
let timer = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      "index": 0,
      "value": "文本"
    }, {
      "index": 1,
      "value": "语音"
    }, {
      "index": 2,
      "value": "拍译"
    }],
    currentIndex: 0,
    txtHeight: 0,
    statusBarHeight: 20,
    source: '', // 源语言
    target: '', // 目标语言
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let selectBoxCom = this.selectComponent('#selectbox-comp');
    let selectBoxData = selectBoxCom.data;
    let systemInfo = app.globalData.systemInfo;

    let windowHeight = systemInfo.screenHeight,
      statusBarHeight = systemInfo.statusBarHeight;

    this.setData({
      source: selectBoxData.origin,
      target: selectBoxData.target,
      statusBarHeight: statusBarHeight,
      txtHeight: windowHeight - statusBarHeight - 90
    });
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onTabChange: function (e) {
    this.setData({
      currentIndex : e.detail
    });
  },

  onLangeChange: function (e) { // 语言切换
    if (this.data.currentIndex == 0) {
      let textTransComp = this.selectComponent('#text-trans-comp');
      textTransComp.setParam(e.detail);
    } else if(this.data.currentIndex == 1) {
      let speechTransComp = this.selectComponent('#speech-trans-comp');
      speechTransComp.setParam(e.detail);
    } else {
      let imgTransComp = this.selectComponent('#img-trans-comp');
      imgTransComp.setParam(e.detail);
    }
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