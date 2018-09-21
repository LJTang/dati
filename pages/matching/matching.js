const app = getApp();
var times = '';
var m_times = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // aipURL:app.data.apiURL
      userInfo:'',
      money:'',
      text:'kaishi_pipei',
      postList:[],
      daAnList:[],
      play:[],
      index:0,
      defen: 0,
      user_index: null,
      she_index:null,
      num: 1,
      countDownNum: 10,//倒计时初始值
      m_countDownNum:10,//倒计时初始值
      pipei_Bool:false,
      success:true,
      fail:true,
      drew:true,
      game_Bool:true,
      status:'',
      game_over:'',
      click_Bool:false,
      jiang:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function (options) {
    // this.countDown();
      var that=this;
      app.post('user/userInfo',{uid:wx.getStorageSync('strWXOpenID').uid},'POST').then((res)=>{
          if(parseInt(res.code)==200){
              that.setData({
                  userInfo:res.data,
                  money:parseFloat(res.data.money),
              });
          }
      }).catch((errMsg) =>{});

      setTimeout(function () {
          wx.connectSocket({
              url: app.data.apiURL,
              header: {
                  'Content-Type': 'application/json'
              },
          });

          var a = '{"uid":'+wx.getStorageSync('strWXOpenID').uid+',"message":"'+that.data.text+'","types":"game_msg"}';

          wx.onSocketOpen(function (res) {
              console.log('WebSocket连接已打开！');
              wx.sendSocketMessage({
                  data:a
              });
          });
      },2000);

      wx.onSocketMessage(function (res) {
          console.log('收到收到服务器内容：'  + res.data);
          var json=JSON.parse(res.data);
          if(json.status==201){
              // wx.reLaunch({
              //     url: '/pages/games/games'
              // });
              wx.showToast({
                  title:'匹配成功，准备答题',
                  icon: 'none',
                  duration: 2000
              });
              setTimeout(function () {
                  wx.sendSocketMessage({
                      data:'{"uid":'+wx.getStorageSync('strWXOpenID').uid+',"message":"kaishi_chuti","types":"game_msg"}'
                  });
              },2100)

          }else if(json.status==202){
              // console.log(json);
              that.setData({
                  pipei_Bool:true,
                  game_Bool:false,
                  postList:json.data.subject,
                  daAnList:json.data.answer,
                  play:json.data.play
              });

              that.countDown();
          }else if(json.status==102){
              // wx.showToast({
              //     title:'对手已回答',
              //     icon: 'none',
              //     duration: 2000
              // });
              if(that.data.status==2){
                  clearInterval(times);
                  clearInterval(m_times);

                  setTimeout(function () {

                      that.setData({
                          countDownNum:10,
                          m_countDownNum:10,
                          status:''
                      });
                      that.nextQuestion();
                      that.bindPlus();
                      that.countDown();
                      that.setData({
                          defen: that.data.index + 1
                      })
                  },2100);
              }else{
                  that.setData({
                      status:1
                  });
              }

          }else if(json.status==103){
                  wx.closeSocket();
                  that.setData({
                      pipei_Bool:true,
                      game_Bool:true,
                      success:false,
                      fail:true,
                      drew:true,
                    });
              clearInterval(times);
              clearInterval(m_times);

              if(that.data.play[0][0].uid==wx.getStorageSync('strWXOpenID').uid){
                  if(json.data.play1.fen>json.data.play2.fen){
                      that.setData({
                          jiang:json.data.play1.jiang,
                          success:false,
                          fail:true,
                      });
                  }else{
                      that.setData({
                          jiang:json.data.play1.jiang,
                          success:true,
                          fail:false,
                      });
                  }
              }if(that.data.play[1][0].uid==wx.getStorageSync('strWXOpenID').uid){
                  if(json.data.play2.fen>json.data.play1.fen){
                      that.setData({
                          jiang:json.data.play2.jiang,
                          success:false,
                          fail:true,
                      });
                  }else{
                      that.setData({
                          success:true,
                          fail:false,
                      });
                  }
              }else{
                  if(json.data.play2.fen>json.data.play1.fen){
                      that.setData({
                          success:true,
                          fail:false,
                      });
                  }else{
                      that.setData({
                          success:false,
                          fail:true,
                      });
                  }
              }

          } else if(json.status==104){
              if(that.data.status==2) {
                  clearInterval(times);
                  clearInterval(m_times);
                  setTimeout(function () {
                      console.log(104);
                      that.setData({
                          countDownNum:10,
                          m_countDownNum:10,
                          status:''
                      });
                      that.nextQuestion();
                      that.bindPlus();
                      that.countDown();
                      that.setData({
                          defen: that.data.index + 1
                      })
                  }, 2100);
              }else{
                  that.setData({
                      status:1
                  });
              }
          }else if(json.status==203){
              console.log(that.data.m_countDownNum);
                  that.setData({
                      game_over:json.data,
                      game_Bool:true,
                      drew:true
                  });
              if(that.data.play[0][0].uid==wx.getStorageSync('strWXOpenID').uid){
                  if(json.data.play1.fen>json.data.play2.fen){
                      that.setData({
                          jiang:json.data.play1.jiang,
                          success:false,
                          fail:true,
                      });
                  }else{
                      that.setData({
                          jiang:json.data.play1.jiang,
                          success:true,
                          fail:false,
                      });
                  }
              }if(that.data.play[1][0].uid==wx.getStorageSync('strWXOpenID').uid){
                  if(json.data.play2.fen>json.data.play1.fen){
                      that.setData({
                          jiang:json.data.play2.jiang,
                          success:false,
                          fail:true,
                      });
                  }else{
                      that.setData({
                          success:true,
                          fail:false,
                      });
                  }
              }else{
                  if(json.data.play2.fen>json.data.play1.fen){
                      that.setData({
                          success:true,
                          fail:false,
                      });
                  }else{
                      that.setData({
                          success:false,
                          fail:true,
                      });
                  }
              }

          }else{

          }
      });
      wx.onSocketError(function (res) {
          console.log('WebSocket连接打开失败，请检查！')
      })
  },
    //倒计时
    countDown: function () {
        let that = this;
        let countDownNum = that.data.countDownNum;//获取倒计时初始值
        let m_countDownNum = that.data.m_countDownNum;//获取倒计时初始值
        //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
        times = setInterval(function () {
            countDownNum--;
            that.setData({
                countDownNum: countDownNum
            });
            if (countDownNum ==1) {
                clearInterval(times);
                clearInterval(m_times);
                if(that.data.num==that.data.postList.length){
                    wx.sendSocketMessage({
                        data: '{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"game_over","types":"game_msg"}'
                    });
                }else{
                    setTimeout(function () {
                        that.setData({
                            countDownNum: 10,
                            m_countDownNum: 10
                        });
                        that.nextQuestion();//调用下一题方法
                        that.bindPlus();//调用题目加一方法
                        that.countDown();
                    },2100);
                }

            }
        }, 1000);
        m_times = setInterval(function () {
            m_countDownNum--;
            that.setData({
                m_countDownNum: m_countDownNum
            });
            if (m_countDownNum ==0) {
                clearInterval(times);
                clearInterval(m_times);

                setTimeout(function () {
                    that.setData({
                        countDownNum: 10,
                        m_countDownNum: 10
                    });
                    that.nextQuestion();//调用下一题方法
                    that.bindPlus();//调用题目加一方法
                    that.countDown();
                },2100);
            }

        },1000)
    },
    //下一题
    nextQuestion: function () {
        var that = this;
        // if (that.data.index < that.data.postList.length - 1) {
            this.setData({
                index: that.data.index + 1,
                click_Bool:false,
                status:''
            });
        // }
    },
    // 选择
    btnOpClick: function (e) {
        var that = this;
        var select = e.currentTarget.id;//选择按钮的id
        var jieg = that.data.daAnList[that.data.index].answer;//正确答案的id
        clearInterval(times);
        that.setData({
            click_Bool:true
        });

        if(that.data.num==that.data.postList.length){
            if (select == 1) {
                clearInterval(m_times);
                wx.sendSocketMessage({
                    data: '{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"huida_cuowu","dui_answer":"1","types":"game_msg"}'
                });
                wx.sendSocketMessage({
                    data: '{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"game_over","types":"game_msg"}'
                });
            }else{
                clearInterval(m_times);
                wx.sendSocketMessage({
                    data: '{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"huida_zhengque","dui_answer":"2","types":"game_msg"}'
                });
                wx.sendSocketMessage({
                    data: '{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"game_over","types":"game_msg"}'
                });
            }

        }else if (that.data.num>that.data.postList.length){

        }else{
            if (select == 1){
                wx.sendSocketMessage({
                    data: '{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"huida_cuowu","dui_answer":"1","types":"game_msg"}'
                });

                if (that.data.status == 1){
                    clearInterval(m_times);
                    setTimeout(function (){
                        that.setData({
                            countDownNum: 10,
                            m_countDownNum: 10,
                            status:''
                        });
                        that.nextQuestion();//调用下一题方法
                        that.bindPlus();//调用题目加一方法
                        that.countDown();
                        // that.setData({
                        //     defen: that.data.index + 1
                        // })
                    }, 2100);
                } else {
                    that.setData({
                        status: 2
                    })
                }
                /*
                  if (that.data.index <that.data.postList.length - 1) {
                      if (select == 'A') {
                          this.setData({});//答对之后的动作
                      }else if (select == 'B') {
                          this.setData({});//答对之后的动作
                      }else{

                      }
                      that.nextQuestion();//调用下一题方法
                      that.bindPlus();//调用题目加一方法

                      that.setData({
                          defen: that.data.index + 1
                      })
                  }else {
                      if (select == 'A') {
                          that.setData({});//答对之后的动作
                      }else if (select == 'B') {
                          that.setData({});//答对之后的动作
                      }else{

                      }
                      that.nextQuestion();//调用下一题方法
                      that.bindPlus();//调用题目加一方法
                      that.setData({
                          defen: that.data.index + 1
                      })
                      //全部答完之后
                  }
                  */
            } else {
                wx.sendSocketMessage({
                    data:'{"uid":' + wx.getStorageSync('strWXOpenID').uid + ',"message":"huida_zhengque","dui_answer":"2","types":"game_msg"}'
                });
                if(that.data.status==1){
                    clearInterval(m_times);
                    setTimeout(function () {
                        that.setData({
                            countDownNum: 10,
                            m_countDownNum: 10,
                            status:''
                        });
                        that.nextQuestion();//调用下一题方法
                        that.bindPlus();//调用题目加一方法
                        that.countDown();
                    }, 2100);
                } else {
                    that.setData({
                        status: 2
                    })
                }
            }
        }

    },
    // 题目加一
    bindPlus: function () {
        var num = this.data.num;
        num++;
        this.setData({
            num: num,
        });
    },

    onUnload:function () {
        clearInterval(times);
        clearInterval(m_times);
        this.setData({ countDownNum: 10, m_countDownNum:0});
        wx.closeSocket();
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    challenge:function(){
      var that=this;
        clearInterval(times);
        clearInterval(m_times);
        wx.closeSocket();
        this.setData({
            pipei_Bool:false,
            game_Bool:true,
            success:true,
            fail:true,
            drew:true,
            text:'kaishi_pipei',
            index:0,
            num:1,
            countDownNum: 10,
            m_countDownNum:10,
            click_Bool:false,
            postList:[],
            daAnList:[],
            play:[],
            defen: 0,
            user_index: null,
            she_index:null,
            status:'',
            game_over:'',
        });
      this.onShow();
    },
  /**
   * 用户点击右上角分享
   */
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
                }).catch((errMsg)=>{});
                // wx.showToast({
                //     title:'12222',
                //     icon: 'none',
                //     duration: 2000,
                //     mask: true
                // })
            }
        }).catch((errMsg) =>{});
    }
});