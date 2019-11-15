import Util from '../../../utils/util';
import Api from '../../../utils/aiApi';

let timer = 0;

Component({
  properties: {
    source: String,
    target: String,
    contHeight: Number
  },
  data: {
    source: '', // 源语言
    target: '', // 目标语言
    orgText: '', // 待翻译文本
    transText: '', // 翻译后文本
    isShowClear: false,
    txtHeight: 350
  },
  methods: {
    onLoad: function () {
      this.setData({
        source: this.data.source,
        target: this.data.target,
        txtHeight: this.data.contHeight / 2
      })
    },
    confirm: function (e) {
      let self = this;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(function () {
        let txt = e.detail.value;
        self.texttranslate(txt);
      }, 500);
    },
    // 执行文本翻译
    texttranslate: function (txt) {
      let self = this;
      let _txt = txt ? txt : self.data.orgText;

      Util.AiReq({
        url: Api.nlp_texttranslate,
        data: {
          "source": self.data.source,
          "target": self.data.target,
          "text": _txt
        },
        header: 'application/x-www-form-urlencoded',
        method: 'POST',
        success: function (d) {
          if (d.data.ret == 0) {
            let _data = d.data.data;
            self.setData({
              orgText: _txt,
              isShowClear: true,
              transText: _data.target_text
            });
          }
        },
        fail: function (e) {
          console.log('fail', e)
        }
      })
    },
    clearAll: function () { // 清空文本内容
      this.setData({
        orgText: '',
        transText: '',
        isShowClear: false
      })
    },
    setParam: function(d) {
      let source = d.origin,
        target = d.target,
        model = d.model;

      this.setData({
        source: source,
        target: target
      });

      this.texttranslate();
      if (model == 0) {
        this.clearAll(); // 源语言和目标语言切换清除当前待翻译内容
      }
    }
  }
});