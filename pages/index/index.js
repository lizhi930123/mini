//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    array:['推荐名人','常用名人','热搜榜','娱乐体育','游戏动漫','商界大佬','历史人物','小说影视','其他'],
    items:[],
    active:['left_white','left_item','left_item','left_item','left_item','left_item','left_item','left_item','left_item','left_item','left_item'],
    input_active:'',
    cancelactive:'',
    sureactive:'',
     access_token:'58298c1e6e998f25af9c4cc6.1527068098.e02987621e0b8c20c692962346372ab3',
     actinfo:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  check_home:function(){
    wx.navigateTo({
        url: '../../pages/mainpage/mainpage'
    })
    console.log(2)
  },
  f_focus:function(){
    wx.navigateTo({
        url: '../../pages/search/search'
    })
  },
  go_act:function(event){
    var name=event.target.dataset.name,
    headimg=event.target.dataset.headimg,
    description=event.target.dataset.description;
    app.globalData.actname=name;
    app.globalData.actdescription=description;
    app.globalData.actheadimg=headimg;
    var user={
      name:app.globalData.actname,
      description:app.globalData.actdescription,
      headimg:app.globalData.actheadimg
    }
    console.log(user)
    this.setData({
      actinfo:user
    })
  },
  startcancel:function(){
    console.log(1)
    this.setData({
      cancelactive:'cancelactive'
    })
  },
  overcancel:function(){
     this.setData({
      cancelactive:''
    })
  },
  startsure:function(){
    console.log(1)
    this.setData({
      sureactive:'sureactive'
    })
  },
  oversure:function(){
     this.setData({
      sureactive:''
    })
  },
  cancelact:function(){
    this.setData({
      actinfo:{}
    })
  },
  check_white:function(event){
    var index=event.target.dataset.index;
    for(var i=0;i<this.data.active.length;i++){
       this.data.active[i]='left_item';
    }
    this.data.active[index]='left_white';
    this.setData({
      active:this.data.active
    })
    console.log(this.data.active)
  },
  onLoad: function () {
    if(app.globalData.actname){
      var user={
          name:app.globalData.actname,
          description:app.globalData.actdescription,
          headimg:app.globalData.actheadimg
        }
        console.log(user)
        this.setData({
          actinfo:user
        })
    }
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      console.log(that.data.userInfo)
    })
    var that=this;
    wx.request({
        url: app.data.url+'account/members_by_me', //仅为示例，并非真实的接口地址
        data: {
           'access_token': this.data.access_token,
            'page': 1,
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
  }
})
