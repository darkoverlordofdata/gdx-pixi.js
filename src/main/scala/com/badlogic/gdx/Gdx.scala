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
package com.badlogic.gdx

import com.badlogic.gdx.graphics.GL20

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Environment class holding references to the {@link Application}, {@link Graphics}, {@link Audio}, {@link Files} and
  * {@link Input} instances. The references are held in public static fields which allows static access to all sub systems. Do not
  * use Graphics in a thread that is not the rendering thread.
  * <p>
  * This is normally a design faux pas but in this case is better than the alternatives.
  * @author mzechner */
@JSName("gdx.Gdx")
@js.native
object Gdx extends js.Object {

  val app:JsApplication = js.native
  val graphics: Graphics = js.native
  val audio: Audio = js.native
  val input: Input = js.native
  val files: Files = js.native
  val gl: GL20 = js.native
}

