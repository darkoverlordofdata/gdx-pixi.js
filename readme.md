# gdx-pixi.js

An alternate js backend for libGDX using pixi.js
Status - poc. [Demo](https://darkoverlordofdata.com/gdx-pixi.js/)

Why? Doesn't libGDX already have the gwt wrapper?
Yes, but it's not compatible with some other options that I need.
And I think that pixijs is better in the browser
Besides, this is fun. 



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
  "atlas": {
    "background":"images/BackdropBlackLittleSparkBlack.png",
    "bang":"images/bang.png",
    "explosion":"images/explosion.png",
    "enemy1":"images/enemy1.png",
    "enemy2":"images/enemy2.png",
    "enemy3":"images/enemy3.png",
    "bullet":"images/bullet.png",
    "player":"images/spaceshipspr.png"
  }
}```