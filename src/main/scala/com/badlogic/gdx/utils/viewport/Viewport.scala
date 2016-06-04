package com.badlogic.gdx.utils.viewport

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.utils.viewport.Viewport")
@js.native
class Viewport extends js.Object {
  /**
    * apply
    *
    * Calls to the apply method of an object x map to
    * calling x, i.e., x(...) instead of x.apply(...).
    * @see https://www.scala-js.org/doc/interoperability/facade-types.html
    */
  @JSName("applyCamera")
  def apply(): Unit = js.native
  def update(width:Float, height:Float): Unit = js.native
}