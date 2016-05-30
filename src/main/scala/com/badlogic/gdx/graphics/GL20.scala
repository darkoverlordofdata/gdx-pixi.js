package com.badlogic.gdx.graphics

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.GL20")
@js.native
object GL20 extends js.Object {
  var GL_COLOR_BUFFER_BIT: Double = js.native
  var GL_NEAREST: Double = js.native
  var GL_LINEAR: Double = js.native
  var GL_NEAREST_MIPMAP_NEAREST: Double = js.native
  var GL_LINEAR_MIPMAP_NEAREST: Double = js.native
  var GL_NEAREST_MIPMAP_LINEAR: Double = js.native
  var GL_LINEAR_MIPMAP_LINEAR: Double = js.native
}

@JSName("gdx.graphics.GL20")
@js.native
class GL20 extends js.Object {
  def glClearColor(red: Double, green: Double, blue: Double, alpha: Double): Unit = js.native
  def glClear(mask: Double): Unit = js.native
}

