var props = runjs.getInput().json();
runjs.redirect("working-copy://x-callback-url/read/?x-success=runjavascript://x-callback-url/run?script=&repo=" 
    + encodeURI(props.repo) 
    + "&path=" + encodeURI(props.path) 
    + "&key=" + encodeURI(props.key));