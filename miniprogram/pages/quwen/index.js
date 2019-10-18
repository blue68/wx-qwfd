const app = getApp();

const TYPES = {
  'DZ': [0],
  'YL': [1],
  'DY': [2],
  'XH': [3],
  'ALL': [0, 1, 2, 3]
};

let self;

Page({
  data: {
    pageCurrentState: 'jokes',
    jokes: [],
    jokeIds: [],
    show: true,
    publish: 0,
    currentType: 'ALL',
    color: {
      selectedColor: '#1188FF',
      unselectedColor: '#919191'
    }
  },
  onLoad: function (options) {
    self = this;
    self.setData({
      currentType: options.type,
      publish: app.globalData.publish
    });

    self.loadPageDataWithCloud();
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  search: function(e) {
    let _type = e.currentTarget.dataset.type;
    self.setData({
      currentType: _type,
      jokes: [],
      show: true
    });
    self.loadPageDataWithCloud('pulldown');
  },
  onPullDownRefresh: function () {
    self.setData({
      jokes: []
    });
    self.loadPageDataWithCloud('pulldown');
  },
  onReachBottom: function () {
    self.setData({
      show: true
    });
    self.loadPageDataWithCloud();
  },
  loadPageDataWithCloud: function(reshType) {
    let ofset = self.data.jokes.length;
    self.getListByOpts(ofset, function(data) {
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
  updateJokesWithLikes: function(id, cb) {
    wx.cloud.callFunction({
      name: 'jokes',
      data: {
        updateJokes: true,
        jokeId: id
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          cb(res.result.data);
        } else {
          cb(null);
        }
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        cb(null);
      }
    })
  },
  addJokeLikeWithSelf: function (userId, jokeId, cb) {
    wx.cloud.callFunction({
      name: 'jokelikes',
      data: {
        setSelf: true,
        userId: userId,
        jokeId: jokeId
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          cb(res);
        } else {
          cb(null);
        }
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        cb(null);
      }
    })
  },
  getListByOpts: function(offset, cb) {
    wx.cloud.callFunction({
      name: 'jokes',
      data: {
        getList: true,
        offset: offset,
        types: TYPES[self.data.currentType]
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          cb(res.result.data);
        } else {
          cb([]);
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
  tapLikes: function(event) {
    let currentTpl = event.currentTarget;
    let _id = currentTpl.dataset.id;
    let len = self.data.jokes.length
    let itemV = null;

    for(let i = 0; i < self.data.jokes.length; i ++) {
      if (_id == self.data.jokes[i]._id) {
        self.setData({
          INDEX: i
        });
        itemV = self.data.jokes[i];
        itemV.likes ++;
      }
    }

    self.setData({
      ['jokes[' + self.data.INDEX + ']'] : itemV
    }, function () {
      self.updateJokesWithLikes(_id, function (res) {
        if (!self.data.jokeIds.includes(_id)) {
          // 执行操作
          self.data.jokeIds.push(_id);

          app.checkAuth(function(flag) {
            if (flag) {
              // 与用户关联
              let globalData = app.getGlobalData();
              self.addJokeLikeWithSelf(globalData.userId, _id, function(st) {
              });
            } else {
              app.navigateToLogin(); // 跳转至登录页面
            }
          });
        }
      });
    });
  }
})