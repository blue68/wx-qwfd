// miniprogram/pages/textchat/index.js
import Util from '../../utils/util';
import Api from '../../utils/aiApi';

const app = getApp();

let self;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    question: "",
    userId: "",
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    this.setData({
      userId: app.getGlobalData().userId
    });
  },

  inputChange: function(e) {
    let value = e.detail.value;
    self.setData({
      disabled: false,
      question: value
    });
  },

  send: function() {
    if (!self.data.question) {
      wx.showToast({
        title: '信息不能为空!',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    let objQ = {
      type: 0,
      msg: self.data.question
    };
    let _listq = self.data.list;
    _listq.push(objQ);

    self.setData({
      list: _listq,
      question: self.data.question,
      totalLast: `item${_listq.length}`
    });

    Util.AiReq({
      url: Api.nlp_textchat,
      data: {
        "session": self.data.userId,
        "question": self.data.question
      },
      success: function (d) {
        let _list = self.data.list;
        let obj;
        
        if (d.data.ret == 0 ){
          obj = {
            type: 1,
            msg: d.data.data.answer
          }
        } else {
          obj = {
            type: 1,
            msg: '未找到您感兴趣的话题...'
          }
        }
        _list.push(obj);
        self.setData({
          list: _list,
          question: "",
          disabled: true,
          totalLast: `item${_list.length}`
        })
      },
      fail: function (e) {
        console.log('fail', e)
      }
    })
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