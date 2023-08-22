// pages/main-profile/main-profile.js
import {menuCollection} from "../../database/index"

import menuStore from "../../store/menuStore"


Page({

    /**
     * 页面的初始数据
     */
    data: {
        isUserLoad:false,
        avatarUrl:"/assets/images/profile/avatar_placeholder.png",
        nickname:"未登录",

        tabs:[
            {name:"我的收藏",type:"favor"},
            {name:"我的喜欢",type:"like"},
            {name:"历史记录",type:"history"},
        ],

        isShowDialog:false,
        menuName:"",
        menuList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        menuStore.onState('songList',this.handleMenuList)
    },

    onShow(){
        const isUserLoad=wx.getStorageSync("isUserLoad")
        if(isUserLoad){
            const {avatarUrl,nickname}=wx.getStorageSync("userInfo")
            this.setData({
                isUserLoad,
                avatarUrl,
                nickname
            })
        }
        menuStore.dispatch("fetchMenuListAction")
    },

    async onUserInfoTap(){
        //获取用户的头像和昵称
        wx.navigateTo({
          url: '/pages/detail-person/detail-person',
        })

    },

    tabItemTap(event){
        const item=event.currentTarget.dataset.item

        wx.navigateTo({
          url:`/pages/detail-song/detail-song?type=profile&tabname=${item.type}`,
        })
    },

    onCreateSongTap(){
        this.setData({
            isShowDialog:true
        })
    },

    onIputChange(){
        //解决model双向绑定控制台不断提示
    },

    async onConfirm(){
        const menuName=this.data.menuName

        const menuRecord={
            name:menuName,
            songList:[]
        }

        const res=await menuCollection.add(menuRecord)
        if(res){
            
            wx.showToast({
              title: `添加歌单${menuName}成功`,
            })
            this.setData({
                menuName:""
            })
            menuStore.dispatch("fetchMenuListAction")
        }
    },

    onClose(){
        this.setData({
            menuName:""
        })
    },

    handleMenuList(value){
        this.setData({
            menuList:value
        })
    }
})