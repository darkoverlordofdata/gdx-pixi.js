# gdx-pixi.js

An alternate js backend for libGDX using pixi.js
Status - poc. [Demo](https://darkoverlordofdata.com/gdx-pixi.js/)

This is not a detailed reimplementation of libGDX. Much of the api is a mock,
with pixi managed behind the scenes to provide a similar experience.

Why? Doesn't libGDX already have the gwt wrapper?
Yes, but it's not compatible with some other options that I need.
And I think that pixijs is better in the browser
Besides, this is fun. 


# Build
Javascript sources in src/main/libgdx and src/main/overlap2d are maintained using vscode. 
Build (Ctrl-Shift-b) uses tsc to 'pile these sources to src/main/resources.
Scala sources in src/main/scala are maintained with IntelliJ and compiled using sbt.


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
}
```

manifest.json:
```
{
  "atlas": {
    "logo":"images/badlogic.png"
  }
}
```



# License
## MIT License
Copyright (c) 2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;
## Apache License
libGDX is licensed under the [Apache 2 License](http://www.apache.org/licenses/LICENSE-2.0.html),
