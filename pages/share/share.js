
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  saveimg:function(){
    wx.showLoading({
      title: '正在保存',
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width:250,
      height:320,
      destWidth:250,
      destHeight:320,
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(){
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败，请重试',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail:function(res){
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  //事件处理函数
  onLoad: function () {
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, 0, 250,320)
    ctx.setLineWidth(1)
    ctx.setStrokeStyle('#b2b2b2')
    ctx.strokeRect(45, 220, 40, 50)
    ctx.strokeRect(105, 220, 40, 50)
    ctx.strokeRect(165, 220, 40, 50)
    ctx.drawImage('./../../image/creategroup/addimg.png', 45, 0,160,160)
    ctx.setFillStyle('#333333')
    ctx.setFontSize(20)
    ctx.setTextAlign('center')
    ctx.fillText('扫码进入圈子',124, 196)
    ctx.setFontSize(18)
    ctx.setTextAlign('center')
    ctx.fillText('进圈口令', 125, 300)
    ctx.setFontSize(30)
    ctx.setTextAlign('center')
    ctx.fillText(1, 65,255)
    ctx.fillText(2, 125, 255)
    ctx.fillText(3,185, 255)
    ctx.draw();
  }
})
