// pages/music-player/music-player.js
import {throttle} from "underscore"
import playerStore,{audioContext} from "../../../store/playerStore"

const app=getApp()

const playModeNames=[
    {index:0,playModeName:"order"},
    {index:1,playModeName:"repeat"},
    {index:2,playModeName:"random"}
]

Page({
    data: {
        id:0,

        stateKeys:["id","isPlaying","currentSong","durationTime","currentTime","lycInfos","currentLyricText","currentLyricIndex","playModeIndex","playSongIndex","playSongList"],

        currentSong:{},
        currentTime:0,
        durationTime:0,
        lycInfos:[],
        currentLyricText:"",
        currentLyricIndex:-1,
        isPlaying:true,
        playSongIndex:0,
        playSongList:[],
        isFirstPlay:true,
        playModeIndex:0,
        playModeName:"order",


        currentPage:0,
        statusHeight:0,
        contentHeight:0,
        pageTitles:["歌曲","歌词"],
        slideValue:0,
        isSliderChanging:false,
        lyricScrollTop:0,

        _isWaiting:false,//临时变量

        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取设备信息
        const contentHeight=app.globalData.contentHeight
        const statusHeight=app.globalData.statusHeight
        this.setData({
            contentHeight,
            statusHeight
        })

        const id=options.id

        //根据id播放歌曲
        if(id){
            playerStore.dispatch("playMusicWithSongIdAction",id)
        }
        
        //获取store的共享数据，用于展示播放列表
        playerStore.onStates(this.data.stateKeys,this.getPlayerInfoHandler)
    },

    //将store中数据传递给歌曲播放页的数据
    getPlayerInfoHandler({id,isPlaying,currentSong,durationTime,currentTime,lycInfos,currentLyricText,currentLyricIndex,playModeIndex,playSongIndex,playSongList}){
        if(id!==undefined){
            this.setData({
                id
            })
        }
        if(isPlaying!=undefined){
            this.setData({
                isPlaying
            })
        }
        if(currentSong){
            this.setData({
                currentSong
            })
        }
        if(durationTime!==undefined){
            this.setData({
                durationTime
            })
        }
        if(currentTime!==undefined){
            //实时修改频率太高，使用节流
           this.updateProgress(currentTime)
        }
        if(lycInfos){
            this.setData({
                lycInfos
            })
        }
        if(currentLyricText){
            this.setData({
                currentLyricText
            })
        }
        if(currentLyricIndex!==undefined){
            this.setData({
                currentLyricIndex,
                //修改歌词的进度
                lyricScrollTop:currentLyricIndex*35
            })
        }
        if(playModeIndex!==undefined){
            this.setData({
                playModeName:playModeNames[playModeIndex].playModeName
            })
        }
        if(playSongList){
            this.setData({
                playSongList
            }) 
        }
        if(playSongIndex!==undefined){
            this.setData({
                playSongIndex
            }) 
        }

        
    },

    //节流函数----解决点击进度条跳回的bug
    updateProgress:throttle(function(currentTime){
        if(this.data.isSliderChanging) return
        //记录当前的时间
        const slideValue=currentTime*100/this.data.durationTime
        this.setData({
            currentTime:currentTime,
            //修改slider的进度
            slideValue
        })
    },800,{leading:false,trailing:false}),

    //轮播图切换导航栏歌曲|歌词跟着切换
    onSwiperChange(event){
        this.setData({
            currentPage:event.detail.current
        })
    },

    //点击导航栏歌曲|歌词切换轮播图页面
    onNavTabItemTap(event){
        const index=event.currentTarget.dataset.index
        this.setData({
            currentPage:index
        })
    },

    //拖动进度条
    onSliderChange(event){
        this.data._isWaiting=true
        setTimeout(()=>{
            this.data._isWaiting=false
        },800)
        const value=event.detail.value
        const currentTime=value/100*this.data.durationTime
        audioContext.seek(currentTime/1000)
        this.setData({
            currentTime,
            isSliderChanging:false,
            slideValue:value
        })
    },
    
    //拖动进度条最后改变事件
    onSliderChangeing:throttle(function(event){
        const value=event.detail.value
        const currentTime=value/100*this.data.durationTime
        this.setData({
            currentTime
        })

        //正在滑动的时候，onTimeUpdate就不要监听了
        this.data.isSliderChanging=true
    },100),


    //点击图片播放/暂停歌曲
    onPlayOrPauseTap(){
       playerStore.dispatch("changeMusicStatusAction")
    },

    //点击上一首图标
    onPrevTap(){
        playerStore.dispatch("playNewMusicAciton",false)
    },

    //点击下一首图标
    onNextTap(){
        playerStore.dispatch("playNewMusicAciton")
    },


    //点击图标切换播放模式
    onModeBtnTap(){  
        playerStore.dispatch("changePlayModeAction")
    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        playerStore.offStates(this.data.stateKeys,this.getPlayerInfoHandler)
    },
})