//app.js
App({
  data:{
    items:[],
    item:false,
    url:'http://test.mrpyq.com/api/',


    // 点击查看详情details, 点赞记录和评论内容 同步到home页
    detail_index:-1,
    comments: [],
    likeduser:null
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              appid:'wx95b4e0796d10cbca',
              secret:'3295c99c50543d33e9b5ee29e296ad3d',
              js_code: res.code,
              grant_type:'authorization_code'
            },
            success:function(res){
              console.log(res)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  cheTime: function (historyTime, nowTime) {
			var _day, _hour, _min, _month, _week, _year, day, diffValue, halfamonth, hour, minute, month, now, result, year;
			now = nowTime ? nowTime : new Date().getTime();
			diffValue = now - historyTime;
			result = '';
			minute = 1000 * 60;
			hour = minute * 60;
			day = hour * 24;
			halfamonth = day * 15;
			month = day * 30;
			year = month * 12;
			_year = diffValue / year;
			_month = diffValue / month;
			_week = diffValue / (7 * day);
			_day = diffValue / day;
			_hour = diffValue / hour;
			_min = diffValue / minute;
			if (_year >= 1) {
				result = parseInt(_year) + "年前";
			} else if (_month >= 1) {
				result = parseInt(_month) + "个月前";
			} else if (_week >= 1) {
				result = parseInt(_week) + "周前";
			} else if (_day >= 1) {
				result = parseInt(_day) + "天前";
			} else if (_hour >= 1) {
				result = parseInt(_hour) + "个小时前";
			} else if (_min >= 1) {
				result = parseInt(_min) + "分钟前";
			} else {
				result = "刚刚";
			}
			return result;
	},
  // 将items数组中的 time.create修改成相对于newTime的相对日期 几天前或者几小时前
  checktime:function(items,app,newTime){
        for(var i=0;i<items.length;i++){
            items[i].time.create=app.cheTime(items[i].time.create,newTime);
            for(var j=0;j<items[i].comments.length;j++){
              items[i].comments[j].time.create=app.cheTime(items[i].comments[j].time.create,newTime);
            }
        }
        return items;
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              console.log(res)
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    actname:'',
    actdescription:'',
    actheadimg:''
  }
})