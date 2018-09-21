// pages/ranking_list/ranking_list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    behind:[],
      len_Bool:true,
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
  ranking_list: function () {
    wx.reLaunch({
      url: '/pages/ranking_list/ranking_list'
    })
  },
  ranking_lists: function () {
    wx.reLaunch({
      url: '/pages/ranking_lists/ranking_lists'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      app.post('questionbank/zhong',{type:1},'POST').then((res)=>{
          if(res.code==200){
              that.setData({
                  len_Bool:true,
                  behind:res.data
              })
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