// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    money:0,
      you_volume: 0,
      volume: 0,
      wxh:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      app.post('user/userInfo',{uid:wx.getStorageSync('strWXOpenID').uid},'POST').then((res)=>{
          if(parseInt(res.code)==200){
            that.setData({
                userInfo:res.data,
                money:parseFloat(res.data.money),
                you_volume: res.data.you_volume,
                volume: res.data.volume
            });
            console.log(that.data.userInfo)
          }
      }).catch((errMsg) => {

      });

      app.post('index/setting',{},'POST').then((res)=>{
          if(parseInt(res.code)==200){
              that.setData({
                  wxh:res.data.config.customer_service
              });
              console.log(res)
          }
      }).catch((errMsg) => {

      });
      // index/setting
  },
  index: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  ranking: function () {
    wx.reLaunch({
      url: '/pages/ranking_list/ranking_list'
    })
  },
  prize: function () {
    wx.reLaunch({
      url: '/pages/prize/prize'
    })
  },
  my: function () {
    wx.reLaunch({
      url: '/pages/my/my'
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


  // 转发
  onShareAppMessage: function (res) {
      // if(delay) {
      //     clearTimeout(delay);
      // }
      wx.showShareMenu({
          withShareTicket: true
      });

      // title = this.data.userInfo.nickName + ' ' + this.data.relay;
      var that = this;
      if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(1111)
      }
      return {
          title: '娱乐圈考级大赛',
          path: '/pages/index/index',
          success: function (res) {
              var shareTickets;
              if(res.shareTickets) {
                  shareTickets = res.shareTickets[0] || '';
              }
              var platform;  //机型
              wx.getSystemInfo({
                  success: function (res) {
                      platform = res.platform;
                  }
              });
              // 判断是不是群聊
              if (platform == 'ios') { //苹果
                  if (!res.shareTickets) { //个人
                      wx.showToast({
                          title: '只能是群聊哦',
                          icon: 'none',
                          duration:2000,
                          mask: true
                      })
                  } else {
                      wx.getShareInfo({
                          shareTicket: shareTickets,
                          success: function (res) { //是群聊
                              that.doSendMsg();
                          },
                          fail: function () {

                          }
                      })
                  }
              } else { //安卓
                  wx.getShareInfo({
                      shareTicket: shareTickets,
                      success: function (res) { //是群聊
                          that.doSendMsg();
                      },
                      fail: function () {
                          wx.showToast({
                              title: '只能是群聊哦',
                              icon: 'none',
                              duration: 2000,
                              mask: true
                          })
                      }
                  })
              }

          },
          fail: function (res) {
              // 转发失败
              wx.showToast({
                  title: '转发失败',
                  icon: 'none',
                  duration: 2000,
                  mask: true
              })
          }
      }
  },

    doSendMsg:function () {
        var that=this;
        app.post('user/userDoSub',{uid:wx.getStorageSync('strWXOpenID').uid,money:30,share:1},'POST').then((res)=>{
        // app.post('user/userDoSub',{uid:295,money:30,share:1},'POST').then((res)=>{
          if(res.code==200){
              app.post('user/userInfo',{uid:wx.getStorageSync('strWXOpenID').uid},'POST').then((res)=>{
                  if(parseInt(res.code)==200){
                      that.setData({
                          money:parseFloat(res.data.money),
                          you_volume: res.data.you_volume,
                          volume: res.data.volume
                      });
                      console.log(that.data.userInfo)
                  }
              }).catch((errMsg) => {

              });
              wx.showToast({
                  title:'12222',
                  icon: 'none',
                  duration: 2000,
                  mask: true
              })
          }
        }).catch((errMsg) => {

        });
    }
});