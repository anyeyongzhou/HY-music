// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"
import playerStore from "../../store/playerStore"
import {getPlaylistDetail} from "../../services/music"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        songInfo:{},
        type:"ranking",
        key:"newRanking",
        id:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 1.确定获取数据的类型
        // type:ranking->榜单数据
        // type:recommend->推荐数据
        const type=options.type
        this.setData({
            type
        })

        //获取榜单数据
        if(type==="ranking"){
            this.data.key=options.key
            rankingStore.onState(this.data.key,this.handleRanking)
        }else if(type==="recommend"){
            recommendStore.onState("recommendSongInfo",this.handleRanking)
        }else if(type==="menu"){
            this.data.id=options.id
            this.fetchMenuSongInfo()
           
        }
    },

    async fetchMenuSongInfo(){
        const res=await getPlaylistDetail(this.data.id)
        //console.log(res)
        this.setData({
            songInfo:res.playlist
        })
    },

    handleRanking(value){
        if(this.data.type==="recommend"){
            value.name="推荐歌曲"
        }
        this.setData({
            songInfo:value
        })
        wx.setNavigationBarTitle({
          title: value.name,
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        if(this.data.type==="ranking"){
            rankingStore.offState(this.data.key,this.handleRanking)
        }else if(this.data.type==="recommend"){
            recommendStore.offState("recommendSongInfo",this.handleRanking)
        }else if(this.data.type==="menu"){

        }
    },

    handleRecomendSongs(value){
        this.setData({
            songs:value
        })
    },

    onSongItemTap(){
        playerStore.setState("playSongList",this.data.songInfo.tracks)
    },
    
   

})