var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
ctx.translate(0, height);
ctx.scale(1, -1);
// const points: number[] = [0,19,40,66,93,127,164,210,258,310,365,430,494,568,642,727,812,905,1000]
var points = [0, 100, 300, 600, 1000];
var triangles = getTriangles(points);
// drawTriangle({x:0, y:0}, {x:500, y:800},{x:1000, y:500})
console.log(triangles);
triangles.forEach(function (t) {
    drawTriangle(t.left, t.bottom, t.top);
});
function drawTriangle(c1, c2, c3) {
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    ctx.lineTo(c2.x, c2.y);
    ctx.lineTo(c3.x, c3.y);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();
}
function getTriangles(points) {
    var horizontalLines = getHorizontalLines(points);
    var verticalLines = getVerticalLines(points);
    var triangles = [];
    for (var i = 0; i < horizontalLines.length - 1; i++) {
        for (var j = 0; j < verticalLines.length - 1; j++) {
            triangles.push(getTriangle(horizontalLines[i], horizontalLines[i + 1], verticalLines[j], verticalLines[j + 1]));
        }
    }
    return triangles;
}
function getTriangle(h1, h2, v1, v2) {
    return {
        left: getIntersection(h1, v1),
        top: getIntersection(h2, v2),
        bottom: getIntersection(h1, v2)
    };
}
function getIntersection(h, v) {
    var x = v.x != null ? v.x : (v.c - h.c) / (h.m - v.m);
    var y = h.m * x + h.c;
    return { x: x, y: y };
}
function getHorizontalLines(points) {
    var oppositePoints = getOppositePoints(points);
    var lines = [];
    points.map(function (p, i) { return lines.push(getLineFromTwoCoordinates({ x: 0, y: points[i] }, { x: points.length, y: oppositePoints[i] })); });
    return lines;
}
function getVerticalLines(points) {
    var oppositePoints = getOppositePoints(points);
    var lines = [];
    points.map(function (p, i) { return lines.push(getLineFromTwoCoordinates({ x: points[i], y: points.length }, { x: oppositePoints[i], y: 0 })); });
    points.map(function (p, i) { return lines.push(getLineFromTwoCoordinates({ x: points[i], y: points.length }, { x: oppositePoints[i], y: 0 })); });
    return lines;
}
function getLineFromTwoCoordinates(c1, c2) {
    var dy = (c1.y - c2.y);
    var dx = (c1.x - c2.x);
    if (dx == 0) {
        return { m: null, c: null, x: c1.x };
    }
    var gradient = dy / dx;
    var intercept = c1.y - gradient * c1.x;
    return { m: gradient, c: intercept, x: null };
}
function getOppositePoints(points) {
    var highestPoint = points[points.length - 1];
    var oppositePoints = [];
    for (var i = 0; i < points.length; i++) {
        oppositePoints.push(highestPoint - points[points.length - 1 - i]);
    }
    return oppositePoints;
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
