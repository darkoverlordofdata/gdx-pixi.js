package com.darkoverlordofdata.demo

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
