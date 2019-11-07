/*
    Open Google Maps in RunJavaScriptApp and return selected location to calling app.
*/

function main() {
    setupExtentions();
    if (isTopFrame()) {
        if (location.host != "www.google.com") {
            redirectToGoogle();
        } else {
            addNavigationButton();
        }
    }
}

function setupExtentions() {
    String.prototype.matchFirstGroup = function(r){var m=this.match(r); return m && m.length >=2 ? m[1] : ""};
}

function getLocationData() {
    var result = {
        url: location.href,
        address: location.href.matchFirstGroup(/place\/([^\/]*)\//)
    }
    var coordinateData = location.href.matchFirstGroup(/@([0-9\.\-,]*)z/).split(",");
    if (coordinateData.length>=3) {
        result.latitude =  parseFloat(coordinateData[0]);
        result.longitude = parseFloat(coordinateData[1]),
        result.altitude = parseFloat(coordinateData[2]);
    }
    return result;
}

runjs.custom={};
runjs.custom.getLocationData = getLocationData;

var navButton = `
<div id="runjsNavButton" style="
position: fixed;right: 10px; z-index: 1000000000;background: #C0C0C0;opacity: 0.9; px;padding: 5px;border-radius: 10px;top: 65px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
    </svg>
</div>
`

function redirectToGoogle() {
    var query=encodeURIComponent(runjs.getInput().text());
    var url=`https://www.google.com/maps/search/${query}`;
    location.href = url;
}

function addNavigationButton() {
    runjs.printHTML(navButton);
    document.querySelector("#runjsNavButton").addEventListener('click', function () {
        var locationData = runjs.custom.getLocationData();
        if (locationData.url) {
            runjs.callBack(locationData);
        } else {
            alert("Please choose a place first!");
        }
    });      
}

function isTopFrame() {
    return window.self === window.top; 
}

main();