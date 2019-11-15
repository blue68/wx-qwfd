// components/selectbox/selectbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    languages: { "中文": "zh", "英文": "en", "日文": "jp", "韩文": "kr"},
    ars: ['英文', '日文', '韩文'],
    index: 0,
    model: 0,
    origin: 'en',
    target: 'zh'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function (e) {
      let index = e.detail.value;
      this.setData({
        index: index
      });

      let k = this.data.ars[index];
      let v = this.data.languages[k];

      if(this.data.model == 0) {
        this.setData({
          origin: v
        });
      } else {
        this.setData({
          target: v
        });
      }
      
      this.triggerEvent('tabchange', this.data);
    },
    tabClick: function() {
      let model = this.data.model;

      if(this.data.model == 0) {
        model = 1;
      } else {
        model = 0;
      }
      
      this.setData({
        model: model,
        origin: this.data.target,
        target: this.data.origin
      });
      this.triggerEvent('tabchange', this.data);
    }
  }
})
