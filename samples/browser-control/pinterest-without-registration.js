/*
Pinterest without registration
- Opens pinterest categories and removed registration/login panels. 
- Adds two buttons to navigate back and close the page
*/

// Run only in top level frame
if (window.self === window.top) {
  if (!location.host) {
    location.href = "https://www.pinterest.com/categories";
  }

  addNavButtons();

  // hide registration and login panels
  setTimeout(hide, 500);
}

function addNavButtons() {
  var size="48px";
  runjs.printHTML(`
    <div style="position: fixed;bottom: 5px;right: 10px; opacity: 1.0; z-index: 1000000000;">
      <svg id="runjsNavBarBack" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="color: #808080;" viewBox="0 0 24 24" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left-circle">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 8 8 12 12 16"></polyline>
        <line x1="16" y1="12" x2="8" y2="12"></line>
      </svg>
      <svg id="runjsNavBarClose" xmlns="http://www.w3.org/2000/svg" style="color: #808080;" width="${size}" height="${size}" viewBox="0 0 24 24" preserveAspectRatio="none"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>  
    `);

  document.querySelector("#runjsNavBarBack").addEventListener('click', function () {
    window.history.back()
  });
  document.querySelector("#runjsNavBarClose").addEventListener('click', function () {
    runjs.close()
  });
}

function hide() {
  try {
    var el = document.getElementById("PortalParent");
    if (el) {
      el.style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
  setTimeout(hide, 500);
}