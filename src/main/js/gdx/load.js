
System["import"]('gdx').then(function(gdx) {
  window['gdx'] = gdx["default"]
}, function(err) {
  console.log(err)
})
