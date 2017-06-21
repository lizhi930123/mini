// pages/post_detail/post_detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {


    current_user: {
      name: 'dengchao',
      headimg: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/Fi0cblQY3pt2sAmWjxUdYq-wYBhv-head'
    },
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
    inputHidden: true,

    //该文章的图片
    imgUrls: ["http://img1.gtimg.com/chinanba/pics/hv1/173/81/2216/144116228.jpg",
      "http://pic.baike.soso.com/p/20120912/20120912190856-1094836003.jpg",
      "http://08.imgmini.eastday.com/mobile/20170526/20170526151756_19cd499d922429620fbabfe4dd404ca1_1.jpeg",
      "http://pic.baike.soso.com/p/20140304/20140304160014-595174499.jpg",
      "http://mat1.gtimg.com/chinanba/web/statics/zt_mvp_2c2127.jpg",
      "http://05.imgmini.eastday.com/mobile/20170602/20170602121617_bd456093b3f9f8dff43476f5a2fe30b7_1.jpeg",
      "http://00.imgmini.eastday.com/mobile/20170611/20170611203504_53b251953cf9fab6de1dfd53c62dc0fc_1.jpeg",
      "http://ww1.sinaimg.cn/bmiddle/dad5bf5dgw1exv0462xumg20b406d4qp.jpg",
      "http://imgsports.eastday.com/sports/img/201705261112431649.jpeg",
      "http://pic2.qiyipic.com/common/lego/20170613/a58b9fbb3cb14a08a1d358602ebdac6d.jpg"

    ]
  },
  loadMoreData: function() {
    console.log('load more')

  },
  // 点击发表按钮的时候 发表评论
  reply: function () {
    var that = this;
    if (!that.data.val) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'warning',
        image: '/images/closeBtn.png',
        duration: 1000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
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

    // 回复个人还是文章 判断

    if (reply_user) { //表示回复某人
      console.log("回复用户:", this.data.val);
      console.log(reply_user)
    } else { //表示回复文章主人
      console.log("回复文章:" + this.data.feed._id, this.data.val);
    }

    var items = this.data.items.slice();
    items.unshift(item);
    that.setData({
      items: items,
      val: '',
      word_input: false,
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
  f_delete_post: function () {
    wx.showModal({
      title: '删除提示',
      content: '确定删除该动态?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'red',
      confirmText: '确定删除',
      confirmColor: 'green',
      success: function (res) {
        if (res.confirm) {
          //删除该动态
          console.log("删除该动态")
          wx.showLoading({
            title: '删除动态中',
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          // 处理删除的网络请求
          setTimeout(function () {

            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              image: '',
              duration: 1000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }, 2000)
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
    wx.navigateTo({
      url: '../zan/zan?likeusers=' + jsonString,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  // 点击点赞图标
  f_change_like: function () {
    var liked = !this.data.liked;
    this.setData({
      liked: liked
    });
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
    console.log(event.target.dataset.imgurl)
    var urlArr = this.data.imgUrls;
    var imgurl = event.target.dataset.imgurl;
    wx.previewImage({
      current: imgurl,
      urls: urlArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击球
  /*
  f_change_showState: function () {
    var state = this.data.btnShowState;
    this.data.btnShowState = !state;
    // this.setData({ btnShowState: !state });

    this.setData({
      btnShowState: !state
    })
  },*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://test.mrpyq.com/api/feed/comments_by_feed',
      data: {
        access_token: '58252d066e998f6bfd67f783.1527755207.64686c25246c2232e1a2ba1597f42b89',
        id: '58292fee6e998f2100a42a9e'
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'get',
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        var data = res.data;

        that.data.items = data.items;
        that.data.feed = data.feed;
        that.data.count = data.count;
        that.setData({
          items: data.items,
          feed: data.feed,
          count: data.count,
          liked: data.feed.liked
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接崩溃',
          icon: 'error',
          image: '',
          duration: 1000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      complete: function (res) { },
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