// components/tabnav/tabnav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array
    },
    defIndex: {
      type: Number,
      value: 0
    },
    bgColor: String
  },
  lifetimes: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick: function(e) {
      let curIndex = e.currentTarget.dataset.index;
      this.setData({
        currentIndex: curIndex
      });
      this.triggerEvent('tabchange', this.data.currentIndex);
    }
  }
})
