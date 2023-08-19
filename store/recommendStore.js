import {HYEventStore} from "hy-event-store"
import {getPlaylistDetail} from "../services/music"

const recommendStore=new HYEventStore({
    state:{
        recommendSongInfo:{}
    },
    actions:{
        fetchRecommendSongsAction(ctx){
            getPlaylistDetail(3778678).then(res=>{
                //console.log(res)
                ctx.recommendSongInfo=res.playlist
            })
        }
    }
})

export default recommendStore