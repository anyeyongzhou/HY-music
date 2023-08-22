// app.js
App({
    
    onLaunch(){
        wx.getSystemInfo({
            success:res=>{
                //console.log(res)
                this.globalData.screenWidth=res.screenWidth
                this.globalData.screenHeight=res.screenHeight
                this.globalData.statusBarHeight=res.statusBarHeight
                this.globalData.statusHeight=res.statusBarHeight
                this.globalData.contentHeight=res.screenHeight-res.statusBarHeight-44
            }
        })

        //云开发能力初始化
        wx.cloud.init({
            env:"cloud1-9gm2w5hvbbaff6e6"
        })
    },
    globalData:{
        screenWidth:375,
        screenHeight:667,
        statusBarHeight:20,
        contentHeight:500
    }
    
})
