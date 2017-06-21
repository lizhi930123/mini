// pages/post/post.js
const qiniuUploader = require("../../qiniusdk/qiniuUploader-min");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post_detail: '',
    imgUrls: [],
    photos:[],
    token:'58252d066e998f6bfd67f783.1528192546.4fd5cb6689941ed91bcd3d575121eb5d',
    current_user:{
        name:'折原临也',
        _id:'551d812efbe78e6ec27b1049',
        no:230,
        me:true,
        headimg:'http://7x2wk4.com2.z0.glb.qiniucdn.com/Fq6Uxh4S3SkNlEcAEsTLPs08QlcW-head'
     }
  },
  f_delelte_img: function (event) {
    // console.log(event.target.dataset.imgurl)
    // 取出需要删除的值
    var imgurl = event.target.dataset.imgurl;
    var imgUrls = this.data.imgUrls;
    var index = imgUrls.indexOf(imgurl);
    if (index > -1) {
      imgUrls.splice(index, 1);
      this.setData({ imgUrls: imgUrls });
    }
  },
  f_submit_post: function () {
    // 点击发布按钮的时候 触发事件
    console.log(this.data.post_detail)
    console.log(this.data.imgUrls)

    var current_user = {
      name: 'dengchao',
      headimg: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/Fi0cblQY3pt2sAmWjxUdYq-wYBhv-head'
    }
    var content = this.data.post_detail;
    var imgUrls = this.data.imgUrls,that=this;
    if (!content && !this.data.imgUrls.length) {
      wx.showToast({
        title: '发布内容不能为空',
        icon: 'warning',
        image: '/images/closeBtn.png',
        duration: 1000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      return;
    }else{
      wx.showLoading({
          title: '发布中',
      })
      if(imgUrls.length){
        wx.request({
          url: app.data.url+'qiniu',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            var token=res.data.token;
            console.log(imgUrls.length)
            that.f_upload(imgUrls,0,imgUrls.length,token,that)
          }
        })
      }else{
        wx.showLoading({
            title: '发布中',
        })
        wx.request({
            url: app.data.url+'feed/create',
            data: {
              access_token:that.data.token,
              userid:that.data.current_user._id,
              content:that.data.post_detail,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              // success
              if(res.data.feed){
                wx.showToast({
                  title: '发布成功',
                  icon: 'success',
                  duration: 1000
                })
                app.data.item=res.data.feed;
                app.data.item=res.data.feed;
                app.data.item.comments=[];
                app.data.item.likeusers=[];
                console.log(app.data.item)
                setTimeout(function(){
                  wx.reLaunch({
                    url: '../../pages/home/home'
                  })
                },1000)
              }
            },
            fail: function() {
              // fail
              wx.showToast({
                title: '发布失败，请重试',
                icon: 'success',
                duration: 1000
              })
            },
            complete: function() {
              // complete
            }
          })
      }
    }
  },
  //上传图片，上传成功后发帖
  f_upload:function(filePath,j,k,token,that){
    qiniuUploader.upload(filePath[j], (res) => {
        that.data.photos.push({
          type:0,
          large:res.imageURL+'-large',
          thumbnail:res.imageURL+'-thumbnail',
          width:1920,
          height:1080
        })
        j++;
        console.log(filePath,j,k,token,that)
        if(j<k){
            that.f_upload(filePath,j,k,token,that)
        }else{
          console.log(that.data.photos)
          var data=new Object();
          data['access_token']=that.data.token;
          data['userid']=that.data.current_user._id;
          data['content']=that.data.post_detail;
          for(var i=0;i<that.data.photos.length;i++){
            data['photos-'+i+'.large']=that.data.photos[i].large;
            data['photos-'+i+'.thumbnail']=that.data.photos[i].thumbnail;
            data['photos-'+i+'.width']=that.data.photos[i].width;
            data['photos-'+i+'.height']=that.data.photos[i].height;
            data['photos-'+i+'.type']=that.data.photos[i].type
          }
          console.log(data)
          wx.request({
            url: app.data.url+'feed/create',
            data: data,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              // success
               if(res.data.feed){
                wx.showToast({
                  title: '发布成功',
                  icon: 'success',
                  duration: 1000
                })
                app.data.item=res.data.feed;
                app.data.item.comments=[];
                app.data.item.likeusers=[];
                console.log(app.data.item)
                setTimeout(function(){
                  wx.reLaunch({
                    url: '../../pages/home/home'
                  })
                },1000) 
              }
            },
            fail: function() {
              // fail
              wx.showToast({
                title: '发布失败，请重试',
                icon: 'success',
                duration: 1000
              })
            },
            complete: function() {
              // complete
            }
          })
        }
    }, (error) => {
      wx.showToast({
        title: '上传失败，请重试',
        icon: 'success',
        duration: 1000
      })
    }, {
        region: 'ECN',
        domain: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/',
        uptoken: token,
    })
  },
  f_post_input: function (ev) {
    //console.log(ev.detail.value);
    var content = ev.detail.value;
    this.data.post_detai = content;
    this.setData({
      post_detail: content
    })
  },
  f_preview_img: function (ev) {
    var imgUrl = ev.currentTarget.dataset.imgurl;
    var that = this;
    console.log(imgUrl,that.data.imgUrls)
    wx.previewImage({
      current: imgUrl,
      urls: that.data.imgUrls,
      success: function (res) { },
      fail: function (res) { }
    })
  },
  f_add_img: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //console.log(tempFilePaths);
        var imgArr = that.data.imgUrls.concat(tempFilePaths);

        that.data.imgUrls = imgArr;
        console.log(that.data.imgUrls)
        that.setData({
          imgUrls: imgArr
        });

      },
      fail: function (res) {
        wx.showToast({
          title: '你没有选择图片',
          icon: 'success',
          duration: 0,
          mask: true
        })
      },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      title: '微信小程序联盟',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/index?id=123'
    }
  }
})