var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var canvasSize = canvas.width;
//converts canvas to cartesian coordinates
ctx.translate(0, canvasSize);
ctx.scale(1, -1);
var fps = 60;
var startTime = Date.now();
var points = scalePoints([0, 19, 40, 66, 93, 127, 164, 210, 258, 310, 365, 430, 494, 568, 642, 727, 812, 905, 1000]);
requestAnimationFrame(animate);
function animate() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    var triangles = getTriangles(points.map(function (p) { return oscillate(p); }));
    drawTriangles(triangles);
    setTimeout(function () { return requestAnimationFrame(animate); }, 1000 / fps);
}
function oscillate(centrePoint) {
    // macro oscillation
    var timeDiff = Date.now() - startTime;
    var cycleTime = 100000;
    var maxDistortion = 120;
    var macroOscillation = Math.sin((timeDiff % cycleTime) * (2 * Math.PI / cycleTime)) * maxDistortion;
    // micro oscillation
    var millisecond = new Date().getMilliseconds();
    var microOscillation = Math.sin(millisecond * ((2 * Math.PI) / 999));
    return centrePoint + (microOscillation * getDistanceEffect(centrePoint) * macroOscillation);
}
function getDistanceEffect(point) {
    return (canvasSize / 2 - Math.abs(canvasSize / 2 - point)) / (canvasSize / 2); // 0 at edges, 1 at the centre
}
function drawTriangles(triangles) {
    triangles.forEach(function (t) {
        drawTriangle(t.left, t.bottom, t.top);
    });
}
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
    points.map(function (p, i) { return lines.push(getLineFromTwoCoordinates({ x: 0, y: oppositePoints[i] }, { x: canvasSize, y: points[i] })); });
    return lines;
}
function getVerticalLines(points) {
    var oppositePoints = getOppositePoints(points);
    var lines = [];
    points.map(function (p, i) { return lines.push(getLineFromTwoCoordinates({ x: oppositePoints[i], y: canvasSize }, { x: points[i], y: 0 })); });
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
function scalePoints(points) {
    return points.map(function (p) { return p * (canvasSize / points[points.length - 1]); });
}
