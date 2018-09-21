//app.js
App({
    data:{
        apiURL:'ws://ceshi.weixingda.cn:9504'
    },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
      var code='',that=this;
    // 登录
    wx.login({
      success: res => {
          code=res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
                  that.post('verification/login',{code:code,rawData:res.rawData,signature:res.signature,iv:res.iv,encryptedData:res.encryptedData},'POST').then((res)=>{
                      if (res.code==200){
                          wx.setStorage({
                              key: 'strWXOpenID',
                              data:{wxOpenID:res.data.openid,uid:res.data.uid}
                          });
                      }
                  }).catch((errMsg) => {
                  });
              }
             
                that.post('verification/login',{code:code,rawData:res.rawData,signature:res.signature,iv:res.iv,encryptedData:res.encryptedData},'POST').then((res)=>{
                    if (res.code==200){
                        wx.setStorage({
                            key: 'strWXOpenID',
                            data:{wxOpenID:res.data.openid,uid:res.data.uid}
                        });
                    }
                }).catch((errMsg) => {
                });
            }
          })
        }
      }
    })
  },
    post: function (url, data,way) {
        // wx.showLoading({
        //     title: '加载中...',
        //     mask: true
        // })
        var promise = new Promise((resolve, reject) => {
            //init
            var that = this;
            var postData = data;
            //判断用户数据是否存在
            var token = wx.getStorageSync('token')
            var header = {
                'content-type': 'application/json'
            }
            if (token) {
                header.Accept = 'application/json';
                header.Authorization = 'Bearer ' + token
            }
            //网络请求
            wx.request({
                url: this.globalData.api_url+url,
                data: postData,
                method:way,
                header: header,
                success: function (res) {//服务器返回数据
                    resolve(res.data);
                    // wx.hideLoading();
                },
                error: function (e) {
                    // wx.hideLoading();
                    reject('网络出错');
                }
            })
        });
        return promise;
    },
  globalData: {
    userInfo: null,
      // api_url: 'https://dati.kaifa123.net/api/'
      api_url: 'https://ceshi.weixingda.cn/api/'
  }
});