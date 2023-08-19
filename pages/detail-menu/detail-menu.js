// pages/detail-menu/detail-menu.js
import {getSongMenuTag,getSongMenuList} from "../../services/music"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        songMenus:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.fetchGetAllMenuList()
    },

    async fetchGetAllMenuList(){
        const tagRes=await getSongMenuTag()
        const tags=tagRes.tags

        const allPromises=[]
        for(const tag of tags){
            const promise=getSongMenuList(tag.name)
            //console.log(promise)
            allPromises.push(promise)
        }

        Promise.all(allPromises).then(res=>{
            //console.log(res)
            this.setData({
                songMenus:res
            })
        })
    }

   

})