//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    array: [{
         name: '推荐名人',
         id:-4
       },{
         name:'常用名人',
         id:-2
       },{
         name: '热搜榜',
         id:-1
       },{
         name:'全部',
         id:0
       },{
         name: '娱乐体育',
         id:1
       },{
         name: '游戏动漫',
         id:2
       },{
        name: '商界大佬',
        id:3
       },{
        name: '历史人物',
        id:4
       },{
        name: '小说影视',
        id:5
       },{
        name: '其他',
        id:6
       }],
    items:[],
    active:['left_white','left_item','left_item','left_item','left_item','left_item','left_item','left_item','left_item','left_item','left_item'],
    input_active:'',
    cancelactive:'',
    sureactive:'',
     access_token:'58298c1e6e998f25af9c4cc6.1527068098.e02987621e0b8c20c692962346372ab3',
     actinfo:{},
     pagenumber:1,
     pagemore:true,
     groupid:-4,
     token: 'openId_test_has_user.2222.d079c628104414892fe32a0d78ea1dab',
  },
  check_home:function(){
    wx.navigateTo({
        url: '../../pages/mainpage/mainpage'
    })
    console.log(2)
  },
  //转到搜索页;
  f_focus:function(){
    wx.navigateTo({
        url: '../../pages/search/search'
    })
  },
  go_act:function(event){
    var name=event.target.dataset.name,
    headimg=event.target.dataset.headimg,
    description=event.target.dataset.description,
    id = event.target.dataset.id;
    app.globalData.actname=name;
    app.globalData.actdescription=description;
    app.globalData.actheadimg=headimg;
    app.globalData.id = id;
    var user={
      name:app.globalData.actname,
      description:app.globalData.actdescription,
      headimg:app.globalData.actheadimg,
      id:app.globalData.id
    }
    console.log(user)
    this.setData({
      actinfo:user
    })
  },
  //名人列表
  act_list:function(){
    var that=this;
    if(this.data.pagemore){
      wx.request({
        url: app.data.url + 'user/user_list',
        data: {
          access_token: that.data.token,
          groupid: that.data.groupid,
          page: that.data.pagenumber,
        },
        method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },  // 设置请求的 header
        success: function (res) {
          console.log(res)
          if (res.data.items) {
            var items = res.data.items
            that.data.items = that.data.items.concat(items);
            that.data.pagemore=res.data.pagemore
            that.setData({
              items: that.data.items
            })
            that.data.pagenumber++;
          }
        }
      })
    }
  },
  //获取更多名人
  get_more_act:function(){
      this.act_list()
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
  //确认扮演
  sureact:function(){
    wx.navigateTo({
      url: '../../pages/creategroup/creategroup'
    })
  },
  cancelact:function(){
    this.setData({
      actinfo:{}
    })
  },
  check_white:function(event){
    var index=event.target.dataset.index,id=event.target.dataset.id;
    for(var i=0;i<this.data.active.length;i++){
       this.data.active[i]='left_item';
    }
    this.data.active[index]='left_white';
    this.setData({
      active:this.data.active
    })
    console.log(this.data.active)
    this.setData({
      pagenumber:1,
      items:[],
      groupid:id,
      pagemore:true
    })
    console.log(this.data.pagemore)
    this.act_list();
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
    this.act_list()
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      console.log(that.data.userInfo)
    })
    var that=this;
    
  }
})
