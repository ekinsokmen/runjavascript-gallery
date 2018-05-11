var timeTableItems;
var dist = 500/2;

var searchTypePromise = Alert.alert("Choose Stop Search Type:", "", [{text: "By Letter"}, {text: "By Name"}]);
var locationPromise = navigator.geolocation.getCurrentPosition(null,null,{locationAccuracyInMeters: dist * 2}).catch(handleError);
var stopsNearByPromise = getStopsNearBy(locationPromise).catch(handleError);
applyStyle();
appleTemplate();
var selectedStopPromise = getSelectedStop(searchTypePromise, stopsNearByPromise).catch(handleError);
var selectedFinalStopPromise = getSelectedFinalStop(selectedStopPromise);
function loadAndDisplayTimeTable(selectedFinalStopPromise) {
  showReloadButtonVisibility(false);
  setReloadingImgVisibility(true);
  var timeTableDataPromise = loadTimeTable(selectedFinalStopPromise).catch(handleError);
  displayTimeTable(timeTableDataPromise).catch(handleError);
};
runjs.custom = {
  reload : () => loadAndDisplayTimeTable(selectedFinalStopPromise),
  toggleIdleTimerState : toggleIdleTimerState
}
runjs.custom.reload();


//
// Functions
//
var idleTimerState = true;

function calcLongDist(lat){return 111-((111/90)*Math.abs(lat))}
function longitudeDistanceToDegree(latitude, meters) {return (meters/(1000 * calcLongDist(latitude)))}
function latitudeDistanceToDegree(meters) {return meters/(1000*111)}
function handleError(err) {
  console.error(err);
}

async function getStopsNearBy (locationPromise) {
  var position = await locationPromise;
  var swLat = position.coords.latitude - latitudeDistanceToDegree(dist);
  var swLon = position.coords.longitude - longitudeDistanceToDegree(position.coords.latitude, dist);
  var neLat = position.coords.latitude + latitudeDistanceToDegree(dist);
  var neLon = position.coords.longitude + longitudeDistanceToDegree(position.coords.latitude, dist);  
  var tflURL = 'https://api-radon.tfl.gov.uk/StopPoint?'
    + 'swLat=' + swLat 
    + '&swLon=' + swLon 
    + '&neLat=' + neLat 
    + '&neLon=' + neLon 
    + '&stopTypes=TransportInterchange,NaptanMetroStation,NaptanRailStation,NaptanBusCoachStation,NaptanFerryPort,NaptanPublicBusCoachTram&modes=tube,bus,coach,overground,dlr,cable-car,national-rail,river-bus,river-tour,tram&includeChildren=false&returnLines=false&categories=Direction&useStopPointHierarchy=false&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';
  console.log("TFL URL", tflURL);
  var stopsNearbyResp = await fetch(tflURL);
  var stopsNearby = await stopsNearbyResp.json();
  var stopsNearbyFlat = stopsNearby.map(s => {
      var towardsList = s.additionalProperties.filter(e => e.key==="Towards");
      var towards = "";
      if (towardsList && towardsList.length > 0) {
        towards = towardsList[0].value;
      }
      return {id: s.id, letter: s.stopLetter, name: s.commonName, towards: towards}
  });
  console.log("getStopsNearBy", stopsNearbyFlat);
  return stopsNearbyFlat;
}

