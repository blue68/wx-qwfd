// miniprogram/pages/search/index.js
const app = getApp();

let self;

Page({
  data: {
    searchTxt: "",
    jokes: []
  },
  onLoad() {
    self = this;
  },
  search: function (ofset, maxLimit, categories, value, reshType) {
    let self = this;
    app.getJokeListByOpts(ofset, maxLimit, categories, value, (data) => {
      wx.hideLoading();
      if (reshType == 'pulldown') {
        wx.stopPullDownRefresh();
      }
      if (data.length <= 0) {
        wx.showToast({
          title: '搜索结果为空！',
          duration: 800,
          icon: 'none'
        });
      }

      if (self.data.jokes.length > 0) {
        let _data = self.data.jokes.concat(data);
        self.setData({
          'jokes': _data,
          'show': false
        });
      } else {
        self.setData({
          'jokes': data,
          'show': false
        });
      }
    });
  },
  onReachBottom: function () {
    this.setData({
      show: true
    });
    let ofset = self.data.jokes.length;
    this.search(ofset, 20, [0, 1, 2, 3], this.data.searchTxt, 'pulldown');
  },
  confirm: function(e) {
    this.setData({
      jokes: [],
      searchTxt: e.detail.value
    }, function() {
      wx.showLoading({});
      self.search(0, 20, [0, 1, 2, 3], e.detail.value);
    });
  },
  cancel: function() {
    this.setData({
      searchTxt: '',
      jokes: []
    })
  }
});