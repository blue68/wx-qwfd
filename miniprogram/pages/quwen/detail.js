// miniprogram/pages/quwen/detail.js
const app = getApp();
let self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFollow: false,
    followText: '点击关注',
    jokeInfo: {},
    likeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    this.userId = app.getGlobalData().userId;
    let jokeId = options.jokeId || '';
    this.jokeId = jokeId;

    wx.showLoading();
    
    Promise.all([this.getListByIds([jokeId]), this.getListByUserId()]).then(function(res) {
      wx.hideLoading();
      let _jokeInfo = res[0] && res[0].length > 0 ? res[0][0] : {};
      let jokeLikes = res[1];
      let filterArs = jokeLikes.filter((item) => {
        return item.jokeId == jokeId
      });
      let _isFollow = false, _id = '', _followText = '点击关注';

      if (filterArs.length > 0) {
        _isFollow = true;
        _id = filterArs[0]._id;
        _followText = '已关注';
      }

      self.setData({
        isFollow: _isFollow,
        jokeInfo: _jokeInfo,
        followText: _followText,
        likeId: _id
      });
    });
  },

  onShareAppMessage: function () {

  },

  onClipboard: function() {
    wx.setClipboardData({
      data: self.data.jokeInfo.cont,
      success(res) {
        wx.getClipboardData({
          success(res) { }
        });
      }
    });
  },
  onShare: function() {
    wx.redirectTo({
      url: '/pages/quwen/share?info=' + JSON.stringify(this.data.jokeInfo)
    });
  },
  onFollow: function() {
    if (this.data.isFollow) {
      this.unlike(this.data.likeId);
    } else {
      this.like(this.userId, this.jokeId);
    }
  },
  // 获取用户关注的列表
  getListByUserId: function() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'jokelikes',
        data: {
          getLikes: true,
          userId: self.userId,
          jokeId: self.jokeId
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            resolve(res.result.data);
          }
        },
        fail: err => {
          resolve([]);
        }
      });
    });
  },
  getListByIds: function (ids) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'jokes',
        data: {
          getByIds: true,
          ids: ids,
          offset: 0
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            resolve(res.result.data);
          }
        },
        fail: err => {
          resolve([]);
        }
      });
    });
  },
  unlike: function(id) {
    wx.cloud.callFunction({
      name: 'jokelikes',
      data: {
        remove: true,
        likeId: id
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok" && res.result.stats.removed == 1) {
          wx.showToast({
            title: '关注已取消',
            duration: 800,
            icon: 'none',
            success: function () {
              self.setData({
                isFollow: false,
                followText: '点击关注'
              });
            }
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '取消关注失败',
          duration: 800,
          icon: 'none'
        });
      }
    });
  },
  like: function (userId, jokeId) {
    wx.cloud.callFunction({
      name: 'jokelikes',
      data: {
        setSelf: true,
        userId: userId,
        jokeId: jokeId
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          self.setData({
            isFollow: true,
            followText: '已关注',
            likeId: res.result._id
          });
        } 
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        });
      }
    });
  },
})