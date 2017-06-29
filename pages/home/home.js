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
        _id:'55040c10fbe78e5c14de4a93',
        no:230,
        me:true,
        headimg:'http://7x2wk4.com2.z0.glb.qiniucdn.com/Fq6Uxh4S3SkNlEcAEsTLPs08QlcW-head'
     },
     getmore_switch:true,
     pagenumber:2,
     pagemore:true,
    //  token:'58252d066e998f6bfd67f783.1527755207.64686c25246c2232e1a2ba1597f42b89',
    // token:'58252d066e998f6bfd67f783.1528192546.4fd5cb6689941ed91bcd3d575121eb5d',
     token:'openId_test_has_user.2222.d079c628104414892fe32a0d78ea1dab',
     comments_pagemore:false,
     comments:[],
  },
  // 查看帖子详情
  view_detail:function(event) {
    var feed_id = event.target.dataset.feedid;
    var index = event.target.dataset.index;
    //console.log(feed_id)
    wx.navigateTo({
      url: '../../pages/details/details?feed_id='+feed_id+"&index="+index
    })
  },
  //切换发贴
  check_publish:function(){
    //console.log(1)
    app.data.items=this.data.items;
    wx.navigateTo({
      url:'../../pages/publish/publish'
    })
  },
  //切换我的主页
  check_mainpage: function () {
    // console.log(2)
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
        url: app.data.url +'comment/create',
        data: {
          access_token:that.data.token,
          userid:that.data.current_user._id,
          feedid: that.data.items[that.data.index]._id,
          b:that.data.self?1:0,
          content:that.data.val,
          replyuserid:that.data.reply_user._id?that.data.reply_user._id:'',
           replyuserno:that.data.reply_user._no?that.data.reply_user._no:''
        },
        method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },  // 设置请求的 header
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
        url: app.data.url +'like/toggle',
        data: {
          access_token:that.data.token,
          userid:that.data.current_user._id,
          feedid:that.data.items[index]._id,
          no:that.data.current_user.no
        },
        method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          // success
          if(res.data.result==1){
            that.data.items[index].likeusers.unshift(that.data.current_user);
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 2000
            })
            that.data.items[index].liked =true;
          }else if(res.data.result==-1){
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
              that.data.items[index].liked = false;
          }
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
      var that=this;
      that.data.date=new Date().getTime();
      //console.log(Page)
      wx.request({
        url: app.data.url + 'circle/list',
        data: {
          access_token: this.data.token,
          page: 1,
        },
        method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },  // 设置请求的 header
        success: function (res) {
          console.log(res)
        }
      })
      wx.request({
        url: app.data.url+'feed/list',
        data: {
            access_token:this.data.token,
            circleid: app.data.circleid,
            page:1,
            // t:that.data.date
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          // success
          var items=res.data.items,newTime=new Date().getTime();
          that.data.pagemore=res.data.pagemore;
          for(var i=0;i<items.length;i++){
            // items[i].likeusers = [];
            // items[i].comments=[];
          }
          console.log("HomePage Onload : items")

          // 如果所有帖子中不存在我发的贴  那么将该贴加入数组中
          // 如果该贴已经添加成功 那么放弃该操作
          if(app.data.item){
            for(var i=0;i<items.length;i++){
              if(items[i]._id==app.data.item._id){
                  app.data.item=false;
                  console.log(items[i]._id,app.data.item._id,i)
                  break;
              }else if(i==items.length-1){
                  items.unshift(app.data.item);
                  app.data.item=false;
                  console.log(11111111111)
                  break;
              }
            }
          }
          // 修改时间的操作
          console.log(items)
          items=app.checktime(items,app,newTime);
          console.log(items)
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

  onShow:function() {
    // 从详情列表返回的时候 加载新添加的评论 和 点赞记录
    console.log("--------onShow")

    console.log("-----同步点赞记录 null表示没有--------")
    console.log(app.data.likeduser);

    // 当前帖子的索引
    var index = app.data.detail_index;

    // 第一次的时候 不用修改数据
    // 没有做任何修改的时候 也不用加载数据
    if (app.data.likeduser) {
      console.log("修改数据")

      
      // 点赞变成true 还是false
      var liked = app.data.likeduser.liked;
      // 当前用户
      var current_user = this.data.current_user;

      // 利用索引index 从 当前所有帖子中 找到 点赞贴 

      // 如果用户点赞从false变成true, 添加点赞数据
      if (liked) {
        this.data.items[index].likeusers.unshift(current_user);
        this.data.items[index].liked = true;
      } else { //用户取消赞

        // 删除current_user点赞用户数据
        var length = this.data.items[index].likeusers.length
        for (var i = 0; i < length; i++) {
          if (current_user._id == this.data.items[index].likeusers[i]._id) {
            this.data.items[index].likeusers.splice(i, 1);
            break;
          }
        }
        this.data.items[index].liked = false;
      }

      app.data.likeduser = null;
      app.data.detail_index = -1;

      console.log(this.data.items)
      this.setData({
        items: this.data.items
      })
      
    } //end if


    // 同步评论记录 数组为空表示没有
    // 从详情页同步评论记录
    var comments = app.data.comments;
    if (comments.length) {
      //console.log(comments);
      
      // 这样添加的评论数据 会放在尾部
      this.data.items[index].comments = this.data.items[index].comments.concat(comments);

      // 添加评论数据 修改数据项
      
      /* 新评论放在首部
      var commentsArr = this.data.items[index].comments;
      for (var i = 0; i < comments.length; i ++) {
        commentsArr.unshift(comments[i]);
      }
      this.data.items[index].comments = commentsArr;
      */
      this.setData({
        items: this.data.items
      })
  

      // 置空数据
      app.data.detail_index = -1;
      app.data.comments = [];

    }
  }
})