function applyStyle() {
  runjs.addStyle(`
  body {
    background-color: #333333;
  }

  .depb {
      width: 95%;
      margin-bottom: 5px;
      padding:  5px 10px;
      display: inline-block;
      background: rgb(30, 30, 30);
      background: -webkit-gradient(linear, center top, center bottom, 
        color-stop(0.0, rgba(0,0,0, 1)), 
        color-stop(0.05, rgba(30,30,30, 1)),  
        color-stop(1.0, rgba(50, 50, 60, 1)));
      background: -moz-linear-gradient(270deg, 
        rgba(0,0,0,1) 0%, 
        rgba(30, 30, 30, 1) 5%, 
        rgba(50, 50, 60, 1) 100%);
      /* border radius */
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      -khtml-border-radius: 3px;
      border-radius: 3px;

      font-weight: normal;
      text-transform: uppercase;
      color: white;
      /* box shadow */
      -webkit-box-shadow: 
        inset 0 -1px 0 rgba(50,50,50,0.7), 
        inset 0 -2px 0 rgba(0,0,0,0.7), 
        inset 2px 0px 4px rgba(0,0,0,0.9), 
        inset -2px 0px 4px rgba(0,0,0,0.9), 
        0 1px 0px rgba(255,255,255,0.2);
      -moz-box-shadow: 
        inset 0 -1px 0 rgba(50,50,50,0.7), 
        inset 0 -2px 0 rgba(0,0,0,0.7), 
        inset 2px 0px 4px rgba(0,0,0,0.9), 
        inset -2px 0px 4px rgba(0,0,0,0.9), 
        0 1px 0px rgba(255,255,255,0.2);
      box-shadow:
        inset 0 -1px 0 rgba(50,50,50,0.7), 
        inset 0 -2px 0 rgba(0,0,0,0.7), 
        inset 2px 0px 4px rgba(0,0,0,0.9), 
        inset -2px 0px 4px rgba(0,0,0,0.9), 
        0 1px 0px rgba(255,255,255,0.2);
  }
  .depb:before {
      /* approximation for old browsers */
      border-top: 1px solid rgb(30, 30, 30);
      border-top: 1px solid rgba(0,0,0,0.4);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      height: 0px;
      width: 105%;
      position: relative;
      left: -9px;
      top: 11px;
      content: " ";
      display: block;
  }

  span.left {
    float: left;
    text-align: left;
  }

  span.right {
    float: right;
    text-align: right;
  }
  `);
}

function appleTemplate() {
  var template = `
  <center><div id="timeTableDiv"></div></center>
  <center>
  <svg id='reloadButton' onclick="runjs.custom.reload()" style="color: white; position: fixed;bottom: 5px; left: 54px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw">
  <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
  <svg id='reloadingImg' style="color: white; opacity: 0.5; position: fixed;bottom: 5px; left: 54px; display: none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader" color="#384047" data-reactid="696">
  <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
  </center>
  <div style="position: fixed;bottom: 5px;right: 10px; opacity: 1.0;">
      <svg xmlns="http://www.w3.org/2000/svg" style="color: white;" onclick="runjs.close()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
  </div>
  <div id="screenLockOffOnImg" style="position: fixed;bottom: 5px;left: 10px; opacity: 1.0;">
  <svg xmlns="http://www.w3.org/2000/svg" style="color: white;" onclick="runjs.custom.toggleIdleTimerState()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  </div>
  `;  
  document.getElementsByTagName("body")[0].innerHTML=template;  
}

function askForStopLetter(stops) {
  var resolve, reject;
  var promise = new Promise((res, rej) => {resolve=res; rej=reject;});
  var buttonList = stops.filter(e => e.letter).map(e => {
    return {text: e.letter, onPress: () => resolve([e])};
  });
  console.log("letter buttons", buttonList);
  Alert.alert("Choose Stop Letter:", "", buttonList);
  return promise;
}

function askForStopName(stops) {
  var resolve, reject;
  var promise = new Promise((res, rej) => {resolve=res; rej=reject;});
  var stopsByName = {};
  stops.filter(s => s.towards).forEach(s => {
    if (!stopsByName[s.name]) {
      stopsByName[s.name] = [s];
    } else {
      stopsByName[s.name].push(s);
    }
  });
  var buttonList = Object.keys(stopsByName).map(n => {
    return {text: n, onPress: () => resolve(stopsByName[n])};
  });
  console.log("name buttons", buttonList);
  Alert.alert("Choose Stop:", "", buttonList);
  return promise;  
}

function askForDirection(selectedStops) {
  var resolve, reject;
  var promise = new Promise((res, rej) => {resolve=res; rej=reject;});
  var buttonList = selectedStops.map(e => {
    return {text: e.towards, onPress: () => resolve(e)};
  });
  console.log("direction buttons", buttonList);
  Alert.alert("Choose Direction:", "", buttonList);
  return promise;
}

