// pages/games/games.js
const app = getApp();
var postData = require("../../data/data.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postList: postData.postList,
    index: 0,
    defen: 0,
    num: 1,
      countDownNum: 10,//倒计时初始值
      m_countDownNum: 0,//倒计时初始值
    success:true,
    fail:true,
    drew:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //下一题
  nextQuestion: function () {
    var that = this;
    if (that.data.index < postData.postList.length - 1) {
      this.setData({
        index: that.data.index + 1,
      });
    }
  },
  // 选择
  btnOpClick: function (e) {
    var that = this;
    var select = e.currentTarget.id;//选择按钮的id
    var jieg = postData.postList[that.data.index].daan;//正确答案的id
    if (select == jieg) {
      if (that.data.index < postData.postList.length - 1) {
        if (select == 'A') {
          this.setData({});//答对之后的动作
        }
        else if (select == 'B') {
          this.setData({});//答对之后的动作
        }
        that.nextQuestion();//调用下一题方法
        that.bindPlus();//调用题目加一方法

        that.setData({
          defen: that.data.index + 1
        })
      }
      else {
        if (select == 'A') {
          that.setData({});//答对之后的动作
        }
        else if (select == 'B') {
          that.setData({});//答对之后的动作
        }
        //全部答完之后
      }
    }
    else {
      if (select == 'A') {
        that.setData({});//答错之后的动作
        
      }
      else if (select == 'B') {
        that.setData({});//答错之后的动作
        
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