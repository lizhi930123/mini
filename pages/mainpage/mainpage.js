//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    access_token:'58298c1e6e998f25af9c4cc6.1527068098.e02987621e0b8c20c692962346372ab3',
    items:[]
  },
  //事件处理函数

  onLoad: function () {
      var that=this;
    wx.request({
        url: app.data.url+'api/feed/feeds_by_room', //仅为示例，并非真实的接口地址
        data: {
           'access_token': this.data.access_token,
            'page': 1,
            't': new Date().getTime(),
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            console.log(res.data)
            that.setData({
                items:res.data.items
            })
        }
    })
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
