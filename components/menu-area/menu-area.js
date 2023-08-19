// components/menu-area/menu-area.js
const app=getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:"热门歌单"
        },
        itemData:{
            type:Object,
            value:{}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        screenWidth: 375
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onMenuMoreClick(){
            //console.log("onMoreClick")
            wx.navigateTo({
              url: '/pages/detail-menu/detail-menu',
            })
        },
    },

    lifetimes:{
        attached(){
        //获取屏幕的宽度
        this.setData({
            screenWidth:app.globalData.screenWidth
        })
        }
    }
})
