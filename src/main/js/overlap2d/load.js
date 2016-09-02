
System["import"]('uwsoft').then(function(uwsoft) {
  window['uwsoft'] = uwsoft["default"]
}, function(err) {
  console.log(err)
})
