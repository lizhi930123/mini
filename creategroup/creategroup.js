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
      name:'',
      showimg:false,
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
              wx.showLoading({
                title: '上传中',
              })
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
                        wx.showToast({
                          title: '上传成功',
                          icon: 'success',
                          duration: 1000
                        })
                        that.setData({
                            'imagesrc': res.imageURL,
                            showimg:true
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
                        wx.showToast({
                          title: '上传失败',
                          icon: 'success',
                          duration: 1000
                        })
                    }, {
                        region: 'ECN',
                        domain: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/',
                        uptoken: res.data.token,
                    })
                },
                fail: function() {
                    // fail
                  wx.showToast({
                    title: '上传失败',
                    icon: 'success',
                    duration: 1000
                  })
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
