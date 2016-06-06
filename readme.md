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

main.scala
```
package com.darkoverlordofdata.demo

import com.badlogic.gdx.ApplicationAdapter
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch

class Main extends ApplicationAdapter {

  var batch:SpriteBatch = null
  var img:Texture = null

  override def create(): Unit = {
    batch = new SpriteBatch()
    img = new Texture("images/badlogic.jpg")
  }

  override def render(): Unit = {
    Gdx.gl.glClearColor(1, 0, 0, 1)
    Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
    batch.begin()
    batch.draw(img, 0, 0)
    batch.end()

  }

  override def resize(width: Double, height: Double): Unit = {}

  override def dispose(): Unit = {}

  override def pause(): Unit = {}

  override def resume(): Unit = {}
}
```

manifest.json:
```
{
  "atlas": {
    "logo":"images/badlogic.png"
  }
}```