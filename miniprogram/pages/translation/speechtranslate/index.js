import Util from '../../../utils/util';
import Api from '../../../utils/aiApi';

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source: String,
    target: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    source: '', // 源语言
    target: '', // 目标语言
    btnTxt: '按住说话',
    recorderManager: null,
    audioList: []
  },

  lifetimes: {
    created: function() {
      let recorderManager = wx.getRecorderManager();
      this.recorderManager = recorderManager;
      this.userId = app.getGlobalData().userId;
    },

    attached: function () {
      let that = this;
      this.recorderManager.onStop((res) => {
        this.stopTask(res);
      });
    },
    ready: function() {}
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    recordStart: function(){
      const options = {
        duration: 10000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 24000,
        format: 'mp3'
      };
      this.recorderManager.start(options);
    },

    stopTask: function(res) {
      const { tempFilePath, result } = res;
      let fileSystemManager = wx.getFileSystemManager();

      fileSystemManager.readFile({
        filePath: tempFilePath.toString(),
        success: (res) => {
          let chunk = wx.arrayBufferToBase64(res.data);
          this._reqSpeechtranslate(tempFilePath, chunk);
        }
      });
    },
    _reqSpeechtranslate: function(tempFilePath, chunk) {

      let audioObj = {
        filePath: tempFilePath
      };

      let _audioList = this.data.audioList;

      Util.AiReq({
        url: Api.nlp_speechtranslate,
        data: {
          "format": 8,
          "seq": 0,
          "end": 1,
          "source": this.data.source,
          "target": this.data.target,
          "speech_chunk": chunk,
          "session_id": this.userId
        },
        header: 'application/x-www-form-urlencoded',
        method: 'POST',
        success: (d) => {
          if (d.data.ret == 0) {
            let _data = d.data.data;

            audioObj['target'] = _data.target_text || '';
            audioObj['source'] = _data.source_text || '';
          } else {
            wx.showToast({
              title: '系统繁忙请稍后重试...',
              icon: 'none',
              mask: true,
              duration: 1000
            });
          }
          _audioList.push(audioObj);

          this.setData({
            audioList: _audioList
          });
        },
        fail: (e) => {
          _audioList.push(audioObj);
          this.setData({
            audioList: _audioList
          });
        }
      });
    },

    _start: function() {
      wx.showToast({
        title: '正在聆听中...',
        icon: 'none',
        mask: true,
        duration: 10000,
        success: () => {
          this.recorderManager.stop();
        }
      });
      this.recordStart();
    },

    onStart: function() {
      wx.authorize({
        scope: 'scope.record',
        success: () => {
          this._start();
        },
        fail: () => {
          wx.showModal({
            title: '提示',
            content: '您未授权录音，该功能将无法使用',
            showCancel: true,
            confirmText: "授权",
            confirmColor: "#52a2d8",
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (!res.authSetting['scope.record']) {
                      wx.showModal({
                        title: '提示',
                        content: '您未授权录音，功能将无法使用',
                        showCancel: false,
                        success: function (res) { }
                      });
                    } else {
                      this._start();
                    }
                  },
                  fail: () => {}
                });
              }
            }
          });
        }
      });
    },
    onEnd: function() {
      wx.hideToast();

      wx.showToast({
        title: '聆听结束...',
        icon: 'none',
        mask: true,
      });
    },
    setParam: function(d) {
      let source = d.origin,
        target = d.target

      this.setData({
        source: source,
        target: target
      });
    }
  }
})
