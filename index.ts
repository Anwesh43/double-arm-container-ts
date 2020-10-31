const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 7
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 4.9 
const armWidthFactor : number = 15.2 
const delay : number = 20
const backColor : string = "#BDBDBD"
const colors : Array<string> = [
    "#F44336",
    "#4CAF50",
    "#3F51B5",
    "#009688",
    "#FF9800"
] 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}