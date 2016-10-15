package com.darkoverlordofdata.shmupwarz

import com.badlogic.gdx.{JsApplicationConfiguration, JsApplication}
import scala.scalajs.js.JSApp

object BrowserLauncher extends JSApp {

  def main(): Unit = {
      val desktop = true
      val scale = 1//.5f
      val width = 320// desktop?700:(int)(350*scale);
      val height = 480//(int)(480*scale);
      val config = new JsApplicationConfiguration()
      config.height = height
      config.width = width
      new JsApplication(new Shmupwarz(desktop, scale), config)
  }
}
