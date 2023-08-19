// pages/main-video/main-video.js
import {getTopMV} from "../../services/video"
Page({
    data:{
        videoList:[],
        offset:0,
        hasMore:true,
    },
    onLoad(){
        this.fetchTopMV()
    },

    async fetchTopMV(){
        const res=await getTopMV(this.data.offset)
        const newVideoList=[...this.data.videoList,...res.data]
        this.setData({videoList:newVideoList})
        this.data.offset=this.data.videoList.length
        this.data.hasMore=res.hasMore

        
    },
    onReachBottom(){
        if(this.data.hasMore){
            this.fetchTopMV()
        }else{
            return
        }
    },
    async onPullDownRefresh(){
        //console.log("onPullDownRefresh")
        this.setData({
            videoList:[]
        })
        this.data.offset=0
        this.data.hasMore=true

        await this.fetchTopMV()

        wx.stopPullDownRefresh()
    },

    onVideoItemTap(event){
        //console.log(event.currentTarget.dataset.item)
        // const item=event.currentTarget.dataset.item
        // wx.navigateTo({
        //   url: `/pages/detail-video/detail-video?id=${item.id}`,
        // })
    },
})