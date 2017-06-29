// pages/post_detail/post_detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 当前帖子 在home主页中帖子数组中的索引index
    index:-1,

    current_user: {
      name: '折原临也',
      _id: '551d812efbe78e6ec27b1049',
      no: 230,
      me: true,
      headimg: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/Fq6Uxh4S3SkNlEcAEsTLPs08QlcW-head'
    },
    token: '58252d066e998f6bfd67f783.1528192546.4fd5cb6689941ed91bcd3d575121eb5d',
    // 该篇文章的评论
    items: [],

    //文章详细信息
    feed: {},

    //评论的数量  因为要收缩起来
    count: 0,

    // input样式
    self: false,
    word_input: false,
    //评论的内容绑定
    val: '',
    // 评论框placeholder内容
    reply_name: '发表评论',

    // 评论回复某人
    reply_user: {},

    // 是否已经点赞
    liked: false,

    // 是否显示评论输入框
    inputHidden: true
  },
  loadMoreData: function () {
    console.log('load more')

  },
  // 点击发表按钮的时候 发表评论
  reply: function () {
    var that = this;
    if (!that.data.val) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'success',
        image: '',
        duration: 2000,
        mask: true
      })
      return;
    }

    var reply_user = this.data.reply_user;

    // 构造评论项
    var item = {
      b: that.data.self ? 1 : 0,
      content: that.data.val,
      user: that.data.current_user,
      reply_user: reply_user ? reply_user : "",//对象存在即为恢复某人
      time: {
        create: '刚刚'
      }
    };

    var data = {
      access_token: that.data.token,
      userid: that.data.current_user._id,
      id: that.data.feed._id,
      content: that.data.val,
      b: that.data.self ? 1 : 0,
      replyuserid: "",
    };
    // 回复个人还是文章
    if (reply_user) { //表示回复某人
      //console.log("回复用户:");
      //console.log(reply_user)
      data.replyuserid = reply_user._id;
    } else { //表示回复文章主人
      //console.log("回复文章:" + this.data.feed._id, this.data.val);
      data.replyuserid = "";
    }
    console.log(data)
    wx.request({
      url: app.data.url + 'feed/comment',
      data: data,
      method: 'get',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          image: '',
          duration: 2000,
          mask: true,
        });

        // 数据存入数组
        var items = that.data.items.slice();
        items.unshift(item);
        // 重置部分数据
        that.setData({
          items: items,
          val: '',
          word_input: false,
        })

        // 同步评论记录到home主页中
        app.data.detail_index = that.data.index;
        app.data.comments.push(res.data.comment)
        //console.log(app.data.comments)

      },
      fail: function (res) {
        wx.showToast({
          title: '评论失败, 请稍后再试',
          icon: 'success',
          image: '',
          duration: 2000,
          mask: true,
        });
      },
      complete: function (res) { },
    })



  },
  // 发表评论时的数据绑定
  check_val: function (event) {
    var commentContent = event.detail.value;
    //console.log(commentContent)
    this.setData({
      val: commentContent
    })
  },
  //角色说
  check_play: function () {
    this.setData({
      self: false
    })
  },
  //本人说
  check_self: function () {
    this.setData({
      self: true
    })
  },

  // 隐藏评论框input
  f_hide_commnetInput: function () {
    this.data.inputHidden = false;
    this.setData({
      word_input: false
    })
  },
  // 删帖操作 (只能删除自己的帖子)
  f_delete_post: function (event) {
    var feed_id = event.currentTarget.dataset.feedid;
    var that = this;
    wx.showModal({
      title: '删除提示',
      content: '确定删除该动态?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'green',
      confirmText: '确定删除',
      confirmColor: 'red',
      success: function (res) {
        if (res.confirm) {
          //删除该动态
          console.log("删除该动态")
          wx.showLoading({
            title: '删除动态中',
            mask: true
          })
          wx.request({
            url: app.data.url + 'feed/delete',
            data: {
              access_token: that.data.token,
              id: feed_id
            },
            method: 'get',
            success: function (res) {
              //wx.hideLoading();
              //console.log(res.data)

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000,
              })
              wx.reLaunch({
                url: '../../pages/home/home',
              })

            },
            fail: function () {
              wx.showToast({
                title: '删除失败',
                icon: 'success',
                duration: 2000
              })
            }
          })

        } else if (res.cancel) {
          //取消操作
          console.log("你取消删除该动态")
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击 多少人赞过 跳转到
  f_nav_zan_list: function () {
    var likeusers = this.data.feed.likeusers;
    var jsonString = JSON.stringify(likeusers);
    
    // 判断是否是自己 传个下一个页面 判断能否删除点赞记录
    var me = this.data.feed.user.me;

    wx.navigateTo({
      url: '../../pages/likelist/likelist?likeusers=' + jsonString+"&me="+me
    })
  },

  // 点击点赞图标
  f_change_like: function (event) {
    var that = this;
    var feed_id = event.currentTarget.dataset.feedid;
    wx.request({
      url: app.data.url + 'feed/like',
      data: {
        access_token: that.data.token,
        userid: that.data.current_user._id,
        id: feed_id,
        no: that.data.current_user.no
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var liked = false;
        if (res.data.result == 1) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })
          liked = true;
          that.data.feed.likeusers.unshift(that.data.current_user)
        } else {
          wx.showToast({
            title: '取消点赞',
            icon: 'success',
            duration: 2000
          })
          liked = false
          //删除当前用户的点赞数据
          var length = that.data.feed.likeusers.length
          for (var i = 0; i < length; i++) {
            if (that.data.current_user._id == that.data.feed.likeusers[i]._id) {
              that.data.feed.likeusers.splice(i, 1);
              break;
            }
          }
          
        }

        // 将当前用户添加到点赞的用户列表中  点赞图像使用

        that.setData({
          liked: liked,
          feed:that.data.feed
        });
        
        // 同步点赞记录到home主页中
        app.data.detail_index = that.data.index;
        app.data.likeduser = {
          // 点赞用户
          // current_user:that.data.current_user,

          liked,

          changed:true
        }
        

      }
    })

  },
  // 点击评论图标
  f_comment_icon__click: function (event) {
    //console.log(event.target.dataset.replyuser)
    var reply_user = event.target.dataset.replyuser;
    this.data.word_input = true;
    var reply_name = reply_user ? "回复: " + reply_user.name : '发表评论';
    this.setData({ word_input: true, reply_user: reply_user, reply_name: reply_name });
  },

  // 点击图片预览图片
  f_preview_img: function (event) {
    console.log(event.target.dataset.index)
    //var urlArr = this.data.imgUrls;
    console.log(this.data.feed);

    // 表示要预览的图片的索引id
    var index = event.target.dataset.index;

    // 当前要预览的图片
    var imgurl = this.data.feed.photos[index].large;

    // 表示全部图片的集合 做全部预览使用
    var photosArr = [];

    var phtLength = this.data.feed.photos.length;

    for (var i = 0; i < phtLength; i++) {
      photosArr.push(this.data.feed.photos[i].large);
    }

    //console.log(photosArr)

    wx.previewImage({
      current: imgurl,
      urls: photosArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var feed_id = options.feed_id;

    // 该贴相对于items数组的索引
    var index = options.index;

    if (!feed_id) {
      wx.showToast({
        title: '数据加载失败',
        icon: 'success',
        image: '',
        duration: 1000,
        mask: true,
      })
      return;
    }
    //console.log("DetailPage", feed_id)
    wx.request({
      url: app.data.url + '/feed/comments_by_feed',
      data: {
        access_token: that.data.token,
        id: feed_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'get',
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        var data = res.data;

        var items = data.items;

        var newTime = new Date().getTime();
        
        items = app.checktime(items, app, newTime);

        that.data.items = items;

        that.data.items.reverse();


        var feed = data.feed;
        feed.time.create = app.cheTime(feed.time.create, newTime)

        that.data.feed = feed;
        that.data.count = data.count;

        that.setData({
          index,
          items: that.data.items,
          feed: data.feed,
          count: data.count,
          liked: data.feed.liked
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接崩溃',
          icon: 'success',
          image: '',
          duration: 1000,
          mask: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
/*
"123"
"{"a":"123"}"  // IOS Android 服务器返回
"{\"a\":\"123\"}"  // 服务器直接返回
 */