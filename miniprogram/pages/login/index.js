const app = getApp();

Page({
  data: {
  },
  onGotUserInfo: function(e) {
    var _this = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.auth['scope.userInfo'] = true;

      wx.cloud.callFunction({
        name: 'login',
        data: {
          getSelf: true
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            if (res.result && res.result.data.length > 0) {
              let obj = res.result.data[0];
              app.globalData.userInfo = obj.userData;
              app.globalData.openId = obj.openId;
              app.globalData.userId = obj._id;
              try {
                wx.setStorageSync('global_user_data', JSON.stringify(app.globalData));
              } catch (e) { }
              wx.navigateBack();

            } else {
              _this.register(e.detail.userInfo);
            }
          }
        },
        fail: err => {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 800,
            icon: 'none'
          })
          console.error("get_setUserInfo调用失败", err.errMsg)
        }
      });
    } else {
      console.log("未授权");
    }
  },

  register: function(e) {
    let _this = this
    wx.cloud.callFunction({
      name: 'login',
      data: {
        setSelf: true,
        userData: e
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok" && res.result) {
          app.globalData.userInfo = e;
          app.globalData.openId = res.result.openId;
          app.globalData.userId = res.result.userId;
          try {
            wx.setStorageSync('global_user_data', JSON.stringify(app.globalData));
          } catch (e) { }
          wx.navigateBack();
        } else {
          console.log("注册失败", res)
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 800,
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        console.error("login调用失败", err.errMsg)
      }
    })
  },
  onLoad: function() {
  }
})