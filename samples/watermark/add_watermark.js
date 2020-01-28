
var text = runjs.getInput().json().text;
var width = runjs.getInput().json().width;
var height = runjs.getInput().json().height;
var customProps = runjs.getInput().json().props || {};

const baseProps = {
    font: "verdana",
    alpha: 0.5,
    color: 'white'
}

const props = {...baseProps, ...customProps}
    
function run() {
    var tempCanvas = watermarkedCanvas(text, width, height);
    var resultImgBase64Str = tempCanvas.toDataURL("image/png").replace("data:image/png;base64,", "");
    runjs.callback(resultImgBase64Str);
}

function watermarkedCanvas(text, width, height) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    const textDimensions = calculateTextDimensions(tempCtx, text, width, height);
  
    tempCtx.globalAlpha = props.alpha;
    tempCtx.fillStyle = props.color;
    //
    rotateCanvas(tempCtx, width, height)
    //
    tempCtx.fillText(text, (width - textDimensions.width) / 2, (textDimensions.height * 0.50 / 2) + (height / 2));

    return tempCanvas;
}

function calculateTextDimensions(canvasCtx, text, width, height) {
    const fontSize = 48;
    const th = fontSize;
    canvasCtx.font = th + "px " + props.font;
    const tw = canvasCtx.measureText(text).width;

    var magicFactor = 0.9807526 + (0.004905433 - 0.9807526) / (1 + Math.pow(tw / 75.08524, 1.153253));
    var factor = (Math.max(width, height) / tw) * magicFactor;

    const textHeight = Math.round(th * factor);
    canvasCtx.font = textHeight + "px " + props.font;
    const textWidth = canvasCtx.measureText(text).width;

    return {
        width: textWidth,
        height: textHeight
    }
}

function rotateCanvas(ctx, cw, ch) {
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate(-1 * Math.atan2(ch, cw));
    ctx.translate(-cw / 2, -ch / 2);
}

run();