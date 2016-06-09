/*******************************************************************************
  * Copyright 2011 See AUTHORS file.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  ******************************************************************************/
package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.graphics.Texture

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** A Batch is used to draw 2D rectangles that reference a texture (region). The class will batch the drawing commands and optimize
  * them for processing by the GPU.
  * <p>
  * To draw something with a Batch one has to first call the {@link Batch#begin()} method which will setup appropriate render
  * states. When you are done with drawing you have to call {@link Batch#end()} which will actually draw the things you specified.
  * <p>
  * All drawing commands of the Batch operate in screen coordinates. The screen coordinate system has an x-axis pointing to the
  * right, an y-axis pointing upwards and the origin is in the lower left corner of the screen. You can also provide your own
  * transformation and projection matrices if you so wish.
  * <p>
  * A Batch is managed. In case the OpenGL context is lost all OpenGL resources a Batch uses internally get invalidated. A context
  * is lost when a user switches to another application or receives an incoming call on Android. A Batch will be automatically
  * reloaded after the OpenGL context is restored.
  * <p>
  * A Batch is a pretty heavy object so you should only ever have one in your program.
  * <p>
  * A Batch works with OpenGL ES 2.0. It will use its own custom shader to draw all provided
  * sprites. You can set your own custom shader via {@link #setShader(ShaderProgram)}.
  * <p>
  * A Batch has to be disposed if it is no longer used.
  * @author mzechner
  * @author Nathan Sweet */
@JSName("gdx.graphics.g2d.Batch")
@js.native
trait Batch extends js.Object {

  /** Sets up the Batch for drawing. This will disable depth buffer writing. It enables blending and texturing. If you have more
    * texture units enabled than the first one you have to disable them before calling this. Uses a screen coordinate system by
    * default where everything is given in pixels. You can specify your own projection and modelview matrices via
    * {@link #setProjectionMatrix(Matrix4)} and {@link #setTransformMatrix(Matrix4)}. */
  def begin(): Unit = js.native

  /** Draws a rectangle with the bottom left corner at x,y having the width and height of the texture.
    * @param x the x-coordinate in screen space
    * @param y the y-coordinate in screen space */
  def draw(texture: Texture, x: Float, y: Float): Unit = js.native

  /** Draws a rectangle with the bottom left corner at x,y and stretching the region to cover the given width and height. */
  def draw(region: TextureRegion, x: Float, y: Float, width:Float, height:Float): Unit = js.native

  /** Finishes off rendering. Enables depth writes, disables blending and texturing. Must always be called after a call to
    * {@link #begin()} */
  def end(): Unit = js.native

  /** Sets the projection matrix to be used by this Batch. If this is called inside a {@link #begin()}/{@link #end()} block, the
    * current batch is flushed to the gpu. */
  def setProjectionMatrix(projection: Any): Unit = js.native
}
