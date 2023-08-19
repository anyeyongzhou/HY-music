import {HYEventStore} from "hy-event-store"
import {getSongDetail,getSongLyric} from "../services/player"
import {parseLyric} from "../utils/parse-lyric"

export const audioContext=wx.createInnerAudioContext()

const playerStore=new HYEventStore({
    state:{
        playSongList:[],
        playSongIndex:0,

        id:0,

        currentSong:{},
        currentTime:0,
        durationTime:0,
        lycInfos:[],
        currentLyricText:"",
        currentLyricIndex:-1,
        isFirstPlay:true,
        isPlaying:false,
        playModeIndex:0,
    },
    actions:{
       playMusicWithSongIdAction(ctx,id){
            //将之前的数据回到初始状态
            ctx.currentSong={}
            ctx.currentTime=0
            ctx.durationTime=0
            ctx.currentLyricIndex=0
            ctx.currentLyricText=""
            ctx.lycInfos=[]

            ctx.id=id
            ctx.isPlaying=true

            getSongDetail(id).then((res)=>{
                ctx.currentSong=res.songs[0]
                ctx.durationTime=res.songs[0].dt
            })
            
            
            getSongLyric(ctx.id).then((res)=>{
                ctx.lycInfos=parseLyric(res.lrc.lyric)
            })


            audioContext.stop()
            audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
            //准备好久自动播放
            audioContext.autoplay=true
            audioContext.volume=0.1
            if(ctx.isFirstPlay){//只有第一次加载才需要加载监听事件
                ctx.isFirstPlay=false
                audioContext.onTimeUpdate(()=>{
                    //获取当前播放的时间
                    ctx.currentTime=audioContext.currentTime*1000
                    //匹配正确的歌词
                    if(!ctx.lycInfos.length) return
                    let index=ctx.lycInfos.length-1
                    for(let i=0;i<ctx.lycInfos.length;i++){
                        const info=ctx.lycInfos[i]
                        if(info.time>audioContext.currentTime*1000){
                            index=i-1
                            break
                        }
                    }
                    if(index===ctx.currentLyricIndex || index===-1) return 

                    //获取歌词的索引和问题
                    const currentLyricText=ctx.lycInfos[index].text
                    ctx.currentLyricText=currentLyricText
                    ctx.currentLyricIndex=index

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

                    this.dispatch("playNewMusicAciton")
                })
            }
       },
       changeMusicStatusAction(ctx){
            if(!audioContext.paused){
                audioContext.pause()
                ctx.isPlaying=false
            }else{
                audioContext.play()
                ctx.isPlaying=true
            }
       },
       changePlayModeAction(ctx){
            let playModeIndex=ctx.playModeIndex
            playModeIndex=playModeIndex+1
            if(playModeIndex===3){
                playModeIndex=0
            }
            ctx.playModeIndex=playModeIndex 

            if(playModeIndex===1){
                audioContext.loop=true
            }else{
                audioContext.loop=false
            }
            
       },
       playNewMusicAciton(ctx,isNext=true){
            const length=ctx.playSongList.length
            let index=ctx.playSongIndex

            switch(ctx.playModeIndex){
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
            
            const newSong=ctx.playSongList[index]
            ctx.id=newSong.id
            
            this.dispatch("playMusicWithSongIdAction",ctx.id)

            //更新索引
            ctx.playSongIndex=index
       }
    }
})

export default playerStore