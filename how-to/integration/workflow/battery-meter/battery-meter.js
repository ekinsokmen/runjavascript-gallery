var template=`
<div style="margin-top: 50px;">
<h1 style="position: absolute; margin-left: 45%; margin-top: 7px; font-family: helvetica; font-size: 30px;">##P##%</h1>
<meter value="0.##P##" style="width: 80%;height: 50px; margin: 0px 10% 0px 10%;"></meter>
</div>
`;

runjs.openXCallBackURL(
  'workflow://x-callback-url/run-workflow?name=GetBatteryLevel',
'result'
).then(battery => {
  runjs.printHTML(template.replace(/##P##/g, battery));
});