async function getSelectedStop (searchTypePromise, stopsNearByPromise) {
  var searchType = await searchTypePromise;
  console.log("Search type", searchType);
  var stops = await stopsNearByPromise;
  console.log("Stops", stops);
  var promise;
  if (stops.length > 0) {
    switch(searchType) {
      case "By Letter":
        promise = askForStopLetter(stops);
        break;
      case "By Name":
        promise = askForStopName(stops);
        break;
      default:
      throw new Error("Unknown search type!");
    }
  } else {
    throw new Error("No stop found.");
  }
  return promise;
}

async function getSelectedFinalStop (selectedStopPromise) {
  var selectedStops = await selectedStopPromise;
  console.log("Selected stop(s)", selectedStops);
  var selectedStop;
  if (selectedStops.length == 0) {
    throw new Error("No stop data available.");
  }
  if (selectedStops.length > 1) {
    selectedStop = await askForDirection(selectedStops);
  } else {
    selectedStop = selectedStops[0];
  }
  return selectedStop;
}

async function loadTimeTable (selectedFinalStopPromis) {
  var selectedStop = await selectedFinalStopPromis;
  console.log("Selected final stop", selectedStop);
  var tflURL = 'https://api.tfl.gov.uk/StopPoint/' + selectedStop.id + '/Arrivals?app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';
  console.log("TFL URL", tflURL);
  var response = await fetch(tflURL);
  var timeTable = await response.json();
  var nowInSecs = Math.round(new Date().getTime() / 1000);
  var simpleTimeTable = timeTable.map(t => {
    return {line: t.lineName, timeAtStation: (nowInSecs + t.timeToStation)}
  });
  console.log("time table", simpleTimeTable);
  return {stop: selectedStop, timeTable: simpleTimeTable};
}

function calcActualTimeToStationMinutes(timeAtStation) {
  var nowInSecs = Math.round(new Date().getTime() / 1000);
  return Math.round((timeAtStation - nowInSecs) / 60);
}

function calcActualTimeToStationMinutesStr(mins) {
  var minsStr = mins + " mins";
  if (mins <= 0) {
    minsStr = "due";
  } 
  return minsStr;
}

function updateTimeTable() {
  if (timeTableItems) {
    timeTableItems.forEach((t, i) => {
      var el = document.getElementById('tti_' + i);
      if (el) {
        var mins = calcActualTimeToStationMinutes(t.timeAtStation);
        var minStr = calcActualTimeToStationMinutesStr(mins);  
        el.innerText = minStr;
        if (mins < 0) {
          el.style.color = "#FF0000";
        }
      }
    });
  }
  setTimeout(updateTimeTable, 1000);
}

function showReloadButtonVisibility(visible) {
  setElementVisibility("reloadButton", visible);
}

function setReloadingImgVisibility(visible) {
  setElementVisibility("reloadingImg", visible);
}

function toggleIdleTimerState() {
  idleTimerState = !idleTimerState;
  runjs.setIdleTimerState(idleTimerState);
  var el = document.getElementById("screenLockOffOnImg");
  if (el) {
    if (idleTimerState) {
      el.style.opacity = 1.0;
    } else {
      el.style.opacity = 0.5;
    }
  }    
}

function setElementVisibility(id, visible) {
  var el = document.getElementById(id);
  if (el) {
    el.style.display = visible ? "block" : "none";
  }    
}

async function displayTimeTable(timeTableDataPromise) {
  var stopInfo = await timeTableDataPromise;
  var times = stopInfo.timeTable;
  timeTableItems = times;
  times.sort((a,b) => a.timeAtStation - b.timeAtStation);		
  var output = "";
  output += "<div class='depb'><span class='left'>" + stopInfo.stop.name + " [" +  stopInfo.stop.letter + "]" + "</span></div>";
  output += "<div class='depb'><span class='right'>To " + stopInfo.stop.towards + "</span></div>";
  times.forEach((t, i) => {
    var mins = calcActualTimeToStationMinutes(t.timeAtStation);
    var minStr = calcActualTimeToStationMinutesStr(mins);
    output += "<div class='depb'><span class='left'>" + t.line + "</span><span id='tti_" + i + "' class='right'>" + minStr + "</span></div>";
  });
  document.getElementById("timeTableDiv").innerHTML=output;
  showReloadButtonVisibility(true);
  setReloadingImgVisibility(false);
  setTimeout(updateTimeTable, 1000);
}