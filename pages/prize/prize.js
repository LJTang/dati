// pages/prize/prize.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prize:[],
      len_Bool:true,
      url:''
  },
  record: function () {
    wx.reLaunch({
      url: '/pages/prize_record/prize_record'
    })
  },
  receive: function () {
    wx.reLaunch({
      url: '/pages/prize/prize'
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
     var that=this;
      app.post('prize/index',{},'POST').then((res)=>{
        if(res.code==200){
            that.setData({
                len_Bool:true,
                prize:res.data,
                url:res.https
            });
        }else{
            this.setData({
                len_Bool:false
            });
        }

      }).catch((errMsg) => {

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