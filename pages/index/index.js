//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
      fail: false,
    follow_show:true,
      hasUserInfo:false,
      money:0,
      you_volume:0,
      click_Bool:false
  },
    onLoad:function(){
    var that=this;
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']){
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            // this.globalData.userInfo = res.userInfo;
                            that.setData({
                                userInfo:res.userInfo,
                                hasUserInfo:false
                            });
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res);

                            }

                            app.post('user/userInfo',{uid:wx.getStorageSync('strWXOpenID').uid},'POST').then((res)=>{
                                if(parseInt(res.code)==200){
                                    that.setData({
                                        money:parseFloat(res.data.money),
                                        you_volume: res.data.you_volume,
                                        click_Bool: true
                                    });

                                }
                            }).catch((errMsg) => {

                            });
                            // GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_BusinessTips);
                            /*
                            wx.request({
                                url: 'https://vote.guangzhoubaidu.com/api/verification/login',
                                data: {
                                    code: code,
                                    rawData: res.rawData,
                                    signature: res.signature,
                                    iv: res.iv,
                                    encryptedData: res.encryptedData
                                },
                                responseType: 'text',
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'POST',
                                success: function (res) {
                                    var strData = res.data;
                                    if (strData.code == 200) {
                                        // wx.setStorage({
                                        //     key: 'strWXID',
                                        //     data: {strWXOpenID: strData.data.openid, strUserID: strData.data.uid,userType:(strData.data.type==2&&strData.data.type_status==2)}
                                        // });
                                    } else {
                                        wx.showToast({
                                            title: strData.msg,
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    }
                                },
                                fail: function (res) {
                                    wx.showToast({
                                        title: '网络请求错误，请稍后再重试',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                    // wx.hideLoading();
                                }
                            });
                            */
                        }
                    })
                }else{
                    that.setData({
                        hasUserInfo:true
                    });
                }
            }
        });
    },
    // 普通比赛
    judge:function(){
var that=this;
      if(this.data.you_volume<=0){
          that.setData({
              fail: true,
          });
      }else{
          app.post('user/userDoSub',{uid:wx.getStorageSync('strWXOpenID').uid,you_volume:''},'POST').then((res)=>{
              if(res.code==200){
                  wx.navigateTo({
                      url: '/pages/game/game'
                  })
              }
          }).catch((errMsg) => {
          });
      }
    },
     // 排位比赛
    jump_PK:function(){
        var that=this;
        if(this.data.you_volume==0){
            that.setData({
                fail: true,
            });
        }else{
            app.post('user/userDoSub',{uid:wx.getStorageSync('strWXOpenID').uid,you_volume:''},'POST').then((res)=>{
                if(res.code==200){
                    wx.navigateTo({
                        url: '/pages/matching/matching'
                    })
                }
            }).catch((errMsg) =>{});
        }
    },

  follow_show: function () {
    var that = this;
    var follow_show = !that.data.follow_show;
    that.setData({
      follow_show: follow_show
    })
  },
  index: function() {
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
    getUserInfo: function (e) {
        var that=this;
        this.setData({
            popUp_Bool:false
        });
        if(e.detail.errMsg=='getUserInfo:ok'){
            app.globalData.userInfo = e.detail.userInfo;
            wx.setStorage({
                key: 'getUserInfo',
                data: true
            });
            this.setData({
                imgURL:e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo,
                hasUserInfo: false
            });

            wx.login({
                success: res => {
                    wx.setStorage({
                        key: 'log',
                        data:{code:res.code}
                    });
                    app.post('verification/login',{code:res.code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData},'POST').then((res)=>{
                      if (res.code==200){
                          wx.setStorage({
                              key: 'strWXOpenID',
                              data:{wxOpenID:res.data.openid,uid:res.data.uid}
                          });
                          app.post('user/userInfo',{uid:res.data.uid},'POST').then((res)=>{
                              if(parseInt(res.code)==200){
                                  that.setData({
                                      money:parseFloat(res.data.money),
                                      you_volume: res.data.you_volume,
                                      click_Bool: true
                                  });

                              }
                          }).catch((errMsg) => {

                          });
                      }
                    }).catch((errMsg) => {
                    });
                }
            });

        }else{
            this.setData({
                popUp_Bool:false,
                hasUserInfo: true
            });
        }
    },
    // 转发
    onShareAppMessage: function (res) {
        wx.showShareMenu({
            withShareTicket: true
        });

        // title = this.data.userInfo.nickName + ' ' + this.data.relay;
        var that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
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
    },
    close:function () {
        this.setData({
            fail:false
        });
    }
});
