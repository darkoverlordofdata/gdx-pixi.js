package com.badlogic.gdx.graphics

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.GL20")
@js.native
object GL20 extends js.Object {
  var GL_COLOR_BUFFER_BIT: Int = js.native
  var GL_NEAREST: Int = js.native
  var GL_LINEAR: Int = js.native
  var GL_NEAREST_MIPMAP_NEAREST: Int = js.native
  var GL_LINEAR_MIPMAP_NEAREST: Int = js.native
  var GL_NEAREST_MIPMAP_LINEAR: Int = js.native
  var GL_LINEAR_MIPMAP_LINEAR: Int = js.native
}

@JSName("gdx.graphics.GL20")
@js.native
class GL20 extends js.Object {
  def glClearColor(red: Float, green: Float, blue: Float, alpha: Float): Unit = js.native
  def glClear(mask: Int): Unit = js.native
}

