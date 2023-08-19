// components/song-item-v2/song-item-v2.js
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
        }
    },
    methods:{
        onSongItemTap(){
            const id=this.data.itemData.id
            //console.log(id)
            wx.navigateTo({
              url: `/packagePlayer/pages/music-player/music-player?id=${id}`,
            })
        
        }
    }
   

})