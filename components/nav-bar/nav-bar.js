// components/nav-bar/nav-bar.js
const app=getApp()
Component({
    options:{
        multipleSlots:true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:"默认导航"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusHeight:20,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLeftTap(){
            wx.navigateBack()
        }
    },
    lifetimes:{
        ready(){
            const statusHeight=app.globalData.statusBarHeight
        this.setData({
            statusHeight
        })
        }
    }
})
