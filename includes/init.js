var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var marker = document.getElementById("marker");
var eraser = document.getElementById("eraser");
var colorButtons = document.getElementsByClassName("color-button");
var slider = document.querySelector("#main #ribbon #width-selector input");
var widthButtons = document.getElementsByClassName("width");

var colors = [
    "#000000", "#808080", "#890012", "#f5141c", "#ff7a28",
    "#f9f500", "#1bbc3b", "#00a5ed", "#3f46d5", "#b03fa9",
    "#ffffff", "#c3c3c3", "#b38055", "#feaec7", "#ffc815",
    "#f0e3ae", "#b1e90c", "#91dee8", "#7192bb", "#c7bee9",
];

var markerWidth = 3;
var eraserWidth = 30;
var markerColor;
var bgColor = "#ffffff";

var hexMap = ["A", "B", "C", "D", "E", "F"];
var filename = "mydrawing";
var activeColor; // used to deactivate color buttons
var activeTool;
var activeWidth;
var darkTheme = false;

var DEBUG = true;

function decToHex(digit) {
    if (digit > 15) return "";
    if (digit < 10) return "" + digit;
    return hexMap[digit - 10];
}

function rgbToHex(rgbString) {
    var rgb = rgbString.substr(4, rgbString.length - 5).split(", ");
    var hex = "#";
    for (var i = 0; i < rgb.length; i++) {
        var n = parseInt(rgb[i]);
        hex += decToHex(Math.floor(n/16));
        hex += decToHex(n % 16);
    }
    return hex;
}

function log(msg) {
    if (DEBUG) console.log(msg);
}

window.onload = function () {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight - 100 - 4;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var temp = "", i = 0;
    for (; i < colors.length / 2; i++)
        temp += "<div class=\"color-button" + (i == 0 ? " active" : "") +
    "\" style=\"background: " + colors[i] + "\"></div>";
    temp += "<br />";
    for(; i < colors.length; i++)
        temp += "<div class=\"color-button\" style=\"background: " +
    colors[i] + "\"></div>";
    var paletteElement = document.getElementById("palette");
    paletteElement.innerHTML = temp;

    activeColor = colorButtons[0];
    for (var i = 0; i < colorButtons.length; i++) {
        colorButtons[i].onmouseup = function () {
            var hexString = rgbToHex(this.style.backgroundColor);
            log("setting color " + hexString);
            strokeStyle = hexString;

            activeColor.classList.remove("active");
            activeColor = this;
            activeColor.classList.add("active");

            activeTool.classList.remove("active");
            activeTool = marker;
            activeTool.classList.add("active");

            strokeWidth = markerWidth;
            slider.value = strokeWidth;

            setColorPickerColor(strokeStyle);
            setStrokeStyle(strokeStyle)
        }
    }

    setColorPickerColor("#ff405f");

    slider.value = strokeWidth;
    slider.oninput = function() {
        setStrokeWidth(parseInt(this.value));
};

activeTool = marker;
marker.onclick = function() {
    if (activeTool != this) {
        activeTool.classList.remove("active");
        activeTool = this;
        activeTool.classList.add("active");

        strokeStyle = markerColor;
        setStrokeWidth(markerWidth);
    }
}
eraser.onclick = function () {
    if (activeTool != this) {
        activeTool.classList.remove("active");
        activeTool = this;
        activeTool.classList.add("active");

        markerColor = strokeStyle
        strokeStyle = bgColor;
        setStrokeWidth(eraserWidth);
    }
}

activeWidth = widthButtons[0];
widthButtons[0].onclick = function () {
    if(activeWidth != this){
        setStrokeWidth(3);
        activeWidth = this;
    }
}
widthButtons[1].onclick = function () {
    if(activeWidth != this){
        setStrokeWidth(6);
        activeWidth = this;
    }
}
widthButtons[2].onclick = function () {
    if(activeWidth != this){
        setStrokeWidth(12);
        activeWidth = this;
    }
}
widthButtons[3].onclick = function () {
    if(activeWidth != this){
        setStrokeWidth(24);
        activeWidth = this;
    }
}
}

var maxW = canvas.width, maxH = canvas.height;
window.onresize = function() {
    var _canvas = document.createElement("canvas");
    var _ctx = _canvas.getContext('2d');
    var w = Math.max(document.documentElement.clientWidth, 750);
    var h = Math.max(document.documentElement.clientHeight - 100 - 4, 200);
    // var maxW = Math.max(maxW, w);
    // var maxH = Math.max(maxH, h);
    _canvas.width = w;
    _canvas.height= h;
    _ctx.fillStyle = bgColor;
    _ctx.fillRect(0, 0, w, h);
    _ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(_canvas, 0, 0, w, h);
}

$('#colorpicker').ColorPicker({
    color: '#ff00ff',
    onShow: function (colpkr) {
        $(colpkr).fadeIn(100);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(100);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#colorpicker').css('backgroundColor', '#' + hex);
        setStrokeStyle("#" + hex);
    }
});

var save = document.getElementById("save");
save.addEventListener('click', function (e) {
    log('saving to file');
    var temp = prompt("Error: Please enter a filename:", filename);
    if (temp != null) {
        if(temp.length > 0) {
            filename = temp;
            canvas.toBlob(function (blob) {
                saveAs(blob, filename + ".png");
            });
            document.title = "Paint4Web - " + filename;
        }
        else alert("Filename cannot be empty!");
    }
}, false);

var nightToggle = document.getElementById("theme");
var ribbon = document.getElementById("ribbon");
nightToggle.addEventListener('click', function () {
    log('toggle night mode');

    if(darkTheme){
        ribbon.classList.remove("dark");
        this.classList.remove("active");
        darkTheme = false;
    }else{
        ribbon.classList.add("dark");
        //this.classList.add("active");
        darkTheme = true;
    }
}, false);

/*
var printButton = document.getElementById("print");
printButton.onclick = function () {
    log('opening print dialog');
    var popup;

    popup = window.open( canvas.toDataURL("image/png") );
    popup.focus(); // Required for IE
    setTimeout(function(){}, 1000);
    popup.print();
    popup.close();
};
*/

function setColorPickerColor(color) {
    $('#colorpicker').ColorPickerSetColor(color);
    $('#colorpicker').css('backgroundColor', color);
}

function setStrokeStyle(style) {
    markerColor = style;
    if (activeTool == marker)
        strokeStyle = style;
    
    activeColor.classList.remove("active");
    var index = colors.indexOf(style.toLowerCase());
    if (index >= 0) {
        activeColor = colorButtons[index];
        activeColor.classList.add("active");
    }
}

function setStrokeWidth(width) {
    deactivate(widthButtons[0]);
    deactivate(widthButtons[1]);
    deactivate(widthButtons[2]);
    deactivate(widthButtons[3]);
    if (width == 3) activate(widthButtons[0]);
    else if (width == 6) activate(widthButtons[1]);
    else if (width == 12) activate(widthButtons[2]);
    else if (width == 24) activate(widthButtons[3]);
    if (activeTool == marker) markerWidth = width;
    else if (activeTool == eraser) eraserWidth = width;
    slider.value = width;
    strokeWidth = width;
}

function deactivate(element) {
    if (activeWidth == element) activeWidth = null;
    element.classList.remove("active");
}

function activate(element) {
    activeWidth = element;
    element.classList.add("active");
}

function setTheme(theme) {
    $('#ribbon').css('background-color', theme.primaryColor);
}