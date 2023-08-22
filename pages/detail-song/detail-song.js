// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"
import playerStore from "../../store/playerStore"
import menuStore from "../../store/menuStore"
import {getPlaylistDetail} from "../../services/music"

const db=wx.cloud.database()

// const tabNameList=[
//     {tabname:"favor",name:"我的收藏"},
//     {tabname:"like",name:"我的喜欢"},
//     {tabname:"history",name:"历史记录"}
// ]
const tabNameList={
    "favor":"我的收藏",
    "like":"我的喜欢",
    "history":"历史记录"
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        songInfo:{},
        type:"ranking",
        key:"newRanking",
        id:0,
        menuList:[]
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

        //歌单数据
        menuStore.onState("songList",this.handleMenuList)

        //获取榜单数据
        if(type==="ranking"){
            //从巅峰榜点击 进入
            this.data.key=options.key
            rankingStore.onState(this.data.key,this.handleRanking)
        }else if(type==="recommend"){
            //从推荐歌曲——>更多 进入
            recommendStore.onState("recommendSongInfo",this.handleRanking)
        }else if(type==="menu"){
            //从热门歌单或推荐歌单 进入
            this.data.id=options.id
            this.fetchMenuSongInfo()
        }else if(type==="profile"){
            //从个人中心：收藏、喜欢。历史记录 进入
            const tabname=options.tabname
            this.handleProfileTabInfo(tabname)
        }else if(type==="menutype"){
            //点击个人中心：我的歌单 进入
            const _id=options._id
            this.handleMenuInfo(_id)
        }

        
    },

    handleMenuInfo(_id){
        const item=this.data.menuList.filter(item=>{
            if(item._id==_id){
                return item
            }
            
        })
        this.setData({
            songInfo:{
                name:item[0].name+"歌单",
                tracks:item[0].songList
            }
        })
    },


    handleMenuList(value){
        this.setData({
            menuList:value
        })
    },

    async handleProfileTabInfo(tabname){
        const collection=db.collection(`c_${tabname}`)
        const {openid}=wx.getStorageSync('userInfo')
        const res=await collection.where({
            _openid:openid
        }).get()
        this.setData({
            songInfo:{
                name:tabNameList[tabname],
                tracks:res.data
            }
        })
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

    handleRecomendSongs(value){
        this.setData({
            songs:value
        })
    },

    onSongItemTap(){
        playerStore.setState("playSongList",this.data.songInfo.tracks)
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

        menuStore.offState("songList",this.handleMenuList)
    },

})