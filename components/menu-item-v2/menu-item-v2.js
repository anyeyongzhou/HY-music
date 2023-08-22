// components/menu-item-v2/menu-item-v2.js
import {menuCollection} from "../../database/index"
import menuStore from "../../store/menuStore"
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        itemData:{
            type:Object,
            value:""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        async onDelTap(event){
            const _id=this.data.itemData._id
            const name=this.data.itemData.name
            const res=await menuCollection.remove(_id)
            if(res){
                wx.showToast({
                  title: `删除${name}歌单成功`,
                })
                menuStore.dispatch("fetchMenuListAction")
            }
        },
        onMenuTap(){
            wx.navigateTo({
            url:`/pages/detail-song/detail-song?type=menutype&_id=${this.data.itemData._id}`,
            })
        }
    }
})
