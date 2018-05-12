var props = runjs.getInput().json();
runjs.redirect("working-copy://x-callback-url/read/?x-success=runjavascript://x-callback-url/run?script=&repo=" 
    + encodeURIComponent(props.repo) 
    + "&path=" + encodeURIComponent(props.path) 
    + "&key=" + encodeURIComponent(props.key));