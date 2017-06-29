//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    items:[],
    username:''
  },
  //事件处理函数
  onLoad: function () {
  },
  findval:function(event){
      console.log(event)
      var val=event.detail.value;
      this.setData({
          username:val
      })
  },
  act_he:function(event){
    console.log(event)
    var name=event.target.dataset.name,
    headimg=event.target.dataset.headimg,
    description=event.target.dataset.description;
    app.globalData.actname=name;
    app.globalData.actdescription=description;
    app.globalData.actheadimg=headimg;
    wx.navigateTo({
        url: '../../pages/index/index'
    })
  },
  search:function(){
      var that=this;
      console.log(that.data.username)
      wx.request({
        url: "http://api.mrpyq.com/user/search",
        data: {
            name:that.data.username
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type': 'application/json'
        },
        success: function(res){
          // success
          console.log(res.data);
          that.setData({
            items:res.data.items
          })
        },
        fail: function() {
          // fail
          console.log(1)
        },
        complete: function() {
          // complete
        }
      })
  }
})
