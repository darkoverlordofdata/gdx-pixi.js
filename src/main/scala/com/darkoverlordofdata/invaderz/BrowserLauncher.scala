package com.darkoverlordofdata.invaderz

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
        new JsApplication(new Main(), config)
      })
  }
}
