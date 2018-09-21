// pages/game/game.js
var postData = require("../../data/data.js");
const app = getApp();
var times = '';
var m_times = '';
Page({

  /**
   * 页面的初始数据
   */

  data: {
    fail: false,
    success: false,
    countDownNum: 10,//倒计时初始值
    m_countDownNum: 0,//倒计时初始值
    postList: [],
    index: 0,
    defen: 0,
    num: 1,
    click_Bool: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // api/questionbank/index
  onLoad: function (options) {
    var that = this;
    app.post('questionbank/index', {}, 'POST').then((res) => {
      // app.post('api/questionbank/userQuest',{},'POST').then((res)=>{
      if (res.code == 200) {
        that.setData({
          postList: res.data
        });
        that.countDown();
      }

    }).catch((errMsg) => {

    });
  },
  // 倒计时
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
      if (countDownNum == 0) {
        wx.showModal({
          title: '提示',
          content: '答题时间到',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                fail: true,
              })
            }
          }
        });
        //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
        //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
        clearInterval(times);
        //关闭定时器之后，可作其他处理codes go here
      }
    }, 1000);

    m_times = setInterval(function () {
      m_countDownNum++;
      that.setData({
        m_countDownNum: m_countDownNum
      });
      if (m_countDownNum == 1000) {
        clearInterval(m_times);
      }
    }, 10)
  },
  goindex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  //下一题
  nextQuestion: function () {
    var that = this;
    if (that.data.index < this.data.postList.length - 1) {
      this.setData({
        index: that.data.index + 1,
      });
    }
  },
  // 选择
  btnOpClick: function (e) {
    var that = this;
    var dui_Arr = [];
    var select = parseInt(e.currentTarget.dataset.id);//选择按钮的id
    var jieg = this.data.postList[that.data.index].answer;//正确答案的id
    if (this.data.click_Bool == true) {
      this.setData({
        click_Bool: false
      });
      if (select == jieg) {
        if (that.data.index < this.data.postList.length - 1) {
          if (select == 1) {
            console.log(11)

            clearInterval(times);
            clearInterval(m_times);
            app.post('questionbank/userQuest', { uid: wx.getStorageSync('strWXOpenID').uid, ques_id: that.data.postList[that.data.index].id, user_answer: select, ques_num: that.data.m_countDownNum * 10, did: that.data.index+1 }, 'POST').then((res) => {
              if (res.code == 200) {
                this.setData({ countDownNum: 10, m_countDownNum: 0,click_Bool: true});//答对之后的动作
                this.countDown();
              } else {
                that.cuo();
              }
            }).catch((errMsg) => { });

          } else if (select == 2) {

            clearInterval(times);
            clearInterval(m_times);
            app.post('questionbank/userQuest', { uid: wx.getStorageSync('strWXOpenID').uid, ques_id: that.data.postList[that.data.index].id, user_answer: select, ques_num: that.data.m_countDownNum * 10, did: that.data.index+1}, 'POST').then((res) => {
              if (res.code == 200) {
                this.setData({ countDownNum: 10, m_countDownNum: 0,click_Bool: true});//答对之后的动作
                this.countDown();
              } else {
                that.cuo();
              }
            }).catch((errMsg) => { });
          }
          that.nextQuestion();//调用下一题方法
          that.bindPlus();//调用题目加一方法

          that.setData({
            defen: that.data.index + 1
          })
        } else {
          if (select == 1) {
            console.log(111)
            clearInterval(times);
            clearInterval(m_times);
            app.post('questionbank/userQuest', { uid: wx.getStorageSync('strWXOpenID').uid, ques_id: that.data.postList[that.data.index].id, user_answer: select, ques_num: that.data.m_countDownNum * 10, did: that.data.index+1}, 'POST').then((res) => {
              if (res.code == 200) {
                this.setData({ countDownNum: 10, m_countDownNum: 0,click_Bool: true});//答对之后的动作
                this.countDown();
              }
            }).catch((errMsg) => { });

          } else if (select == 2) {
            console.log(222)

            clearInterval(times);
            clearInterval(m_times);
            app.post('questionbank/userQuest', { uid: wx.getStorageSync('strWXOpenID').uid, ques_id: that.data.postList[that.data.index].id, user_answer: select, ques_num: that.data.m_countDownNum * 10, did: that.data.index+1}, 'POST').then((res) => {
              if (res.code == 200) {
                this.setData({ countDownNum: 10, m_countDownNum: 0,click_Bool: true});//答对之后的动作
                this.countDown();
              } else {
                that.cuo();
              }
            }).catch((errMsg) => { });

          }
          that.last();//全部答完之后
        }

      } else {
        this.setData({
          click_Bool: true
        });
        console.log(select);
        if (select == 1) {
          clearInterval(times);
          clearInterval(m_times);
          app.post('questionbank/userQuest', { uid: wx.getStorageSync('strWXOpenID').uid, ques_id: that.data.postList[that.data.index].id, user_answer: select, ques_num: that.data.m_countDownNum * 10, did: that.data.index+1}, 'POST').then((res) => {
            if (res.code == 200) {
              this.setData({ countDownNum: 10, m_countDownNum: 0,click_Bool: true});//答对之后的动作
              this.countDown();
            } else {
              that.cuo();
            }
          }).catch((errMsg) => { });

        } else if (select == 2) {
          clearInterval(times);

          clearInterval(m_times);
          app.post('questionbank/userQuest', { uid: wx.getStorageSync('strWXOpenID').uid, ques_id: that.data.postList[that.data.index].id, user_answer: select, ques_num: that.data.m_countDownNum * 10, did: that.data.index+1}, 'POST').then((res) => {
            if (res.code == 200) {
              this.setData({ countDownNum: 10, m_countDownNum: 0,click_Bool: true});//答对之后的动作
              this.countDown();
            } else {
              that.cuo();
            }
          }).catch((errMsg) => { });

        }

        that.cuo();
      }
    } else {

    }


    /*
    if (select==1) {
      clearInterval(times);
      that.setData({});//答错之后的动作
      that.cuo();
    }else if (select ==2) {
        clearInterval(times);
      that.setData({});//答错之后的动作
      that.cuo();
    }
    */
    // }
  },
  // 题目加一
  bindPlus: function () {
    var num = this.data.num;
    num++;
    this.setData({
      num: num,
    });
  },


  //全部答完弹框
  last: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '恭喜你全部答对',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.setData({
            success: true,
          })
        }
      }
    })
  },
  //答错
  cuo: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '很遗憾，选择错误',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.setData({
            fail: true,
          })
        }
      }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
    onUnload:function () {
        clearInterval(times);
        clearInterval(m_times);
        this.setData({ countDownNum: 10, m_countDownNum:0,click_Bool: true});
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
    }
})