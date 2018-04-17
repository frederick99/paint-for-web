
var drawing = false;
var strokeStyle = colors[0];
var strokeWidth = markerWidth;


canvas.addEventListener('mousedown', function(e) {
    drawing = true;

    var mouseX = e.x - this.offsetLeft + window.pageXOffset;
    var mouseY = e.y - this.offsetTop + window.pageYOffset;

    startDrawing(mouseX, mouseY, ctx);
}, false);

canvas.addEventListener('mousemove', function (e) {
    if (drawing) {
        var mouseX = e.x - this.offsetLeft + window.pageXOffset;
        var mouseY = e.y - this.offsetTop + window.pageYOffset;
        drawTo(mouseX, mouseY, ctx);
    }
}, false);

canvas.addEventListener('mouseup', function(e) {
    var mouseX = e.x - this.offsetLeft + window.pageXOffset;
    var mouseY = e.y - this.offsetTop + window.pageYOffset;
    stopDrawing(mouseX, mouseY, ctx)
}, false);

canvas.addEventListener('mouseleave', function(e) {
    var mouseX = e.x - this.offsetLeft + window.pageXOffset;
    var mouseY = e.y - this.offsetTop + window.pageYOffset;
    stopDrawing(mouseX, mouseY, ctx);
}, false);

canvas.addEventListener('mouseout', function(e) {
    var mouseX = e.x - this.offsetLeft + window.pageXOffset;
    var mouseY = e.y - this.offsetTop + window.pageYOffset;
    stopDrawing(mouseX, mouseY, ctx);
}, false);




function startDrawing(x, y, c) {
    log('started drawing');

    c.strokeStyle = strokeStyle;
    c.lineWidth = strokeWidth;
    c.lineJoin = "round";

    drawDot(x, y, c);

    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x+1,y);
    c.stroke();
}

function drawTo(x, y, c) {
    c.lineTo(x, y);
    c.stroke();
}

function stopDrawing(x, y, c) {
    log('stopped drawing');

    if (drawing) {
        drawing = false;
        ctx.closePath();
        drawDot(x, y, c);
    }
}

function drawDot(x, y, c) {
    c.beginPath();
    var fillStyle = c.fillStyle;
    c.fillStyle = strokeStyle;
    c.ellipse(x, y, strokeWidth / 2, strokeWidth / 2, 0, 0, 2*Math.PI, false);
    c.fill();
    c.closePath();
    c.fillStyle = fillStyle;
}




