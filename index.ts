import { timeStamp } from "console"

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

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawArmContainerPath(context : CanvasRenderingContext2D, size : number, armSize : number, scale : number) {
        context.save()
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(size, 0)
        context.lineTo(size, -size)
        context.lineTo(size - armSize, -size)
        context.lineTo(size - armSize, -armSize)
        context.lineTo(0, -armSize)
        context.lineTo(0, 0)
        context.clip()
        context.fillRect(0, -size * scale, size, size * scale)
        context.restore()
    }

    static drawDoubleArmContainer(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const armSize : number = Math.min(w, h) / armWidthFactor
        const sf : number = ScaleUtil.sinify(scale)
        context.save()
        context.translate(w / 2, h / 2)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawLine(context, 0, 0, size * ScaleUtil.divideScale(sf, 0, parts), 0)
            DrawingUtil.drawLine(context, size, 0, size, -size * ScaleUtil.divideScale(sf, 1, parts))
            DrawingUtil.drawLine(context, size, -size, size - armSize * ScaleUtil.divideScale(sf, 2, parts), -size)
            DrawingUtil.drawLine(context, size - armSize, -size, size - armSize, -size + (size - armSize) * ScaleUtil.divideScale(sf, 3, parts))
            DrawingUtil.drawLine(context, size - armSize, -armSize, (size - armSize) * (1 - ScaleUtil.divideScale(sf, 4, parts)), -armSize)
            DrawingUtil.drawArmContainerPath(context, size, armSize, ScaleUtil.divideScale(sf, 5, parts))
            context.restore()
        }
        context.restore()
    }

    static drawDACNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawDoubleArmContainer(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }   
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class DACNode {

    prev : DACNode 
    next : DACNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new DACNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawDACNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : DACNode {
        var curr : DACNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
}