// pages/index/puretone.js
import { BTManager, ConnectStatus } from '../../wx-ant-ble/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    freqs: [
    
      { id: 1, name: '500Hz', icon: '../../static/img/t2.png' },
      
      { id: 2, name: '1kHz', icon: '../../static/img/t3.png' },
     
      { id: 3, name: '2kHz', icon: '../../static/img/t3.png' },
    
      { id: 4, name: '4kHz', icon: '../../static/img/t3.png' },
      

    ],
    ears:[
      { id: 1, name: '左耳', icon: '../../static/img/t1.png' },
      { id: 2, name: '右耳', icon: '../../static/img/t2.png' },

    ],
    arr_freqname:['',' 500Hz','1000Hz','2000Hz','4000Hz','',''],
    arr_left_hl:[],
    arr_right_hl:[],
    curId: 1,
    curGain:-15,
    is_play:0,   
    timer:null,
    step:0,
    repeat:0,
    play_msg:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.active_ear =='0') {
      this.setData({
        ear_active_1: true,
        ear_active_2: false,
        isLock: false
      })
    }
    if (options.active_ear == '1') {
      this.setData({
        ear_active_1: false,
        ear_active_2: true,
        isLock: false
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.initBluetooth();  
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    console.log("onhide");
    if (this.timer) {
      clearTimeout(this.timer);
    }

  
    //发送一条指令给ble
   

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    console.log("onunload");
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  earTab(e){
    let name = e.currentTarget.dataset.name
    if (name =='zuo') {
      this.setData({
        ear_active_1: true,
        ear_active_2:false,
        isLock:false
      })

    }
    if (name == 'you') {
      this.setData({
        ear_active_1: false,
        ear_active_2: true,
        isLock: false
      })
    }
     

    
  },
  
  initBluetooth() {
    console.log("init bluetooth");
    // 初始化蓝牙管理器
    this.bt = new BTManager({
      debug: false
    });


    this.data.ear0_id = wx.getStorageSync("ear0_id") || null;
    this.data.ear1_id = wx.getStorageSync("ear1_id") || null;

    
    // 注册状态回调
    this.bt.registerDidUpdateConnectStatus(this.didUpdateConnectStatus.bind(this));

    this.bt.registerDidUpdateValueForCharacteristic(this.didUpdateValueForCharacteristic.bind(this));
    
    
  },

  

  didUpdateValueForCharacteristic(res) {
 
        console.log('characteristic registerDidUpdateValueForCharacteristic', res); 
    
  },
    
  didUpdateConnectStatus(res) {
    console.log('home registerDidUpdateConnectStatus', res); 
  },
 
  
  enter_puretone(  val) {
    var that = this;

    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";  
    var str = '425555'; 
    that._write_toha(str);  

  },
  
  exit_puretone(  val) {
    var that = this;

    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";  
    var str = '420a0a'; 
    that._write_toha(str);  

  },

  
  _write_toha(str) { 

    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24"; 

    this.bt.write({
      suuid,
      cuuid,
      value: str
    }).then(res => {
      console.log('writed:',str)
      console.log('characteristic write', res);
      

    }).catch(e => {
      console.log('characteristic write', e);
    })

  },

  // 生成特定分贝的波形
  // http://www.javashuo.com/article/p-fmkracsn-ck.html
  genAudio:function(freq, db){ 
    var f = 1000;
    var fs = 48000
    var db = -10.0;
    var duration = 10;
    var incr = 2 * pi * f / fs;// 数字频率，也是相邻两个采样点的变化的弧度
    var   A = powf(10, db / 20); // 波形的最大幅度值
    var arr_len = duration*fs; 
    var frame = new Array(arr_len); 
    for (var i = 0; i < arr_len; i++)
      frame[i] = A * sin(i * incr);

      return frame;


 },
 toggle_play:function(e) {
   var that = this;
    var is_play = that.data.is_play;
    if (is_play ==1)  is_play = 0;
    else
    is_play = 1;

    that.setData({is_play:is_play});
    if (is_play) {
      //发一个蓝牙信号

      this.enter_puretone(1);
      this.timer = setTimeout(this.playSine, 3000);
    } else {
      this.exit_puretone(1);
      clearTimeout(this.timer);
    }

 },
 canhear:function(e) {
    var that = this;
    var gain = 0;
    var curGain = that.data.curGain;
    var curId = that.data.curId;
   
    

    that.save_ear_hl(curId,curGain);
    curId ++;
    curGain =-15;
    that.setData({curId:curId,curGain:curGain});
   
    this.timer = setTimeout(this.playSine, 3000);


 },
 cannothear:function(e) {
    var that = this;
    var gain = 0;
    var curGain = that.data.curGain;
    var curId = that.data.curId;
   
    this.timer = setTimeout(this.playSine, 3000);
     

 }, 
 playSine:function(e) {
   //根据step, repeat 放音
   //播放curId
   var that = this;
   var gain = 0;
   var curGain = that.data.curGain;
   var curId = that.data.curId;
   if (curGain <0)  gain = 0xf0 -curGain;
   else
    gain = curGain;
 
    var play_msg ="";
    if (curId==1)  play_msg="500 hz";
    if (curId==2)  play_msg="1000 hz";
    if (curId==3)  play_msg="2000 hz";
    if (curId==4)  play_msg="4000 hz";
    

    if ((curId >4)) {

        curId = 1;
        curGain = -15;
        
        that.setData({curId:curId,curGain:curGain,is_play:0});
        that.exit_puretone(1);
        that.promptdone(1);



    } else {  
      var str = '42'+'0'+curId+ gain.toString(16);
      that._write_toha(str);  
      that.setData({play_msg:"正在播放:"+ play_msg});
      curGain  = curGain+1; 
      that.prompthear(play_msg);


      if (curGain >=0x70) {
        curId ++;
        curGain = -15;
      }
      that.setData({curId:curId,curGain:curGain});
  }
  
   


   

 },
 prompthear:function(msg) {
  var that = this;
  wx.showModal({
    title:'播放'+msg,
    content:'可以听见吗',
    confirmText:'是',
    cancelText:'否',
    success:function(res) {
        if (res.confirm) {
            that.canhear(1);
        }
        if (res.cancel) {
            that.cannothear(1);
        }
      
    }
   
  })
 },

 promptdone:function(msg) {
  var that = this;

  var earid=1;
  var str_res = "";
  var str_one = "";
  var arr_hl =null;
  if (that.data.ear_active_1 ) earid=1;
  if (that.data.ear_active_2 ) earid=2;
  if (earid==1) {
    arr_hl = that.data.arr_left_hl;
  }
  if (earid==2) {
    arr_hl = that.data.arr_right_hl; 
  }

    str_one ="";
    for (var i in arr_hl) {
      str_one = that.data.arr_freqname[i]+':'+ arr_hl[i];
      str_res +=str_one+'\r\n'; 

    }
   
  
  wx.showModal({
    title:'完成，以下是评估结果',
    content: str_res,
        success:function(res) {
        if (res.confirm) {
           
        }
        if (res.cancel) {
           
        }
      
    }
   
  })
 },

 save_ear_hl:function(freqid,gain) {
   var that = this;
   var earid=1;
   if (that.data.ear_active_1 ) earid=1;
   if (that.data.ear_active_2 ) earid=2;
   if (earid==1) {
     var arr_left_hl = that.data.arr_left_hl;
     arr_left_hl[freqid] = gain; 
     that.setData({arr_left_hl:arr_left_hl});

   }
   if (earid==2) {
    var arr_right_hl = that.data.arr_right_hl;
    arr_right_hl[freqid] = gain; 
    that.setData({arr_right_hl:arr_right_hl});
    
  }
 },
  // 作者：Lain
   // 链接：https://juejin.cn/post/6844904049972609037
  playAudio:function(e) {
    console.log(e);
    

    let audioCtx = wx.createInnerAudioContext();
     audioCtx.autoplay = true; 
     audioCtx.src='https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.mp3';
     audioCtx.volume =0.5;
    setTimeout(() => {
      audioCtx.play();
 
    }, 300);
    
  }
})


  /*
    function decodeAudioData(audioContext, url) {
      return new Promise((resolve) => {
        axios({
          method: 'get',
          url: url,
          responseType: 'arraybuffer'
        }).then((res) => {
          audioContext.decodeAudioData(res.data, (buffer) => {
            resolve(buffer);
          })
        })
      })
    }
    
    let buffer = decodeAudioData(audioContext, 'assets/music/test.mp3');

    buffer.then((res) => {
      audioSource.buffer = res;

      audioSource.connect(gainNode)
      gainNode.gain.value = 0.5
      gainNode.connect(audioContext.destination);

      audioSource.start()
    })
    */
