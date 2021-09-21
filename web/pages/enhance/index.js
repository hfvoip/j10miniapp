// pages/enhance/index.js.js
import { BTManager, ConnectStatus } from '../../wx-ant-ble/index.js';
const app = getApp()
Page({

  data: {
   
 
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
    num_ch1_th: { lth:20,uth:40, text: '0%' },
    num_ch2_th: { lth: 20, uth: 40, text: '0%' },
    num_ch3_th: { lth: 20, uth: 40, text: '0%' },
    num_ch4_th: { lth: 20, uth: 40, text: '0%' },

    num_eq0: { num: 0, text: '50%' }, 
    num_eq1: { num: 0, text: '50%' },
    num_eq3: { num: 0, text: '50%' },
    num_eq6: { num: 0, text: '50%' },
    num_eq8: { num: 0, text: '50%' },
    num_eq12: { num: 0, text: '50%' },
    val_eq0: '0',
    val_eq1: '0',
    val_eq3: '0',
    val_eq6: '0',
    val_eq8: '0',
    val_eq12: '0',
    ear0_id: null,
    ear1_id: null,
    ear0_data: "",
    ear1_data: "",

    ear_active_1:false,
    ear_active_2:false,
    active:false,
    model_active:1,
    refresh_data:0,
    ts_tapstart:0,
    ts_tapend:0,
    spectrum_active:'',
    
  },
  toggleLock(e) {
    let lock = e.currentTarget.dataset.lock
    this.setData({
      isLock: !lock
    }) 
   this. _refresh_earstatus_bylock();
    
  },
  handleClick(e) {
    let data = e.currentTarget.dataset.item
    this.setData({
      curId:data.id,
      current: data,
      
    })
    if (this.data.refresh_data ==1) { 
      this._querygain();
   
    }
  },
  changeLarge(e) {
    console.log(e)
    let id=e.currentTarget.dataset.id
    if(this.data.isLock==false){
      if(id=="l1"){  
        this.setData({
          ear_active_1:true,
          ear_active_2: false,
        })
       }else if(id=='l2'){
         this.setData({
           ear_active_2:true,
           ear_active_1: false,
          })
       }
    }

    //e.detail.percent 换算为audiolabel  0--15
    var audiolevel = Math.floor(e.detail.precent * 0.15);
 

    if(this.data.isLock) {
        this.setData({
          l1:e.detail.precent+'%',
          l2:e.detail.precent+'%',
          num1: {num:e.detail.offset,text:e.detail.precent+'%'} ,
          num3: { num: e.detail.offset, text: e.detail.precent + '%' } 
        })
    }else {
      this.setData({
        [e.currentTarget.dataset.id]:e.detail.precent+'%'
      })

    }
    this._set_gain(audiolevel);
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
    

    this.setData({
      [e.currentTarget.dataset.id]: e.detail.precent + '%'
    })
    //console.log(e);
    var barid = e.currentTarget.dataset.id;
    
    var ch_cr = Math.floor(e.detail.precent );

    if (barid=="eq0") { 
       this._set_eqid(0,ch_cr);
      this.setData({'val_eq0':this.convert_percent_textval(ch_cr)});
    }
    if (barid == "eq1") {
      this._set_eqid(1, ch_cr);
      this.setData({ 'val_eq1': this.convert_percent_textval(ch_cr) });
     
    }
    if (barid == "eq3") {
   //   this._set_eqid(2, ch_cr);
      this._set_eqid(3, ch_cr);
   //   this._set_eqid(4, ch_cr);
      this.setData({ 'val_eq3': this.convert_percent_textval(ch_cr) });
    }
    if (barid == "eq6") {
     // this._set_eqid(5, ch_cr);
      this._set_eqid(6, ch_cr);
      this.setData({ 'val_eq6': this.convert_percent_textval(ch_cr) });
    }
    if (barid == "eq8") {
    //  this._set_eqid(7, ch_cr);
      this._set_eqid(8, ch_cr);
    //  this._set_eqid(9, ch_cr);
    //  this._set_eqid(10, ch_cr);
      this.setData({ 'val_eq8': this.convert_percent_textval(ch_cr) });
    }
    if (barid == "eq12") {
   //   this._set_eqid(11, ch_cr);
      this._set_eqid(12, ch_cr);
     // this._set_eqid(13, ch_cr);
     // this._set_eqid(14, ch_cr);
     // this._set_eqid(15, ch_cr);
      this.setData({ 'val_eq12': this.convert_percent_textval(ch_cr) });
    }

  },

  change_th(e) {
    let lth = e.detail.lth;
    if (this.data.isLock) {
      this.setData({
        n1: e.detail.precent + '%',
        n2: e.detail.precent + '%',
        n3: e.detail.precent + '%',
        n4: e.detail.precent + '%',
        n5: e.detail.precent + '%',
     /*   num_ch1_th: { num: e.detail.offset, text: e.detail.precent + '%' },
        num_ch2_th: { num: e.detail.offset, text: e.detail.precent + '%' },
        num_ch3_th: { num: e.detail.offset, text: e.detail.precent + '%' },
        num_ch4_th: { num: e.detail.offset, text: e.detail.precent + '%' },
      */
      })
    } else {
      this.setData({
        [e.currentTarget.dataset.id]: e.detail.precent + '%'
      })

    }
    //console.log(e);
    var barid = e.currentTarget.dataset.id;
    var chid = 1;
    if (barid == 'n1') chid = 1;
    if (barid == 'n2') chid = 2;
    if (barid == 'n3') chid = 3;
    if (barid == 'n4') chid = 4;
    if (barid == 'n5') chid = 5;

    //% 转换回 0--65 
    var ch_cr = Math.floor(e.detail.precent * 0.65);
    console.log(ch_cr)
    if (lth ==1)
      this._set_chlth(chid, ch_cr);

    if (lth == 0)
      this._set_chuth(chid, ch_cr);

  },

  goBack() {
    wx.navigateBack()
  },
  modelTouchstart(e) {
    let that = this;
    that.setData({
      ts_tapstart: e.timeStamp
    })

  },
  modelTouchend(e) {
    let that = this;
    that.setData({
      ts_tapend: e.timeStamp
    })
  },

  modelItem(e){
    let num = e.currentTarget.dataset.num
    let that = this;
    var touchTime = that.data.ts_tapend - that.data.ts_tapstart;
    console.log(touchTime);

    if (touchTime <1000) {  

      that.setData({
        model_active:num,
        refresh_data:1,
      });
      that._set_mem(num);
    } else {

      if (num != this.data.model_active) {

        that.setData({
          model_active: num,
          refresh_data: 1,
        });
        that._set_mem(num);
        return;
      } 

      wx.showActionSheet({
        itemList: ["保存配置", "恢复设置", "切换模式"],
        success(res) {

       
          if (res.tapIndex === 0) { that._memop(num,"save"); }
          else if (res.tapIndex === 1) { that._memop(num, "read"); }
          else if (res.tapIndex === 2) { that._memop(num, "switch");; }
        }
      });
      that.setData({       
        refresh_data: 1,
      });
     

    }



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
    this._querygain();

    
  },
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initBluetooth();  

    this._set_mem(this.data.model_active);
    


  
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

  _querygain() {

    if (this.data.ear_active_1 == true)
       this._read_fromha_bydevid( this.data.ear0_id);
    if (this.data.ear_active_2 == true) 
       this._read_fromha_bydevid( this.data.ear1_id);
  
 

  },


  _set_gain(  val) {
    var that = this;

    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";
 
    var cmd = '00'; 
    var str = cmd + '55';
    var hex_gain = val.toString(16);
    if (hex_gain.length<2) 
       hex_gain = '0' + hex_gain; 

    str += hex_gain; 
   
    that._write_toha(str); 
    

     

  },




  _set_chcr(chid,val) {
   
 
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
 
    this._write_toha(str); 
 
  },


  _set_chlth(chid, val) { 

    var cmd = '00';
    if (chid == 1) cmd = '0c';
    if (chid == 2) cmd = '0f';
    if (chid == 3) cmd = '12';
    if (chid == 4) cmd = '15';  

    var str = cmd + '55';
    var hex_gain = val.toString(16);
    if (hex_gain.length < 2)
      hex_gain = '0' + hex_gain; 
   



    str += hex_gain;
    console.log(str);
    this._write_toha(str);

  },

  _set_chuth(chid, val) { 

    var cmd = '00';
    if (chid == 1) cmd = '0d';
    if (chid == 2) cmd = '10';
    if (chid == 3) cmd = '13';
    if (chid == 4) cmd = '16'; 

    var str = cmd + '55';
    var hex_gain = val.toString(16);
    if (hex_gain.length < 2)
      hex_gain = '0' + hex_gain;  

    str += hex_gain;
    console.log(str);
    this._write_toha(str);

  },

  _set_eqid(eqid, val) {


    var cmd = 0x26;
 
    var arr_cmds = [ 0x26,0x27,0x28,0x29,0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x40,0x41];
    if (eqid <0 )  eqid=0;
    if (eqid>15)  eqid=15;
     
    cmd = arr_cmds[eqid];

    var byteval = this.convert_percent_eq(val);
    byteval = byteval.toString(16);

    var str = ''+cmd.toString(16) + '55';
    var hex_gain = '' + byteval;
    if (byteval.length <2)
      hex_gain = '0' + byteval;
 

    str += hex_gain;
    console.log(str);
    
    this._write_toha(str);
    

  },

  _set_mem(val) {
    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";

    var cmd = '20';
    var str = cmd + '55';
    //val 从1到6,对应0a-0f
    var hex_gain = '00';
    if (val == 1) hex_gain = '0a';
    if (val == 2) hex_gain = '0b';
    if (val == 3) hex_gain = '0c';
    if (val == 4) hex_gain = '0d';
    if (val == 5) hex_gain = '0e';
    if (val == 6) hex_gain = '0f';

    str += hex_gain;
    console.log(str); 
    this._write_toha(str);
    


  },
  _memop( mem_idx,opcode) { 
    var cmd = '20';
    if (opcode =='save') cmd='21';
    if (opcode == 'init') cmd = '23';
    if (opcode == 'switch') cmd = '20';
    if (opcode == 'read')  {return;}



    var str = cmd + '55';
    //val 从1到6,对应0a-0f
    var hex_gain = '00';
    if (mem_idx == 1) hex_gain = '0a';
    if (mem_idx == 2) hex_gain = '0b';
    if (mem_idx == 3) hex_gain = '0c';
    if (mem_idx == 4) hex_gain = '0d';
    if (mem_idx == 5) hex_gain = '0e';
    if (mem_idx == 6) hex_gain = '0f';

    str += hex_gain;
    console.log(str);
    this._write_toha(str);
  },

  _refresh_earstatus_bylock() {
    if (this.data.isLock) {
      this.setData(
        {ear_active_1:false,
        ear_active_2:false }
      )
    } else {
      //do nothing
    }

  }, 

  _write_toha(str) {


    if (this.data.isLock) {
      this._write_toha_bydevid(str,this.data.ear0_id );
      this._write_toha_bydevid(str,this.data.ear1_id );
      return ;
    }  

    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24"; 

    this.bt.write({
      suuid,
      cuuid,
      value: str
    }).then(res => {
      console.log('characteristic write', res);
      this._querygain();

    }).catch(e => {
      console.log('characteristic write', e);
    })

  },

  _write_toha_bydevid(str,ear_dev) {

    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";
    if (ear_dev == null || ear_dev=="") return ;

    this.bt.writebydevid({
      deviceid: ear_dev.deviceId,
      suuid,
      cuuid,
      value: str
    }).then(res => {
      console.log('characteristic write', res);
      this._querygain();
    

    }).catch(e => {
      console.log('characteristic write', e);
    })

  },


  _read_fromha_bydevid(ear_dev) {
   
    let suuid = "E093F3B5-00A3-A9E5-9ECA-40016E0EDC24";
    let cuuid = "E093F3B5-00A3-A9E5-9ECA-40036E0EDC24";
    if (ear_dev == null || ear_dev == "") return;
   
    this.bt.readbydevid({
      deviceid: ear_dev.deviceId,
      suuid,
      cuuid
    }).then(res => {
      console.log('characteristic read', res);
      wx.hideLoading({
        success: (res) => {},
      })

    }).catch(e => {
      console.log('characteristic read', e);
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '读取BLE出错',
      }) 
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
       
       if (ilen <100)  return ;

      if (this.data.ear0_id.deviceId && res.deviceId == this.data.ear0_id.deviceId) {
        this.setData({ ear0_data: res.value });
      } else {
        if (this.data.ear1_id.deviceId && res.deviceid == this.data.ear1_id.deviceId) {
          this.setData({ ear1_data: res.value });
        }

      }

      var arr_res = new Array(ilen);
       for (var i =0; i < ilen;i++)
         arr_res[i] = parseInt(str_value.substr(i*2,2),16); 

      var audiolevel = arr_res[0];
      var noise = arr_res[2];
      var mode = arr_res[65]; 

      var eq0 = arr_res[80];
      var eq1 = arr_res[81]; 
      var eq2 = arr_res[82];
      var eq3 = arr_res[83]; 
      var eq4 = arr_res[84];
      var eq5 = arr_res[85]; 
      var eq6 = arr_res[86];
      var eq7 = arr_res[87]; 
      var eq8 = arr_res[88];
      var eq9 = arr_res[89]; 
      var eq10 = arr_res[90];
      var eq11 = arr_res[91]; 
      var eq12 = arr_res[92]; 
      var eq13 = arr_res[93]; 
      var eq14 = arr_res[94]; 
      var eq15 = arr_res[95]; 
  

      var tmp1 = Math.floor(audiolevel*100.0/15.0);
      var res_num1 = {num:50,text:tmp1+'%'};     
      this.setData({num1:res_num1});
      

      tmp1 = this.convert_eq_percent(eq0);
      res_num1 = { num: eq0, text: tmp1 + '%' };
 

      this.setData({ num_eq0:res_num1});

      tmp1= this.convert_eq_value(eq0);
      this.setData({ val_eq0: tmp1 });

      tmp1 = this.convert_eq_percent(eq1);
      res_num1 = { num: eq1, text: tmp1 + '%' };
      this.setData({ num_eq1: res_num1 }); 

      tmp1 = this.convert_eq_value(eq1);
      this.setData({ val_eq1: tmp1 });

      tmp1 = this.convert_eq_percent(eq3);
      res_num1 = { num: eq1, text: tmp1 + '%' };
      this.setData({ num_eq3: res_num1 }); 

      tmp1 = this.convert_eq_value(eq3);
      this.setData({ val_eq3: tmp1 });

      tmp1 = this.convert_eq_percent(eq6);
      res_num1 = { num: eq1, text: tmp1 + '%' };
      this.setData({ num_eq6: res_num1 }); 

      tmp1 = this.convert_eq_value(eq6);
      this.setData({ val_eq6: tmp1 });

      tmp1 = this.convert_eq_percent(eq8);
      res_num1 = { num: eq1, text: tmp1 + '%' };
      this.setData({ num_eq8: res_num1 }); 

      tmp1 = this.convert_eq_value(eq8);
      this.setData({ val_eq8: tmp1 });

      tmp1 = this.convert_eq_percent(eq12);
      res_num1 = { num: eq12, text: tmp1 + '%' };
      this.setData({ num_eq12: res_num1 });

      tmp1 = this.convert_eq_value(eq12);
      this.setData({ val_eq12: tmp1 });

      


    }

  },

  convert_eq_percent(val) {
    let offset=0;
    if (val >=0x15)  {  offset=0; return '0'};
    if (val == 0x14) { offset = 1; return '10'; }
      if (val == 0x13) { offset = 2; return '20'; }
      if (val == 0x12) { offset = 3; return '30'; }
      if (val == 0x11) { offset = 4; return '40'; }
      if (val == 0x0) { offset = 5; return '50'; }
      if (val == 0x1) { offset = 6; return '60'; }
    if (val == 0x2) {offset = 7; return '70';}
    if (val == 0x3) {offset = 8;  return '80';}
    if (val == 0x4) { offset = 8; return '90'; }
    if (val >= 0x5) { offset = 8; return '100'; }
    
  },
  convert_eq_value(val) {
    let offset = 0;
    if (val >= 0x15) { offset = 0; return '-5' };
    if (val == 0x14) { offset = 1; return '-4'; }
    if (val == 0x13) { offset = 2; return '-3'; }
    if (val == 0x12) { offset = 3; return '-2'; }
    if (val == 0x11) { offset = 4; return '-1'; }
    if (val == 0x0) { offset = 5; return '0'; }
    if (val == 0x1) { offset = 6; return '1'; }
    if (val == 0x2) { offset = 7; return '2'; }
    if (val == 0x3) { offset = 8; return '3'; }
    if (val == 0x4) { offset = 8; return '4'; }
    if (val >= 0x5) { offset = 8; return '5'; }
    return '0';


  },
  convert_percent_eq(val) {
    let offset = 0;
    if (val<=0) return 0x15;
    if (val <= 10) return 0x14;
    if (val <= 20) return 0x13;
    if (val <= 30) return 0x12;
    if (val <= 40) return 0x11;
    if (val <= 50) return 0x0;
    if (val <= 60) return 0x1;
    if (val <= 70) return 0x2;
    if (val <= 80) return 0x3;
    if (val <= 90) return 0x4;
    return 0x5; 
  },


  convert_percent_textval(val) {
    let offset = 0;
    if (val <= 0) return '-5';
    if (val <= 10) return '-4';
    if (val <= 20) return '-3'; 
    if (val <= 30) return '-2';
    if (val <= 40) return '-1';
    if (val <= 50) return '0';
    if (val <= 60) return '1';
    if (val <= 70) return '2';
    if (val <= 80) return '3';
    if (val <= 90) return '4';
    return '5';
  },

  didUpdateConnectStatus(res) {
    console.log('home registerDidUpdateConnectStatus', res);
    if (res.connectStatus === ConnectStatus.connected) {
      wx.hideLoading();
      wx.showToast({
        title: '连接上:' + res.device.name,
        icon: 'none'
      });
      this._querygain();

    } else if (res.connectStatus === ConnectStatus.disconnected) {
      wx.hideLoading();
      wx.showToast({
        title: '蓝牙连接断开',
        icon: 'none'
      });
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  },
 

})