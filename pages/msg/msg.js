// pages/quanzi_xiaoxi/quanzi_xiaoxi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  f_see_detail: function () {
    wx.navigateTo({
      url: '/pages/post_detail/post_detail',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  f_delete_xiaoxi:function() {
    wx.showModal({
      title: '删除提示',
      content: '确定删除该消息?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'green',
      confirmText: '确定删除',
      confirmColor: 'red',
      success: function (res) {
        if (res.confirm) {
          //删除该动态
          console.log("删除该消息")
          wx.showLoading({
            title: '删除消息中',
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
          console.log("你取消删除该消息")
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