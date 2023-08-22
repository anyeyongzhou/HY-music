// pages/detail-person/detail-person.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    isUserLoad:false,
    avatarUrl: defaultAvatarUrl,
    nickname:""
  },

  onLoad(){
    try {
        var isUserLoad = wx.getStorageSync('isUserLoad')
        if (isUserLoad) {           
            const {avatarUrl,nickname}=wx.getStorageSync("userInfo")
            
            this.setData({
                isUserLoad,
                avatarUrl,
                nickname
            })
        }
      } catch (e) {
        // Do something when catch error
      }

  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },

  
  
  onnickNameChange(event){
      this.setData({
        nickname:event.detail.value
      })
  },

  async onConfirmTap(){
    //获取用户的openid(使用后端能力也能获得)
    const musicLoginRes=await wx.cloud.callFunction({
        name:"music-login"
    })

    wx.setStorageSync("isUserLoad",true)
    wx.setStorageSync('userInfo', {
        "avatarUrl":this.data.avatarUrl,
        "nickname":this.data.nickname,
        "openid":musicLoginRes.result.openid
    })
    wx.navigateBack()
  },


})