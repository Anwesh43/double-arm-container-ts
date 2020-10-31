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