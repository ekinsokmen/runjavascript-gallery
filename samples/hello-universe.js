Alert.alert('Hello', 'Universe!',
[
  {text: "Ok", onPress: function(){runjs.printHTML("<h2>Use the X below to close!</h2>")}},
  {text: "Close", onPress: function(){runjs.close()}}
]           
)
