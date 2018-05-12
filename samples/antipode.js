/*
 Show the opposite side of the earth on the map.
 
 @HomeScreenIcon("https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg")
*/

function invLong(l) {
  var op=l===0?-1:l/Math.abs(l);
  return (180-Math.abs(l))*-1*op;
}

navigator.geolocation.getCurrentPosition()
 .then(p => runjs.redirect('http://maps.apple.com/?t=h&z=5&ll=' 
                 + (-1 * p.coords.latitude) + ','
                 + invLong(p.coords.longitude)))
 .catch(e => Alert.alert("Error", e.message));
        
                  