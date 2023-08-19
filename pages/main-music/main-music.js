// pages/main-music/main-music.js
import {getMusicBanner,getPlaylistDetail,getSongMenuList} from "../../services/music"
import { querySelect} from "../../utils/query-select"
import {throttle} from "underscore"
import recommendStore from "../../store/recommendStore"
import rankingStore,{rankingsMap} from "../../store/rankingStore"
import playerStore from "../../store/playerStore"

const app=getApp()
const querySelectThrottle=throttle(querySelect,100,{trailing:false})

Page({

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
        isEmpty:true,

        //当前正在播放的歌曲
        currentSong:{},
        isPlaying:false,

    },

    onLoad(options) {
        this.fetchMusicBannner()
        this.fetchSongMenuList()
        
        //监听数据字段--热门歌单：点击更多后使用
        recommendStore.onState("recommendSongInfo",this.handleRecommendSongs)
        for(const key in rankingsMap){
            rankingStore.onState(key,this.getRankingHandler(key))
        }
        
        //发起action--获取热门歌单
        recommendStore.dispatch("fetchRecommendSongsAction")
        //发起action--获取巅峰榜数据
        rankingStore.dispatch("fetchRankingDataAction")

        playerStore.onStates(["currentSong","isPlaying"],this.handlePlayInfos)

        //获取屏幕尺寸
        this.setData({
            screenWidth:app.globalData.screenWidth
        })
        
    },

    //获取热门歌单、推荐歌单数据
    async fetchSongMenuList(){
        const res=await getSongMenuList()
        const res1=await getSongMenuList("华语")
        
        this.setData({
            hotMenuList:res.playlists,
            recMenuList:res1.playlists
        })

    },

    //获取轮播图数据
    async fetchMusicBannner(){
        const res=await getMusicBanner()
        this.setData({
            banners:res.banners
        })
    },

    //轮播图载入完毕时触发
    onBannerImageLoad(event){
        //根据屏幕显示区域的高度获取轮播图组件的高度
        querySelectThrottle(".banner-image").then(res=>{
            this.setData({
                bannerHeight:res[0].height
            })
        })
        
    },

    //推荐歌曲只显示热门歌单的前6首
    handleRecommendSongs(value){
        if(value.tracks){
            this.setData({
                recommendSongs:value.tracks.slice(0,6)
            })
        }
        
    },

    //歌曲播放小窗口数据
    handlePlayInfos({currentSong,isPlaying}){
       if(currentSong){
            this.setData({
                currentSong
            })
       }
       if(isPlaying!==undefined){
            this.setData({
                isPlaying
            })
        }
    },

    //巅峰榜数据传递给store，方便点击进入具体页面获取
    getRankingHandler(ranking){
        return value=>{
            const newRankingInfos={...this.data.rankingInfos,[ranking]:value}
            this.setData({
                rankingInfos:newRankingInfos,
                isEmpty:false
            })
        }
    },

    

    //推荐歌曲 单首歌曲的点击，为了传递数据：播放列表
    onSongItemTap(event){
        playerStore.setState("playSongList",this.data.recommendSongs)
        playerStore.setState("playSongIndex",event.currentTarget.dataset.index)
    },

    //点击推荐歌曲的更多，跳转进去新页面
    onRecommendMoreClick(){
        wx.navigateTo({
          url: '/pages/detail-song/detail-song?type=recommend',
        })
    },

    //点击播放小窗口的点击/暂停图标
    onPlayOrPauseBtnTap(){
        playerStore.dispatch("changeMusicStatusAction")

    },

    //点击小串口唱片图片进入歌曲页
    onPlayBarAlbumTap(){
        wx.navigateTo({
          url: '/pages/music-player/music-player',
        })
    },

    //跳转进搜索页面
    onSearchClick(){
        wx.navigateTo({
          url: '/pages/detail-search/detail-search',
        })
    },
    
    onUnload() {
        recommendStore.offState("recommendSongInfo",this.handleRecommendSongs)
        rankingStore.offState("newRanking",this.handleNewRanking)
        rankingStore.offState("originRanking",this.handleOriginRanking)
        rankingStore.offState("upRanking",this.handleUpRanking)
        playerStore.offStates(["currentSong"],this.handlePlayInfos)
    }
})