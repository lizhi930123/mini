//logs.js
var app = getApp();
Page({
  data: {
      items:[],
      ball_func:false,
      self:false,
      word_input:false,
      val:'',
      index:0,
      date:'',
      reply_name:'发表评论',
      reply_user:{},
      current_user:{
        name:'折原临也',
        _id:'551d812efbe78e6ec27b1049',
        no:230,
        me:true,
        headimg:'http://7x2wk4.com2.z0.glb.qiniucdn.com/Fq6Uxh4S3SkNlEcAEsTLPs08QlcW-head'
     },
     getmore_switch:true,
     pagenumber:2,
     pagemore:true,
    //  token:'58252d066e998f6bfd67f783.1527755207.64686c25246c2232e1a2ba1597f42b89',
    token:'58252d066e998f6bfd67f783.1528192546.4fd5cb6689941ed91bcd3d575121eb5d',
     comments_pagemore:false,
     comments:[],
  },
  //切换发贴
  check_publish:function(){
    console.log(1)
    app.data.items=this.data.items;
    wx.navigateTo({
      url:'../../pages/publish/publish'
    })
  },
  //切换我的主页
  check_mainpage: function () {
    console.log(2)
    wx.navigateTo({
      url: '../../pages/mainpage/mainpage'
    })
  },
  //获取全部评论
  get_all_comments:function(event){
    var i=1,id=event.target.dataset.id,index=event.target.dataset.index;
    this.get_comments(i,id,index);
  },
  get_comments:function(i,id,index){
    var that=this;
    wx.request({
      url: app.data.url+'feed/comments_by_feed',
      data: {
            'access_token':this.data.token,
						'id':id,
						'page': i,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        if(res.data.items){
          that.data.comments=that.data.comments.concat(res.data.items)
          console.log(that.data.comments,index)
          if(res.data.pagemore){
              that.get_comments(++i,id,index)
          }else{
              that.data.items[index].comments=that.data.comments;
              that.setData({
                items:that.data.items,
                comments_pagemore:false
              })
          }
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  //显示图片
  showimg:function(event){
    console.log(event)
    var index=event.target.dataset.index,
    sindex=event.target.dataset.sindex;
    var photo=[];
    for(var i=0;i<this.data.items[index].photos.length;i++){
      photo.push(this.data.items[index].photos[i].large)
    }
    console.log(photo)
    wx.previewImage({
      current: photo[sindex], // 当前显示图片的http链接
      urls: photo // 需要预览的图片http链接列表
    })
  },
  //显示功能球
  show_ball_func:function(){
    this.setData({
      ball_func:true
    })
  },
  //角色说
  check_play:function(){
    this.setData({
      self:false
    })
  },
   //本人说
  check_self:function(){
    console.log(1)
    this.setData({
      self:true
    })
  },
  //回复
  reply:function(){
    var that=this;
    if(this.data.val){
      wx.request({
        url: app.data.url+'feed/comment',
        data: {
          access_token:that.data.token,
          userid:that.data.current_user._id,
          id: that.data.items[that.data.index]._id,
          b:that.data.self?1:0,
          content:that.data.val,
          replyuserid:that.data.reply_user._id?that.data.reply_user._id:'',
           replyuserno:that.data.reply_user._no?that.data.reply_user._no:''
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000
            })
          var comment={
            content:that.data.val,
            b:that.data.self?1:0,
            time:{
              create:'刚刚'
            },
            replyuser:that.data.reply_user.name?that.data.reply_user:'',
            user:that.data.current_user
          }
          that.data.items[that.data.index].comments.push(comment)
          that.setData({
            items:that.data.items
          })
          that.setData({
            val:'',
            word_input:false
          })
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }else{
      this.setData({
        reply_name:'请输入评论内容！'
      })
    }
  },
  //下一页
  get_more_items:function(){
    if(this.data.pagemore && this.data.getmore_switch){
      this.data.getmore_switch=false;
      var that=this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
          url: 'http://test.mrpyq.com//api/feed/feeds_by_room',
          data: {
              access_token:that.data.token,
              page:that.data.pagenumber,
              t:that.data.date
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            wx.hideLoading()
            console.log(res)
            var items=res.data.items,newTime=new Date().getTime();
            that.data.pagemore=res.data.pagemore;
            that.data.pagenumber++;
            items=app.checktime(items,app,newTime);
            that.data.items=that.data.items.concat(items);
            console.log(that.data.items)
            // items[9].comments[0].b=1;
            that.setData({
                items:that.data.items
            })
            that.data.getmore_switch=true;
          //   setTimeout()
          },
          fail: function() {
            // fail
             wx.showToast({
              title: '加载失败',
              icon: 'success',
              duration: 2000
            })
          },
          complete: function(){
            // complete
          }
        })
    }
  },
  //回复某人
  reply_someone:function(event){
    var sindex=event.currentTarget.dataset.sindex,
    index=event.currentTarget.dataset.index;
    this.data.index=index;
    this.data.reply_user=this.data.items[index].comments[sindex].user;
    this.setData({
      word_input:true,
      reply_name:'回复'+this.data.items[index].comments[sindex].user.name
    })
    console.log(this.data.reply_user)
  },
  //显示输入框
  get_word:function(event){
    this.setData({
      word_input:true
    })
    this.setData({
      reply_name:'发表评论'
    })
    this.data.index=event.target.dataset.index;
    console.log(this.data.index)
  },
  //监听输入框内容
  check_val:function(event){
    this.data.val=event.detail.value;
  },
  //关闭输入框
close_word:function(){
    this.setData({
      word_input:false
    })
},
  // 关闭功能球
  hide_ball_func:function(){
    this.setData({
      ball_func:false
    })
  },
  //点赞
  f_like:function(event){
      var index=event.target.dataset.index;
      var that=this;
      wx.request({
        url: app.data.url+'feed/like',
        data: {
          access_token:that.data.token,
          userid:that.data.current_user._id,
          id:that.data.items[index]._id,
          no:that.data.current_user.no
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log()
          if(res.data.result==1){
            that.data.items[index].likeusers.unshift(that.data.current_user);
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 2000
            })
          }else{
              for(var i=0;i<that.data.items[index].likeusers.length;i++){
                if(that.data.current_user._id==that.data.items[index].likeusers[i]._id){
                  that.data.items[index].likeusers.splice(i,1);
                  break;
                }
              }
              wx.showToast({
                title: '取消点赞',
                icon: 'success',
                duration: 2000
              })
          }
          that.data.items[index].liked=!that.data.items[index].liked;
          that.setData({
              items:that.data.items
          })
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  //初始化
  onLoad: function(){
    console.log(1)
      var that=this;
      that.data.date=new Date().getTime();
      console.log(Page)
      wx.request({
        url: app.data.url+'feed/feeds_by_room',
        data: {
            access_token:this.data.token,
            page:1,
            t:that.data.date
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          var items=res.data.items,newTime=new Date().getTime();
          that.data.pagemore=res.data.pagemore;
          console.log(items)
          if(app.data.item){
            for(var i=0;i<items.length;i++){
              if(items[i]._id==app.data.item._id){
                  app.data.item=false;
                  break;
              }else if(i==items.length-1){
                  items.unshift(app.data.item);
                  app.data.item=false;
                  break;
              }
            }
          }
          items=app.checktime(items,app,newTime);
          // items[9].comments[0].b=1;
          that.setData({
              items:items
          })
          console.log(that.data.items)
        //   setTimeout()
        },
        fail: function() {
          // fail
        },
        complete: function(){
          // complete
        }
      })
  }, 
})
