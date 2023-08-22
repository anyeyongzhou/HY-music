import {HYEventStore} from 'hy-event-store'

import {menuCollection} from "../database/index"

const menuStore=new HYEventStore({
    state:{
        songList:[]
    },
    actions:{
        async fetchMenuListAction(ctx){
            const res=await menuCollection.query()
            ctx.songList=res.data
        }
    }
})

menuStore.dispatch("fetchMenuListAction")

export default menuStore