package com.darkoverlordofdata.demo

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
