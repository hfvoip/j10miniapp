// pages/enhance/index.js.js
import { BTManager, ConnectStatus } from '../../wx-ant-ble/index.js';
const app = getApp()
Page({

  data: {
    leftdata:[],
    rightdata:[],
    tab:[
      {id:1,name:'音量',icon:'../../static/img/t1.png'},
      {id:2,name:'模式',icon:'../../static/img/t2.png'},
      {id:3,name:'频段',icon:'../../static/img/t3.png'},
    ],
    curId:1,
    current:{},
    n1:'0%',
    n2:'0%',
    n3:'0%',
    n4:'0%',
    n5:'0%',
    l1:'0%',
    l2:'0%',
    isLock:false,
    num1:{num:0,text:'0%'},
    num3: { num: 0, text: '0%' },
    num2: { num: 0, text: '0%'},
    num_ch1_cr: { num: 0, text: '0%' },
    num_ch2_cr: { num: 0, text: '0%' },
    num_ch3_cr: { num: 0, text: '0%' },
    num_ch4_cr: { num: 0, text: '0%' },

    ear_active_1:false,
    ear_active_2:false,
    active:false,
    model_active:1,
    spectrum_active:'',
    
  },
  toggleLock(e) {
    let lock = e.currentTarget.dataset.lock
    this.setData({
      isLock: !lock
    })
  },
  handleClick(e) {
    let data = e.currentTarget.dataset.item
    this.setData({
      curId:data.id,
      current: data,
      isLock:false
    })
  },
  changeLarge(e) {
    console.log(e.currentTarget.dataset.id)
    let id=e.currentTarget.dataset.id
    if(this.data.active==true){
      if(id=="l1"){  
        this.setData({
         ear_active_1:true,
        })
       }else if(id=='l2'){
         this.setData({
           ear_active_2:true
          })
       }
    }

    //e.detail.percent 换算为audiolabel  0--15
    var audiolevel = Math.floor(e.detail.precent * 0.15);

    this._setgain(audiolevel);
   

    if(this.data.isLock) {
        this.setData({
          l1:e.detail.precent+'%',
          l2:e.detail.precent+'%',
          num1: {num:e.detail.offset,text:e.detail.precent+'%'} 
        })
    }else {
      this.setData({
        [e.currentTarget.dataset.id]:e.detail.precent+'%'
      })

    }
  },
  onMyEvent:function(e){
    console.log(e.detail)
    if(e.detail==true){
      this.setData({
        active:true
      })
    }else{
      this.setData({
        active:false,
        ear_active_1:false,
        ear_active_2:false,
      })
     
    }
  },
  change(e) {
    if(this.data.isLock) {
      this.setData({
          n1:e.detail.precent+'%',
          n2:e.detail.precent+'%',
          n3:e.detail.precent+'%',
          n4:e.detail.precent+'%',
          n5:e.detail.precent+'%',
          num_ch1_cr: {num:e.detail.offset,text:e.detail.precent+'%'} ,
          num_ch2_cr: { num: e.detail.offset, text: e.detail.precent + '%' },
          num_ch3_cr: { num: e.detail.offset, text: e.detail.precent + '%' },
          num_ch4_cr: { num: e.detail.offset, text: e.detail.precent + '%' },

      })
  }else {
    this.setData({
      [e.currentTarget.dataset.id]:e.detail.precent+'%'
    })

  }
    console.log(e);
    var barid = e.currentTarget.dataset.id;
    var chid = 1;
    if (barid == 'n1') chid=1;
    if (barid == 'n2') chid = 2;
    if (barid == 'n3') chid = 3;
    if (barid == 'n4') chid = 4;
    if (barid == 'n5') chid = 5;


    var ch_cr = Math.floor(e.detail.precent * 0.5);
   _set_chcr(chid,ch_cr);

  },
  goBack() {
    wx.navigateBack()
  },
  modelItem(e){
    let num = e.currentTarget.dataset.num
   this.setData({
    model_active:num
   })
  },
  earTab(e){
    let name = e.currentTarget.dataset.name
    this.setData({
      spectrum_active:name
     })
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initBluetooth(); 
 
 

    this._querygain();


  
  },

  initBluetooth() {
    console.log("init bluetooth");
    // 初始化蓝牙管理器
    this.bt = new BTManager({
      debug: false
    });

    // 注册状态回调
    this.bt.registerDidUpdateConnectStatus(this.didUpdateConnectStatus.bind(this));

    this.bt.registerDidUpdateValueForCharacteristic(this.didUpdateValueForCharacteristic.bind(this));
    
  },

  _querygain() {
 
    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";

    this.bt.read({ suuid, cuuid })
      .then(res => {
        console.log('characteristic read', res);
      }).catch(e => {
        console.log('characteristic read', e);
      });


  },

  _set_chcr(chid,val) {
    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24"; 

    var array = new Uint8Array(3);
    array[0] = 0x00;
    array[1] =0x55;
    array[2] = gain;
   var cmd='00';
   if (chid==1)  cmd='19';
    if (chid == 2) cmd = '1b';
    if (chid == 3) cmd = '1d';
    if (chid == 4) cmd = '1f';
  



    var  str = cmd+ '55';
    var hex_gain = ''+val;
    if (val<10)
      hex_gain ='0'+hex_gain;


      
    str +=  hex_gain;
    console.log(str);
    this.bt.write({
      suuid,
      cuuid,
      value: str
    }).then(res => {
      console.log('characteristic write', res);
      
    }).catch(e => {
      console.log('characteristic write', e);
    })
 
  },
 


  encode_cr(val) {
    // 0x55 对应 5.5	 
    var digit2 = val % 10;
    var digit1 = (val - digit2) / 10;
    var newval = digit1 * 16 + digit2;
  //  console.log('encode:' + val + '==>' + newval);
    return newval;
  },
  decode_cr(val) {
    var digit2 = val % 16;
    var digit1 = (val - digit2) / 16;
    var newval = digit1 * 10 + digit2;
    console.log('decode:' + val + '==>' + newval);

    return newval;
  },


  didUpdateValueForCharacteristic(res) {

//value: "0a0002000a00c8000a00c8000a00c8000a0001000a00c8000f00190031000f00190031000f00190031000f001900310035000014003800130038001200380012000000000000000000000000000000000000000000000000000000000000000000000055"

    console.log('characteristic registerDidUpdateValueForCharacteristic', res);
    if (res.serviceId == "0000180F-0000-1000-8000-00805F9B34FB" &&
      res.characteristicId == "00002A19-0000-1000-8000-00805F9B34FB") {
      var value = parseInt(res.value, 16);

      this.setData({ "battery_level": value });

    }
    if (res.serviceId == "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24" &&
      res.characteristicId == "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24") {
       var str_value = res.value;
       var ilen = str_value.length/2;
      var arr_res = new Array(ilen);
       for (var i =0; i < ilen;i++)
         arr_res[i] = parseInt(str_value.substr(i*2,2),16);



      var audiolevel = arr_res[0];
      var noise = arr_res[2];
      var mode = arr_res[65];
      var ch1_cr = this.decode_cr(arr_res[51]);
      var ch2_cr = this.decode_cr(arr_res[55]);
      var ch3_cr = this.decode_cr(arr_res[59]);
      var ch4_cr = this.decode_cr(arr_res[63]); 
      var tmp1 = Math.floor(audiolevel*100.0/15.0);
      var res_num1 = {num:50,text:tmp1+'%'};     
      this.setData({num1:res_num1});
      //最大的cr 到 50,也就是5.0
      tmp1 = Math.floor(ch1_cr * 100.0 / 50.0);
      res_num1 = { num: 50, text: tmp1 + '%' };   
      this.setData({ num_ch1_cr: res_num1 });

      tmp1 = Math.floor(ch2_cr * 100.0 / 50.0);
      res_num1 = { num: 50, text: tmp1 + '%' };
      this.setData({ num_ch2_cr: res_num1 });

      tmp1 = Math.floor(ch3_cr * 100.0 / 50.0);
      res_num1 = { num: 50, text: tmp1 + '%' };
      this.setData({ num_ch3_cr: res_num1 });
      tmp1 = Math.floor(ch4_cr * 100.0 / 50.0);
      res_num1 = { num: 50, text: tmp1 + '%' };
      this.setData({ num_ch4_cr: res_num1 }); 


    }

  },

  didUpdateConnectStatus(res) {
    console.log('home registerDidUpdateConnectStatus', res);
    if (res.connectStatus === ConnectStatus.connected) {
      wx.hideLoading();
      wx.showToast({
        title: '连接上:' + res.device.name,
        icon: 'none'
      })

    } else if (res.connectStatus === ConnectStatus.disconnected) {
      wx.hideLoading();
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    }
  },
 

})