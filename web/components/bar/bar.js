// components/bar/bar.js
import { throttle, debounce } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLarge: {
      type: Boolean,
      value: false
    },
    precentData: {
      type: Object
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0,
    top: 0,
    startY: 0,
    elHeight: 0,
    barHeight: 0,
    circleHeight: 0,
    lastY: 0,
    barTop:0,
    barBottom:0,
    timer: null,
    text: '0%'
  },
  observers: {
    'precentData': function (precentData) {
      /*
      this.setData({
        top: precentData.num,
        height: precentData.num,
        text: precentData.text
      })
      */
    
      this.setPosition();
    },

  },
  lifetimes: {
    created() {
      // this.top = this.height = this.data.num
    },
    attached() {
      let obj = this.createSelectorQuery();
      obj.select('#bar').boundingClientRect((rect) => {
        
        this.setData({
          barHeight: rect.height,
          barTop:rect.top,
          barBottom:rect.bottom
        })
       
      })
      obj.select('.circle').boundingClientRect((rect) => {
        this.setData({
          circleHeight: rect.height
        })
        setTimeout(() => {
          this.setPosition()
        })
      })
      obj.exec();
    }
  },
  methods: {
    setPosition() {
      let min = this.data.barHeight - this.data.circleHeight / 2
      let max = this.data.circleHeight / 2 - 20
      let num = this.data.precentData.text.replace('%', '')
      let data = (100 - num + parseInt(max / (min - max) * 100)) / 100 * (min - max)
     // console.log(num);
     // console.log('L74: min:'+min+',max:'+max+',data:'+data);
      this.setData({
        height: data,
        top: data,
        text: this.data.precentData.text
      })
    },
    touchmove: throttle(function (e) {
      this.touchmoveFn(e)
    }, 500),
    touchmoveFn(e) {
      /*console.log(e);
    
      let y = e[0].changedTouches[0].pageY
      let moveY = y - this.data.startY
      let min = this.data.barHeight - this.data.circleHeight / 2
      let max = this.data.circleHeight / 2
      let offset = this.data.top + moveY / 50

      if (offset <= max) {
        offset = max
      }
      if (offset >= min) {
        offset = min
      }
      this.setData({
        top: offset,
        height: offset
      })
      let precent = 100 - parseInt(offset / (min - max) * 100) + parseInt(max / (min - max) * 100)
      // console.log(parseInt(max/(min-max)*100),offset,'dd')
      if (precent <= 1) {
        precent = 0
      }
      this.setData({
        text: precent + '%'
      })
      this.triggerEvent('change', { precent, offset })
      */

    },
    touchStart(e) {
      this.setData({
        startY: e.changedTouches[0].pageY
      })
      this.triggerEvent('myevent', { detail:true})
    },
    touchEnd(e) {
      /*
      let y = e.changedTouches[0].pageY
      let moveY = y - this.data.startY
      let min = this.data.barHeight - this.data.circleHeight / 2
      let max = this.data.circleHeight / 2
      let offset = this.data.top + moveY / 50

      console.log('l123:y'+y+',startY: '+this.data.startY+',moveY:'+moveY);
      console.log('l124:offset:'+offset);
      console.log('l124:'+'/ min: '+min+'max:'+ max);

      if (offset <= max) {
        offset = max
      }
      if (offset >= min) {
        offset = min
      }
      this.setData({
        top: offset,
        height: offset
      })
      let precent = 100 - parseInt(offset / (min - max) * 100) + parseInt(max / (min - max) * 100)
      // console.log(parseInt(max/(min-max)*100),offset,'dd')
      if (precent <= 1) {
        precent = 0
      }
      this.setData({
        text: precent + '%'
      })
      this.triggerEvent('change', { precent, offset })
      */
      this.triggerEvent('myevent', { detail: false })
    },
    changeoffset(e) {
      console.log(e.changedTouches[0]);
      console.log(this.data.barTop+' '+this.data.barBottom);

      let max = this.data.barHeight - this.data.circleHeight / 2
      let min = this.data.circleHeight / 2
      let offset = e.changedTouches[0].pageY - this.data.barTop;
 
    // console.log('min:'+min+',max:'+max+',offset:'+offset);

 
      if (offset <= min) {
        offset = min
      }
      if (offset >= max) {
        offset = max
      }

      this.setData({
        top: offset,
        height: offset
      })
      let precent = 100 - parseInt(offset / (max - min) * 100) + parseInt(min / (max - min) * 100)
      // console.log(parseInt(max/(min-max)*100),offset,'dd')
      if (precent <= 1) {
        precent = 0
      }
      this.setData({
        text: precent + '%'
      })
      this.triggerEvent('change', { precent, offset })
    },
    buttoncircleMove: function (e) {
     
      let max = this.data.barHeight - this.data.circleHeight / 2
      let min = this.data.circleHeight / 2
      var touchs = e.touches[0];
      var pageX = touchs.pageX;
      var pageY = touchs.pageY;
      
      let offset = pageY - this.data.barTop;

      if (offset <= min) {
        offset = min
      }
      if (offset >= max) {
        offset = max
      }

      //防止坐标越界,view宽高的一般
      this.setData({
        top: offset,
        height: offset
      })
      let precent = 100 - parseInt(offset / (max - min) * 100) + parseInt(min / (max - min) * 100)
   
      if (precent <= 1) {
        precent = 0
      }
      this.setData({
        text: precent + '%'
      })
     // this.triggerEvent('change', { precent, offset })
      
    },
    buttoncircleEnd:function(e) {
      let offset  =this.data.top;
      let max = this.data.barHeight - this.data.circleHeight / 2
      let min = this.data.circleHeight / 2

      let precent = 100 - parseInt(offset / (max - min) * 100) + parseInt(min / (max - min) * 100)

      if (precent <= 1) {
        precent = 0
      }
      this.triggerEvent('change', { precent, offset });

    }

  }
})