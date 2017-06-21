//index.js
//获取应用实例
const qiniuUploader = require("../../qiniusdk/qiniuUploader-min");
var app = getApp()
Page({
  data: {
      imagesrc:'',
      imagewidth:'',
      imageheight:'',
      addimage:'',
      quanzi:'',
      name:''
  },
  //事件处理函数
  checkval:function(event){
      var val=event.detail.value;
      var ex=/^\S{2,10}$/i;
      if(ex.exec(val) && this.data.imagesrc){
          this.setData({
              name:val,
              quanzi:'quanzi_yes'
          })
      }else{
          this.setData({
              name:val,
              quanzi:''
          })
      }
  },
  //上传图片
  chooseImage:function(type){
      var that=this;
      wx.chooseImage({
          count:1,
          sourceType:type,//album 从相册选图，camera 使用相机，默认二者都有
          success:function(res){
              console.log(res)
              var filePath=res.tempFilePaths[0];
              console.log(10)
                wx.request({
                url: 'http://test.mrpyq.com/api/qiniu',
                data: {},
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res){
                    console.log(res)
                    qiniuUploader.upload(filePath, (res) => {
                        that.setData({
                            'imagesrc': res.imageURL,
                
                        });
                        var ex=/^\S{2,10}$/i;
                        if(ex.exec(that.data.name)){
                            that.setData({
                                quanzi:'quanzi_yes'
                            })
                        }
                        console.log(res)
                    }, (error) => {
                        console.log('error: ' + error);
                    }, {
                        region: 'ECN',
                        domain: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/',
                        uptoken: res.data.token,
                    })
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
                })
          }
      })
  },
  checkimage:function(){
    var that=this; 
    wx.showActionSheet({
        itemList:['从相册中选择', '拍照'],
        itemColor:"#1DCE6C",
        success:function(res){
            if(!res.cancel){
                if(res.tapIndex == 0){
                    that.chooseImage('album')
                }else if(res.tapIndex == 1){
                    that.chooseImage('camera')
                }
            }
        }
    })
  },
  onLoad: function () {
  }
})
