# gdx-pixi.js

An alternate js backend for libGDX

A libGDX api in scala.js 
Lets libGDX game written for Android/Desktop work in the browser

Status - poc. [Demo](https://darkoverlordofdata.com/gdx-pixi.js/)

Why? Doesn't libGDX already have the gwt wrapper?
Yes, but it's not compatible with some other options that I need.
And I think that pixijs is better in the browser
Besides, this is fun. And since it's experimental anyway, lets use ES6!



demo.scala:
```
package com.darkoverlordofdata.helloworld

import com.badlogic.gdx.{JsApplicationConfiguration, JsApplication}
import scala.scalajs.js.JSApp

object BrowserLauncher extends JSApp {

  def main(): Unit = {
    val config = new JsApplicationConfiguration()
    config.width = 320
    config.height = 480
    new JsApplication(new Main(), config)
  }
}
```

manifest.json:
```
{
  "files": [
    "images/badlogic.jpg"
  ]
}
```