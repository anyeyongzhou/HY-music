// components/song-item-v2/song-item-v2.js
import {favorCollection,likeCollection,menuCollection,db} from "../../database/index"

const _ =db.command

Component({

    /**
     * 页面的初始数据
     */
    properties: {
        itemData:{
            type:Object,
            value:{}
        },
        index:{
            type:Number,
            value:1
        },
        menuList:{
            type:Array,
            value:[]
        }
    },
    methods:{
        onSongItemTap(){
            const id=this.data.itemData.id
            //console.log(id)
            wx.navigateTo({
              url: `/packagePlayer/pages/music-player/music-player?id=${id}`,
            })
        
        },
        onMoreIconTap(){
            //console.log("onMoreIconTap")
            wx.showActionSheet({
              itemList: ["收藏","喜欢","收藏到歌单"],
              success:res=>{
                const index=res.tapIndex
                this.handleOperationResult(index)
              }
            })
        },

        async handleOperationResult(index){
            let res=null
            switch(index){
                case 0:
                    res=await favorCollection.add(this.properties.itemData)
                    break
                case 1:
                    res=await likeCollection.add(this.properties.itemData)
                    break
                case 2:
                    const menuNames=this.properties.menuList.map(item=>item.name)
                    //console.log(menuNames)
                    wx.showActionSheet({
                        itemList:menuNames,
                        success:(res)=>{
                            //console.log(res)
                            const menuIndex=res.tapIndex
                            this.handleMenuIndex(menuIndex)
                        }
                    })                    
                    break
            }
            if(res){
                const title=index===0?'收藏':'喜欢'
                wx.showToast({
                    title:`添加${title}成功`,
                    
                })
            }
        },

        async handleMenuIndex(index){
            const menuItem=this.properties.menuList[index]
            const data=this.properties.itemData
            const res =await menuCollection.update(menuItem._id,{
                songList:_.push(data)
            })
            if(res){
                wx.showToast({
                  title: '添加到歌单成功',
                })
            }
    
    
        }
    },

    
    
   

})