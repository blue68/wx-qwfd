import Util from './utils/util';

//app.js
App({
  globalData: {
    userId: '',
    openId: '',
    userInfo: null,
    publish: 1,
    systemInfo: 0,
    auth: {
      'scope.userInfo': false
    }
  },

  checkAuth: function(cb) {
    let self = this;

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo'] && self.getGlobalData()) { // 授权
          cb(true);
        } else {
          cb(false);
        }
      },
      fail(err) {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        });
        console.error("wx.getSetting调用失败", err.errMsg);
        cb(false);
      }
    });
  },

  navigateToLogin: function () {
    wx.showModal({
      content: '登录获取更多精彩内容！',
      showCancel: true,
      cancelText: '去看看',
      cancelColor: '#616161',
      confirmText: '去登录',
      confirmColor: '',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/index'
          });
        }
      }
    });
  },

  goToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/index'
    });
  },

  getGlobalData: function() {
    try {
      var value = wx.getStorageSync('global_user_data')
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  getAccess: function() {
    let self = this;
    wx.cloud.callFunction({
      name: 'access',
      data: {
        getList: true
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          let data = res.result ? res.result.data[0] : null;
          if (data) {
            self.globalData.publish = data.publish;
          }
        }
      }
    });
  },
  getJokeListByOpts: function (offset, maxLimit, types, cont, cb) {
    wx.cloud.callFunction({
      name: 'jokes',
      data: {
        getList: true,
        offset: offset,
        maxLimit: maxLimit,
        types: types,
        cont: cont
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
  onShow: function() {
    this.updateManager();
    this.getAccess();
    this.getSystemInfo();
  },
  onLaunch: function () {
    this.updateManager();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 如不填则使用默认环境（第一个创建的环境）
        env: '填写自己申请的云环境ID',
        traceUser: true,
      });
      this.getAccess();
      this.getSystemInfo();
    }
  },
  updateManager: function() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate);
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '更新失败，请退出后重试！',
        duration: 800,
        icon: 'none'
      });
    });
  },
  getSystemInfo: function() {
    let systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
  }
});
