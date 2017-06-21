// pages/zan/zan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zan_list: [1, 2, 3, 4],
  },
  f_delete_zan: function () {
    wx.showModal({
      title: '删除记录',
      content: '确定删除该点赞记录?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'red',
      confirmText: '确定删除',
      confirmColor: 'green',
      success: function (res) {
        if (res.confirm) {
          //删除该动态
          console.log("删除该点赞记录")
          wx.showLoading({
            title: '删除点赞记录中',
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
          console.log('你取消了该删除操作')
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)

//     var likeusers = JSON.parse(options.likeusers);
// console.log(likeusers)
//     this.data.zan_list = likeusers
//     this.setData({
//       zan_list:likeusers
//     });

    wx.setNavigationBarTitle({
      title: '赞(' + 60 + ')',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
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