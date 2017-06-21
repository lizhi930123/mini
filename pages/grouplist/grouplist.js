// pages/quanzi_list/quanzi_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 专区列表
    items:[],
    //专区数量
    count:0,
    //当前用户
    cur_user:{},
    //当前所在专区
    cur_roomid:'',
    //是否有更多的专区
    pagemore:false,

    quanziList: [{
      "qid": 1,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": true,
      "msgNum": 20
    },
    {
      "qid": 2,
      "imgurl": '',
      "quanzi_name": '游戏帝国',
      "isMy": false,
      "msgNum": 1
    },
    {
      "qid": 3,
      "imgurl": '',
      "quanzi_name": '自由之翼',
      "isMy": true,
      "msgNum": 99
    },
    {
      "qid": 4,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": true,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": false,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": false,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": false,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": false,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": false,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '欢乐颂妖精天地',
      "isMy": false,
      "msgNum": 200
    },
    {
      "qid": 5,
      "imgurl": '',
      "quanzi_name": '楚乔传',
      "isMy": false,
      "msgNum": 200
    }]
  },
  f_delete_quanzi(event) {
    var qid = event.currentTarget.dataset.qid;
    wx.showModal({
      title: '删除圈子提示',
      content: '确定删除该圈子?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'green',
      confirmText: '确定删除',
      confirmColor: 'red',
      success: function (res) {
        if (res.confirm) {
          console.log("确定删除该圈子: " + qid)
          wx.showLoading({
            title: '删除操作中',
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
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
          console.log("你取消了该删除圈子操作")
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  f_join_quanzi(event) {
    // 点击某一圈子 进入圈子
    //console.log(event.currentTarget.dataset.qid);
    var qid = event.currentTarget.dataset.qid;
    wx.navigateTo({
      url: '../quanzi_xiaoxi/quanzi_xiaoxi?qid=' + qid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取所有的专区
    var that = this;
    wx.request({
      url: 'http://test.mrpyq.com/api/room/rooms_by_me',
      data: {
        access_token: '58252d066e998f6bfd67f783.1527755207.64686c25246c2232e1a2ba1597f42b89'
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'get',
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        var data = res.data;
        that.setData({
          count:data.count,
          cur_roomid:data.cur_roomid,
          items: data.items,
          cur_user: data.cur_user,
          pagemore: data.pagemore,
        })

        //网络连接  获取数据之后的操作
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

    return {
      title: '自定义转发标题',
      path: '/pages/index?id=123',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  }
})