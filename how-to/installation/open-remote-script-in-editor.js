function main() {

let input=runjs.getInput().text();
let urlPromise = input?Promise.resolve(input):Clipboard.getString();

urlPromise.then(checkURL)
.then(handleGitHubURL)
.then(u => fetch(u)).then(r => r.text())
.then(s => {return {script: s}})
.then(handleIconAnnotation)
.then(handleBaseURLAnnotation)
.then(handleDefaultInputAnnotation)
.then(handleFileNameAnnotation)
.then(prepareTargetURL)
.then(u => {
  runjs.redirect(u);
 })
.catch(e => Alert.alert("Error", e.message).then(() => runjs.close())
);
};

const checkURL = u => u.startsWith("http")?u:Promise.reject(new Error("Clipboard should include a proper URL."));

const handleGitHubURL= u => u.replace("https://github.com", "https://raw.githubusercontent.com").replace("/blob", "");

const handleIconAnnotation = o => {
 o.icon = getAnnotationValue(o.script, "HomeScreenIcon");
 return o;
};

const handleBaseURLAnnotation = o => {
 o.baseURL = getAnnotationValue(o.script, "BaseURL");
 return o;
};

const handleDefaultInputAnnotation = o => {
 o.input = getAnnotationValue(o.script, "DefaultInput");
 return o;
};

const handleFileNameAnnotation = o => {
 o.file = getAnnotationValue(o.script, "FileName");
 return o;
};

const getAnnotationValue = (content, annoStr) => {
 let val = "";
 let match = content.match("@" + annoStr + "\\(\"(.*)\"\\)");
 if (match && match.length > 1) {
  val = match[1];
 }
 return val;
};

const prepareTargetURL = o => {
 let url = "runjavascript://edit/run?";
 if (o.icon) url = url + "icon=" + encodeURIComponent(o.icon) + "&";
 if (o.baseURL) url = url + "baseURL=" + encodeURIComponent(o.baseURL) + "&";
 if (o.input) url = url + "input=" + encodeURIComponent(o.input) + "&";
 if (o.file) url = url + "file=" + encodeURIComponent(o.file) + "&";
 url = url + "script=" + encodeURIComponent(o.script);
 return url;
};

main();