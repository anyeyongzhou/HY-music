// pages/music-player/music-player.js
import {getSongDetail,getSongLyric} from "../../services/player"
import {indexOf, throttle} from "underscore"
import playerStore from "../../store/playerStore"
import {parseLyric} from "../../utils/parse-lyric"

const app=getApp()

//创建播放器
const audioContext=wx.createInnerAudioContext()
const playModeNames=[
    {index:0,playModeName:"order"},
    {index:1,playModeName:"repeat"},
    {index:2,playModeName:"random"}
]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:0,
        currentSong:{},
        lycInfos:[],
        currentLyricText:"",
        currentLyricIndex:-1,
        currentPage:0,
        statusHeight:0,
        contentHeight:0,
        pageTitles:["歌曲","歌词"],
        currentTime:0,
        durationTime:0,
        slideValue:0,
        isSliderChanging:false,
        isWaiting:false,
        isPlaying:true,
        lyricScrollTop:0,

        playSongIndex:0,
        playSongList:[],
        isFirstPlay:true,
        playModeIndex:0,
        playModeName:"order",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const id=options.id
        const contentHeight=app.globalData.contentHeight
        const statusHeight=app.globalData.statusHeight
        this.setData({
            id,
            contentHeight,
            statusHeight
        })

        //播放歌曲的逻辑
        this.setupPlaySong(options.id)

        //获取store的共享数据，用于展示播放列表
        playerStore.onStates(["playSongList","playSongIndex"],this.getPlaySongInfoHandler)
    },

    setupPlaySong(id){
        this.setData({
            id
        })
        //获取歌曲的详情
        this.fetchGetSongDetail()
        //获取歌曲的歌词
        this.fetchGetSongLyric()
        //播放歌曲
        this.doAudioPlay()
    },

    getPlaySongInfoHandler({playSongIndex,playSongList}){
        //console.log(value)
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

    doAudioPlay(){
        audioContext.stop()
        audioContext.src=`https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`
        //准备好久自动播放
        audioContext.autoplay=true
        audioContext.volume=0.1

        if(this.data.isFirstPlay){//只有第一次加载才需要加载监听事件
            this.data.isFirstPlay=false
            //监听播放的进度
            const throttleUpdateProgress=throttle(this.updateProgress,800,{leading:false,trailing:false})
            audioContext.onTimeUpdate(()=>{
                if(!this.data.isSliderChanging && !this.data.isWaiting){
                    throttleUpdateProgress()
                }  

                //匹配正确的歌词
                if(!this.data.lycInfos.length) return
                let index=this.data.lycInfos.length-1
                for(let i=0;i<this.data.lycInfos.length;i++){
                    const info=this.data.lycInfos[i]
                    if(info.time>audioContext.currentTime*1000){
                        index=i-1
                        break
                    }
                }
                if(index===this.data.currentLyricIndex) return 
                //获取歌词的索引和问题
                const currentLyricText=this.data.lycInfos[index].text
                this.setData({
                    currentLyricText,
                    currentLyricIndex:index,
                    //改变歌词滚动的位置
                    lyricScrollTop:35*index
                })   
            })

            //监听音频加载中事件
            audioContext.onWaiting(()=>{
                audioContext.pause()
            })

            //监听缓存结束，可以播放
            audioContext.onCanplay(()=>{
                audioContext.play()
            })

            //监听一首歌播放结束，自动调到下一首
            audioContext.onEnded(()=>{
                if(audioContext.loop) return 
                this.changeNewSong()
            })
        }

    },

    updateProgress(){
        //记录当前的时间
        const slideValue=audioContext.currentTime*100000/this.data.durationTime
        this.setData({
            currentTime:audioContext.currentTime*1000,
            slideValue
        })

    },

    async fetchGetSongDetail(){
        const res=await getSongDetail(this.data.id)
        this.setData({
            currentSong:res.songs[0],
            durationTime:res.songs[0].dt
        })
    },

    async fetchGetSongLyric(){
        const res=await getSongLyric(this.data.id)
        this.setData({
            lycInfos:parseLyric(res.lrc.lyric)
        })
    },

    onSwiperChange(event){
        //console.log(event)
        this.setData({
            currentPage:event.detail.current
        })
    },

    onNavTabItemTap(event){
        const index=event.currentTarget.dataset.index
        this.setData({
            currentPage:index
        })
    },

    onSliderChange(event){
        this.data.isWaiting=true
        setTimeout(()=>{
            this.data.isWaiting=false
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
    
    onSliderChangeing:throttle(function(event){
        const value=event.detail.value
        const currentTime=value/100*this.data.durationTime
        this.setData({
            currentTime
        })

        //正在滑动的时候，onTimeUpdate就不要监听了
        this.data.isSliderChanging=true
    },100),


    onPlayOrPauseTap(){
        if(!audioContext.paused){
            audioContext.pause()
            this.setData({
                isPlaying:false
            })
        }else{
            audioContext.play()
            this.setData({
                isPlaying:true
            })
        }
    },

    onPrevTap(){
        this.changeNewSong(false)
    },

    onNextTap(){
        this.changeNewSong()
    },

    changeNewSong(isNext=true){
        const length=this.data.playSongList.length
        let index=this.data.playSongIndex

        switch(this.data.playModeIndex){
            case 1:
            case 0:
                index=isNext?index+1:index-1
                if(index===length){
                    index=0
                }
                if(index===-1){
                    index=length-1
                }
                break
            // case 1:

            //     break
            case 2:
                index=Math.floor(Math.random()*length)
                break

        }
        
        const newSong=this.data.playSongList[index]

        this.data.id=newSong.id
        //将之前的数据回到初始状态
        this.setData({
            currentSong:{},
            currentTime:0,
            durationTime:0
        })
        this.setupPlaySong(newSong.id)

        //更新索引
        playerStore.setState("playSongIndex",index)
    },

    onModeBtnTap(){
        let playModeIndex=this.data.playModeIndex
        playModeIndex=playModeIndex+1
        if(playModeIndex===3){
            playModeIndex=0
        }

        if(playModeIndex===1){
            audioContext.loop=true
        }else{
            audioContext.loop=false
        }

        const playModeName=playModeNames[playModeIndex].playModeName
        this.setData({
            playModeIndex,
            playModeName
        })

    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        playerStore.offStates(["playSongList","playSongIndex"],this.getPlaySongInfoHandler)
    },
})