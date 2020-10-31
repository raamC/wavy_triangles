type Coordinate = {
    x: number
    y: number
}

type Line = {
    m: number | null,
    c: number | null,
    x: number | null // for completely vertical lines eg. x = 5
}

type Triangle = {
    left: Coordinate,
    top: Coordinate,
    bottom: Coordinate
}

const canvas: any = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
ctx.translate(0,height); 
ctx.scale(1,-1);


// const points: number[] = [0,19,40,66,93,127,164,210,258,310,365,430,494,568,642,727,812,905,1000]
const points: number[] = [0, 100, 300, 600, 1000]
const triangles: Triangle[] = getTriangles(points)

// drawTriangle({x:0, y:0}, {x:500, y:800},{x:1000, y:500})

console.log(triangles)

triangles.forEach(t => {
    drawTriangle(t.left, t.bottom, t.top)
})

function drawTriangle(c1: Coordinate, c2: Coordinate, c3: Coordinate){
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    ctx.lineTo(c2.x , c2.y);
    ctx.lineTo(c3.x , c3.y);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();
} 

function getTriangles(points: number[]): Triangle[] {
    const horizontalLines: Line[] = getHorizontalLines(points)
    const verticalLines: Line[] = getVerticalLines(points)

    const triangles: Triangle[] = []
    for(let i=0; i< horizontalLines.length -1; i++){
        for(let j=0; j<verticalLines.length -1; j++) {
            triangles.push(getTriangle(horizontalLines[i], horizontalLines[i+1], verticalLines[j],verticalLines[j+1]))
        }
    }

    return triangles
}

function getTriangle(h1: Line, h2: Line, v1: Line, v2: Line): Triangle{
    return {
        left: getIntersection(h1, v1),
        top: getIntersection(h2, v2),
        bottom: getIntersection(h1, v2)
    }
}

function getIntersection(h: Line, v: Line): Coordinate{
    const x: number = v.x != null ? v.x : (v.c - h.c)/(h.m - v.m)
    const y:number = h.m * x + h.c
    return {x,y}
}

function getHorizontalLines(points: number[]): Line[]{
    const oppositePoints: number[] = getOppositePoints(points)
    const lines: Line[] = []

    points.map((p,i) => lines.push(getLineFromTwoCoordinates({x: 0, y: points[i]}, {x: points.length, y: oppositePoints[i]})))
    return lines
}

function getVerticalLines(points: number[]): Line[]{
    const oppositePoints: number[] = getOppositePoints(points)
    const lines: Line[] = []

    points.map((p,i) => lines.push(getLineFromTwoCoordinates({x: points[i], y: points.length}, {x: oppositePoints[i], y: 0})))
    points.map((p,i) => lines.push(getLineFromTwoCoordinates({x: points[i], y: points.length}, {x: oppositePoints[i], y: 0})))
    return lines
}

function getLineFromTwoCoordinates(c1: Coordinate, c2: Coordinate): Line{
    const dy: number = (c1.y - c2.y)
    const dx: number = (c1.x - c2.x)

    if (dx == 0) { //completely vertical line case
        return {m: null, c: null, x: c1.x}
    }

    const gradient: number = dy/dx
    const intercept: number  = c1.y - gradient * c1.x
    return {m: gradient, c: intercept, x: null}
}

function getOppositePoints(points: number[]): number[]{
    const highestPoint: number = points[points.length - 1]
    const oppositePoints: number[] = []
    for(let i=0; i<points.length; i++) {
        oppositePoints.push(highestPoint - points[points.length-1- i])
    }
    return oppositePoints
}

// function getPoints(stepSize, numberOfPoints, fudge){
//     const points = []
//     for (let i=0; i<numberOfPoints; i++){
//         points.push(i > 0 ? points[i -1]*(1 +stepSize/100) + fudge  : 0)
//     }
//     return points
// }

// tsc --out test2.js index.ts

// TODO

// measure points from image
// scale to canvas size

// animate
// oscillate
