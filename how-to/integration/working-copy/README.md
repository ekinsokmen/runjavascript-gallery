
# Execute a Script Stored in Working Copy
[Working Copy](https://workingcopyapp.com/) is a powerful GIT client for IOS. Working Copy provides x-callback-url scheme to integrate with other apps. The [**run-script-cloned-in-working-copy.js**](https://github.com/ekinsokmen/runjavascript-gallery/blob/master/how-to/integration/working-copy/run-script-cloned-in-working-copy.js) script reads a single JS file cloned in Working Copy and executes it. Copy the script to runjavascript editor and customise the input json:

### Sample Input JSON:
```
{
  "repo": "runjavascript-gallery",
  "path": "samples/hello-world.js",
  "key": "YOUR-KEY"
}
```
