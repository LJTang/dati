// pages/prize_more/prize_more.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    d_desc:{},
      url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      app.post('prize/index_detail',{id:options.id},'POST').then((res)=>{
          if(res.code==200){
              that.setData({
                  d_desc:res.data,
                  url:res.https
              })
          }else{
              wx.showToast({
                  title: '获取信息失败',
                  icon: 'none',
                  duration: 2000
              })
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