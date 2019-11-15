import Util from '../../../utils/util';
import Api from '../../../utils/aiApi';
const app = getApp();


Component({

  /**
   * 页面的初始数据
   */
  properties: {
    source: String,
    target: String
  },

  data: {
    files: [],
    show: false,
    content: '',
    source: '', // 源语言
    target: '', // 目标语言
  },

  lifetimes: {
    created: function () {
      this.userId = app.getGlobalData().userId;
    },
    attached: function () {

    }
  },

  methods: {
    onChoosel: function() {
      wx.showLoading({
        title: '正在加载中...',
      });

      let that = this;

      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          const tempFilePath = res.tempFilePaths[0];

          if(!tempFilePath.match(/.*.(png|jpg|bmp)/)) {
            wx.hideLoading()
            wx.showToast({
              title: '暂不支持该格式的图片，请选择png、jpg、bmp格式',
              icon: 'none'
            });
            return
          }

          var fileSize = res.tempFiles[0].size;

          if (fileSize / (1024 * 1024) > 1) {
            wx.hideLoading()
            wx.showToast({
              title: '图片大小超过1M',
              icon: 'none'
            });
            return
          };

          that.data.files = [];
          that.data.files.push(tempFilePath)
          that.setData({
            files: that.data.files,
            show: true
          });

          let fileSystemManger = wx.getFileSystemManager();

          fileSystemManger.readFile({
            filePath: tempFilePath,
            success: function (res) {
              let chunk = wx.arrayBufferToBase64(res.data);
              that.ocrImage(chunk)
            }
          });
        },
      })
    },
    ocrImage: function(data) {
      let that = this;
      Util.AiReq({
        url: Api.nlp_imagetranslate,
        data: {
          "scene": 'word',
          "source": this.data.source,
          "target": this.data.target,
          "image": data,
          "session_id": this.userId
        },
        header: 'application/x-www-form-urlencoded',
        method: 'POST',
        success: (res) => {
          if (res.data.ret == 0) {
            wx.hideLoading()

            that.setData({
              content: res.data.data.image_records
            });
          } else {
            wx.showToast({
              title: '系统繁忙请稍后重试...',
              icon: 'none',
              mask: true,
              duration: 1000
            });
          }
        },
        fail: (e) => {
        }
      });
    },
    previewImage: function (e) {
      wx.previewImage({
        current: e.currentTarget.id,
        urls: this.data.files
      })
    },
    setParam: function (d) {
      let source = d.origin,
        target = d.target

      this.setData({
        source: source,
        target: target
      });
    }
  }
})