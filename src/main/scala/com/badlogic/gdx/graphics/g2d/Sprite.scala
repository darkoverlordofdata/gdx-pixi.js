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

/** Holds the geometry, color, and texture information for drawing 2D sprites using {@link Batch}. A Sprite has a position and a
  * size given as width and height. The position is relative to the origin of the coordinate system specified via
  * {@link Batch#begin()} and the respective matrices. A Sprite is always rectangular and its position (x, y) are located in the
  * bottom left corner of that rectangle. A Sprite also has an origin around which rotations and scaling are performed (that is,
  * the origin is not modified by rotation and scaling). The origin is given relative to the bottom left corner of the Sprite, its
  * position.
  * @author mzechner
  * @author Nathan Sweet */
@JSName("gdx.graphics.g2d.Sprite")
@js.native
class Sprite extends TextureRegion {
  /** Creates a sprite with width, height, and texture region equal to the size of the texture. */
  def this(texture:Texture) = this()
  /** Sets the x position where the sprite will be drawn. If origin, rotation, or scale are changed, it is slightly more efficient
    * to set the position after those operations. If both position and size are to be changed, it is better to use
    * {@link #setBounds(float, float, float, float)}. */
  def setX(value:Float): Unit = js.native

  /** Sets the y position where the sprite will be drawn. If origin, rotation, or scale are changed, it is slightly more efficient
    * to set the position after those operations. If both position and size are to be changed, it is better to use
    * {@link #setBounds(float, float, float, float)}. */
  def setY(value:Float): Unit = js.native

  /** Sets the color used to tint this sprite. Default is {@link Color#WHITE}. */
  def setColor(red:Float, green:Float, blue:Float, alpha:Float): Unit = js.native

  /** Sets the sprite's scale for both X and Y uniformly. The sprite scales out from the origin. This will not affect the values
    * returned by {@link #getWidth()} and {@link #getHeight()} */
  def setScale(x:Float, y:Float = ???): Unit = js.native

  /** Sets the position where the sprite will be drawn. If origin, rotation, or scale are changed, it is slightly more efficient
    * to set the position after those operations. If both position and size are to be changed, it is better to use
    * {@link #setBounds(float, float, float, float)}. */
  def setPosition(x:Float, y:Float): Unit = js.native

  def draw(batch:Batch): Unit = js.native

  /** @return the width of the sprite, not accounting for scale. */
  def getWidth(): Int = js.native

  /** @return the height of the sprite, not accounting for scale. */
  def getHeight(): Int = js.native

}
