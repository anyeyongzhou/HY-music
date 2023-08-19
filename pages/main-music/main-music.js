// pages/main-music/main-music.js
import {getMusicBanner,getPlaylistDetail,getSongMenuList} from "../../services/music"
import { querySelect} from "../../utils/query-select"
//import throttle from "../../utils/throttle"
import {throttle} from "underscore"
import recommendStore from "../../store/recommendStore"
import rankingStore,{rankingsMap} from "../../store/rankingStore"
import playerStore from "../../store/playerStore"

const querySelectThrottle=throttle(querySelect,100,{trailing:false})

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue:"",
        banners:[],
        bannerHeight:0,
        screenWidth:375,
        recommendSongs:[],
        hotMusicId:3778678,
        //歌单数据
        hotMenuList:[],
        recMenuList:[],

        //巅峰榜数据
        rankingInfos:{},
        isEmpty:true

    },
    onSearchClick(){
        //console.log("onSearchClick")
        wx.navigateTo({
          url: '/pages/detail-search/detail-search',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.fetchMusicBannner()
        // this.fetchRecommendSongs()
        this.fetchSongMenuList()
        
        //监听数据字段
        recommendStore.onState("recommendSongInfo",this.handleRecommendSongs)
        // rankingStore.onState("newRanking",this.handleNewRanking)
        // rankingStore.onState("originRanking",this.handleOriginRanking)
        // rankingStore.onState("upRanking",this.handleUpRanking)
        
        // rankingStore.onState("newRanking",this.getRankingHandler("newRanking"))
        // rankingStore.onState("originRanking",this.getRankingHandler("originRanking"))
        // rankingStore.onState("upRanking",this.getRankingHandler("upRanking"))
        for(const key in rankingsMap){
            rankingStore.onState(key,this.getRankingHandler(key))
        }
        
        //发起action
        recommendStore.dispatch("fetchRecommendSongsAction")

        rankingStore.dispatch("fetchRankingDataAction")
        
    },

    async fetchSongMenuList(){
        const res=await getSongMenuList()
        const res1=await getSongMenuList("华语")
        
        this.setData({
            hotMenuList:res.playlists,
            recMenuList:res1.playlists
        })

    },

    async fetchMusicBannner(){
        const res=await getMusicBanner()
        //console.log(res)
        this.setData({
            banners:res.banners
        })
    },

    async fetchRecommendSongs(){
        // const res=await getPlaylistDetail(this.data.hotMusicId)
        // //console.log(res)
        // const playlist=res.playlist
        // const recommendSongs=playlist.tracks.slice(0,6)
        // this.setData({
        //     recommendSongs
        // })
    },

    onBannerImageLoad(event){
        //获取image组件的高度
        // const query=wx.createSelectorQuery()
        // query.select(".banner-image").boundingClientRect()
        // query.exec(res=>{
        //     this.setData({
        //         bannerHeight:res[0].height
        //     })
        // })
        querySelectThrottle(".banner-image").then(res=>{
            //console.log(res)
            this.setData({
                bannerHeight:res[0].height
            })
        })
        
    },

    handleRecommendSongs(value){
        if(value.tracks){
            this.setData({
                recommendSongs:value.tracks.slice(0,6)
            })
        }
        
    },

    // handleNewRanking(value){
    //     const newRankingInfos={...this.data.rankingInfos,newRanking:value}
    //     this.setData({
    //         rankingInfos:newRankingInfos
    //     })
    // },
    // handleOriginRanking(value){
    //     const newRankingInfos={...this.data.rankingInfos,originRanking:value}
    //     this.setData({
    //         rankingInfos:newRankingInfos
    //     })
    // },
    // handleUpRanking(value){
    //     const newRankingInfos={...this.data.rankingInfos,upRanking:value}
    //     this.setData({
    //         rankingInfos:newRankingInfos
    //     })
    // },

    getRankingHandler(ranking){
        return value=>{
            const newRankingInfos={...this.data.rankingInfos,[ranking]:value}
            this.setData({
                rankingInfos:newRankingInfos,
                isEmpty:false
            })
        }
    },

    onRecommendMoreClick(){
        wx.navigateTo({
          url: '/pages/detail-song/detail-song?type=recommend',
        })
    },

    //推荐歌曲 单首歌曲的点击，为了传递播放列表
    onSongItemTap(event){
        playerStore.setState("playSongList",this.data.recommendSongs)
        playerStore.setState("playSongIndex",event.currentTarget.dataset.index)
    },
    

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        recommendStore.offState("recommendSongInfo",this.handleRecommendSongs)
        rankingStore.offState("newRanking",this.handleNewRanking)
        rankingStore.offState("originRanking",this.handleOriginRanking)
        rankingStore.offState("upRanking",this.handleUpRanking)
        
    },

  
})