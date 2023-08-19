// pages/detail-video/detail-video.js
import {getMVUrl,getMVInfo,getMVRelated} from "../../../services/video"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:0,
        mvUrl:"",
        mvInfo:{},
        relatedVideo:[],
        danmuList:[{
            text: '第 1s 出现的弹幕',
              color: '#ff0000',
             time: 1
        },{
            text: '第 3s 出现的弹幕',
              color: '#ff0000',
             time: 3
        }
    ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
     onLoad(options) {
        this.data.id=options.id
        this.fetchMVUrl()
        this.fetchMVInfo()
        this.fetchMVRelated()
    },

    async fetchMVUrl(){
        const res=await getMVUrl(this.data.id)
        //console.log(res)
        this.setData({
            mvUrl:res.data.url
        })
    },
    async fetchMVInfo(){
        const res=await getMVInfo(this.data.id)
        //console.log(res.data)
        this.setData({
            mvInfo:res.data
        })
    },
    async fetchMVRelated(){
        const res=await getMVRelated(this.data.id)
        //console.log(res.data)
        this.setData({
            relatedVideo:res.data
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})