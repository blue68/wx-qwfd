const app = getApp();

let self;

Page({
  data: {
    jokes: [],
    jokeIds: [],
    show: false
  },
  onLoad: function() {
    self = this;
    self.loadPageDataWithCloud();
  },
  // 触发了下拉刷新
  onPullDownRefresh: function () {
    self.setData({
      jokes: []
    });
    self.loadPageDataWithCloud('pulldown');
  },
  refresh: function (jokeLikeId) {
    let _data = self.data.jokes;
    let _newData = _data.filter(item => {
      return item.jokelikeId !== jokeLikeId;
    });
    self.setData({
      jokes: _newData
    });
  },
  unlike: function (e) {
    let id = e.currentTarget.dataset.jokelikeid;
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
            success: function() {
              self.refresh(id);
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
    })
  },
  // 滚动到页面底部
  onReachBottom: function () {
    self.setData({
      show: true
    });
    self.loadPageDataWithCloud();
  },

  loadPageDataWithCloud: function (reshType) {
    let ofset = self.data.jokes.length;

    self.getListByOpts(ofset, function (data) {
      if (reshType == 'pulldown') {
        wx.stopPullDownRefresh();
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
  getListByOpts: function (offset, cb) {
    let globalData = app.getGlobalData();
    wx.cloud.callFunction({
      name: 'jokelikes',
      data: {
        getList: true,
        offset: offset,
        userId: globalData.userId
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          let originData = res.result.data;
          let ids = self.filterIds(originData);
          self.getListByIds(ids, function(_data){
            self.mergeData(originData, _data);
            cb(_data);
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        cb([]);
      }
    })
  },
  getListByIds: function(ids, cb) {
    wx.cloud.callFunction({
      name: 'jokes',
      data: {
        getByIds: true,
        ids: ids,
        offset: 0
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          cb(res.result.data);
        }
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        cb([]);
      }
    });
  },
  filterIds: function(data) {
    let ids = [];
    if(data) {
      for(var i = 0; i < data.length; i++) {
        let item = data[i];
        ids.push(item.jokeId);
      }
    }
    return ids;
  },
  mergeData: function(originData, newData) {
    newData.forEach((item, i) => {
      let n = originData.filter(it => it.jokeId == item._id);
      item.jokelikeId = n[0]._id;
    });
  }
});