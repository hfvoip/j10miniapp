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
    num_eq2: { num: 0, text: '50%' },
    num_eq3: { num: 0, text: '50%' },
    num_eq4: { num: 0, text: '50%' },
    num_eq5: { num: 0, text: '50%' },
    val_eq0: '0',
    val_eq1: '0',
    val_eq2: '0',
    val_eq3: '0',
    val_eq4: '0',
    val_eq5: '0',
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
    arr_active_eardata:null,
    
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

    //e.detail.percent 换算为audiolabel  0%-100% =>0-40
    var audiolevel = Math.floor(e.detail.precent * 0.4);
    var delta_audiolevel = audiolevel - this.arr_active_eardata[37] ;
    
    var bpass = 1;
    var tmp_gain = 0;
    for (var i=0;i<8;i++) {
      tmp_gain =  this.arr_active_eardata[36+i] +delta_audiolevel;
      if ((tmp_gain <0) || (tmp_gain >40)) {
        bpass = 0;
        break;
      } 
    }
    if (bpass ==0)
    return;

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
    for (var i=0;i<8;i++) { 
      this.arr_active_eardata[36+i] = this.arr_active_eardata[36+i] +delta_audiolevel;;
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
    var tmp_eqval = this.convert_percent_textval(ch_cr);
     
    if (barid=="eq0") { 
      this.arr_active_eardata[80] = tmp_eqval; // tmp_eqval;
     
      console.log('ch_cr='+ch_cr+', eqval='+ tmp_eqval);
       this._set_eqid(0,ch_cr);
      this.setData({'val_eq0':tmp_eqval});
    }
    if (barid == "eq1") {
      this.arr_active_eardata[81] = tmp_eqval;
      this._set_eqid(1, ch_cr);
      this.setData({ 'val_eq1': tmp_eqval  });
     
    }
    if (barid == "eq2") {
      this.arr_active_eardata[82] = tmp_eqval;
      this._set_eqid(2, ch_cr);
      this.setData({ 'val_eq2': tmp_eqval });
     
    }
    if (barid == "eq3") { 
      this.arr_active_eardata[83] = tmp_eqval;
      this._set_eqid(3, ch_cr); 
      this.setData({ 'val_eq3': tmp_eqval});
    }
    if (barid == "eq4") { 
      this.arr_active_eardata[84] = tmp_eqval;
      this._set_eqid(4, ch_cr); 
      this.setData({ 'val_eq4': tmp_eqval });
    }

    if (barid == "eq5") {
   
     this.arr_active_eardata[85] = tmp_eqval;
      this._set_eqid(5, ch_cr);
      this.setData({ 'val_eq5':  tmp_eqval });
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

    if (this.arr_active_eardata == null) {
      this.arr_active_eardata = new Array(100);
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
    this._querygain();
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
 
    
    var str = "";
    for (var i=0;i<100;i++) {
      var byteval = this.arr_active_eardata[i];
      

      byteval = byteval.toString(16);
      var hex_gain = '' + byteval;
      if (byteval.length <2)
        hex_gain = '0' + byteval;

      str += hex_gain;

    }
    console.log(str);
    
    this._write_toha(str);

  },




  _set_chcr(chid,val) {
    
 
  },


  _set_chlth(chid, val) { 
 

  },

  _set_chuth(chid, val) { 
 

  },

  _set_eqid(eqid, val) {
 
   
    var str = "";
    for (var i=0;i<100;i++) {
      var byteval = this.arr_active_eardata[i];
      byteval = byteval.toString(16);
      var hex_gain = '' + byteval;
      if (byteval.length <2)
        hex_gain = '0' + byteval;

      str += hex_gain;

    }
    console.log(str);
    
    this._write_toha(str);
    

  },

  _set_mem(val) {
     
    var str = "aa0000";
    //val 1::4=>01::03
    str +='0';

    str +=(val-1); 
    console.log(str);
    
    this._write_toha(str);
    


  },
  _memop( mem_idx,opcode) { 
    
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

         for (var i=0;i<ilen ; i++)
          this.arr_active_eardata[i] = arr_res[i];
         //在这里decode ble data (100个字节),数据范围和网页端保持一致
        
         
      var audiolevel = arr_res[37];   //用tkgain[1]的值表示36..47表示8个tkgain
      console.log('audiolevel:'+ audiolevel);
      var noise = 0 ; //arr_res[2];    // not use 
      var mode = arr_res[0];  //mem_idx :0..3 

      var eq0 = arr_res[80];  //eq:0..29 ,对应 0db..-29db
      var eq1 = arr_res[81]; 
      var eq2 = arr_res[82];
      var eq3 = arr_res[83]; 
      var eq4 = arr_res[84];
      var eq5 = arr_res[85]; 
      var eq6 = arr_res[86];
      var eq7 = arr_res[87]; 
       
      this.setData({model_active:(mode+1)});
  
      //这是音量 ,tkgain:设置为0..40之间
      var tmp1 = Math.floor(audiolevel*2.5);
      var res_num1 = {num:audiolevel,text:tmp1+'%'};     
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

      tmp1 = this.convert_eq_percent(eq2);
      res_num1 = { num: eq1, text: tmp1 + '%' };
      this.setData({ num_eq2: res_num1 }); 

      tmp1 = this.convert_eq_value(eq2);
      this.setData({ val_eq2: tmp1 });

      tmp1 = this.convert_eq_percent(eq3);
      res_num1 = { num: eq1, text: tmp1 + '%' };
      this.setData({ num_eq3: res_num1 }); 

      tmp1 = this.convert_eq_value(eq3);
      this.setData({ val_eq3: tmp1 });

      tmp1 = this.convert_eq_percent(eq4);
      res_num1 = { num: eq4, text: tmp1 + '%' };
      this.setData({ num_eq4: res_num1 }); 

      tmp1 = this.convert_eq_value(eq4);
      this.setData({ val_eq4: tmp1 });



      tmp1 = this.convert_eq_percent(eq5);
      res_num1 = { num: eq5, text: tmp1 + '%' };
      this.setData({ num_eq5: res_num1 }); 

      tmp1 = this.convert_eq_value(eq5);
      this.setData({ val_eq5: tmp1 });
 

    }

  },

  convert_eq_percent(val) {
    let offset=0;
    //0到29 映射到 百分比
    return   ''+ parseInt(val*100/30,10); 
    
  },
  convert_eq_value(val) {
    let offset = 0;
    //0-29 对应  0..-29db
    let tmp_val =   val;
    return  tmp_val;


  },
  convert_percent_eq(val) {
    let offset = 0;
    let res_eq = parseInt(val*0.3,10);
    if (res_eq >29)  res_eq =29;
    if (res_eq <0)  res_eq = 0;
    return res_eq;
      
  },


  convert_percent_textval(val) {
    let offset = 0;
    let res_eq = parseInt(val*0.3,10);
    if (res_eq >29)  res_eq =29;
    if (res_eq <0)  res_eq = 0;
    return res_eq;
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