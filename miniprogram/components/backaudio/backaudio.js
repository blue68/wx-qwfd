// components/backaudio/backaudio.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source: String,
    target: String,
    filePath: String
  },

  lifetimes: {
    created: function() {
      this.backgroundAudioManager = wx.getBackgroundAudioManager();
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.backgroundAudioManager.onEnded(() => {
        this.setData({
          isStart: false,
        })
      });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isStart: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onplay: function() {
      if (this.data.filePath) {
        this.backgroundAudioManager.src = this.data.filePath;
        this.backgroundAudioManager.title = '';
        this.backgroundAudioManager.play();
        this.setData({
          isStart: true
        });
      }
    },
    onpause: function() {
      this.backgroundAudioManager.pause();
      this.setData({
        isStart: false
      });
    }
  }
})
