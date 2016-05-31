# gdx-pixi.js

An alternate js backend for libGDX

A libGDX api in scala.js 
Lets libGDX game written for Android/Desktop work in the browser

Status - just started. It displays the libGDX hello world.

Why? Doesn't libGDX already have the gwt wrapper?
Yes, but it's not compatible with some other options that I need.
And I think that pixijs is better in the browser
Besides, this is fun. And since it's experimental anyway, lets use ES6!


```
package com.darkoverlordofdata.helloworld

import co.technius.scalajs.pixi.Pixi
import co.technius.scalajs.pixi.loaders._
import com.badlogic.gdx.{JsApplicationConfiguration, JsApplication}
import scala.scalajs.js.JSApp

object BrowserLauncher extends JSApp {

  def main(): Unit = {
    Pixi.loader
      .add("images/badlogic.jpg")
      .load((loader: Loader, res: ResourceDictionary) => {
        val config = new JsApplicationConfiguration()
        config.width = 320
        config.height = 480
        new JsApplication(new Main(), config)
      })
  }
}
```