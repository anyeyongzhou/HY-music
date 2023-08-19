const timeReg=/\[(\d{2}):(\d{2}).(\d{2,3})\]/
export function parseLyric(string){
    const lyricInfos=[]

    const lyricLines=string.split("\n")
    for(const lineString of lyricLines){
        const result=timeReg.exec(lineString)
        if(!result) continue
        const minte=result[1]*60*1000
        const second=result[2]*1000
        const mSecond=result[3].length===2?result[3]*10:result[3]*1
        const time=minte+second+mSecond
        const text=lineString.replace(timeReg,"")

        lyricInfos.push({time,text})
    }

    return lyricInfos
}