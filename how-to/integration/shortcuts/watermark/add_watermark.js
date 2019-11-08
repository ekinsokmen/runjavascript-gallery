/*
RunJavaScript App and Workflow App integration sample
Input text will be added as watermark on base64 encoded input image and base64 encoded image will be returned.
*/

var img = runjs.getInput().json().img;
var text = runjs.getInput().json().text;
var orientation = runjs.getInput().json().orientation ? runjs.getInput().json().orientation : "Up";

var props = {
  font: "verdana",
  fontSize: 48
}

function run() {
    var tempImg=new Image();
    tempImg.crossOrigin='anonymous';
    tempImg.onload=onImageLoad;
    tempImg.src=img;
}

function onImageLoad(){
  tempCanvas = watermarkedCanvas(element2Canvas(this, orientation),text);
  var resultImgBase64Str = tempCanvas.toDataURL("image/jpeg", 0.5).replace("data:image/jpeg;base64,", "");
  runjs.callBack(resultImgBase64Str);
}

function element2Canvas(element, orientation) {
    var tempCanvas=document.createElement('canvas');
    var tempCtx=tempCanvas.getContext('2d');
    tempCanvas.width=element.width;
    tempCanvas.height=element.height; 
    switch (orientation) {
      case "Right":
        swapCanvasWidthAndHeight(tempCanvas);
        tempCtx.rotate(90*Math.PI/180);
        tempCtx.translate(0, -element.height);
        break;
      case "Down":
        tempCtx.translate(element.width, element.height);
        tempCtx.rotate(180*Math.PI/180);
        break;
      case "Left":
        swapCanvasWidthAndHeight(tempCanvas);
        tempCtx.rotate(-90*Math.PI/180);
        tempCtx.translate(-element.width, 0);
        break;
    }
    tempCtx.drawImage(element,0,0);
    return tempCanvas;       
}

function watermarkedCanvas(canvas,text){
  var tempCanvas=element2Canvas(canvas);
  var cw=tempCanvas.width;
  var ch=tempCanvas.height;
  var tempCtx=tempCanvas.getContext('2d');

  var textHeight = props.fontSize;
  tempCtx.font= textHeight + "px " + props.font;
  var textWidth = tempCtx.measureText(text).width;
  var factor = (cw * 0.8) / textWidth;
  textHeight = Math.round(textHeight * factor);
  tempCtx.font= textHeight + "px " + props.font;
  textWidth = tempCtx.measureText(text).width;

  tempCtx.globalAlpha=.50;
  tempCtx.fillStyle='white'
  //
  rotateCanvas(tempCtx, cw, ch)
  //
  tempCtx.fillText(text,(cw-textWidth)/2,(textHeight*0.50/2)+(ch/2));

  return tempCanvas;
}

function swapCanvasWidthAndHeight(canvas) {
  var width  = canvas.width;  var styleWidth  = canvas.style.width;
  var height = canvas.height; var styleHeight = canvas.style.height;
  canvas.width  = height; canvas.style.width  = styleHeight;
  canvas.height = width;  canvas.style.height = styleWidth;
}

function rotateCanvas(ctx, cw, ch) {
  ctx.translate(cw/2, ch/2);
  ctx.rotate(-1 * Math.atan2(ch, cw));
  ctx.translate(-cw/2, -ch/2);
}

run();