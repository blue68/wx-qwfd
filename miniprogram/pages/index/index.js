const app = getApp();

Page({
  data: {
    recommend: {},
    hostList: []
  },
  onLoad: function() {
    let self = this;
    wx.showLoading({});
    app.getJokeListByOpts(0, 50, [1, 2], null, (data) => {
      wx.hideLoading();
      let len = data.length;
      let random = self.getRandomInt(0, len);
      self.setData({
        hostList: data,
        recommend: data[random],
        publish: app.globalData.publish
      });
    });
  },
  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  onShareAppMessage: function (res) {
    return {
      title: '一起欣赏趣文之乐',
      path: `pages/index/index`
    }
  },
  onDetail: function (e) {
    let dataset = e.currentTarget.dataset;
    let id = this.data.recommend._id;
    
    if (dataset && dataset.id) {
      id = dataset.id;
    }
    
    app.checkAuth(function (flag) {
      if (flag) {
        wx.redirectTo({
          url: '/pages/quwen/detail?jokeId=' + id
        });
      } else {
        app.navigateToLogin(); // 跳转至登录页面
      }
    });
  }
});