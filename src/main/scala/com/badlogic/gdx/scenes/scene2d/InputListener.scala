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
package com.badlogic.gdx.scenes.scene2d

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** EventListener for low-level input events. Unpacks {@link InputEvent}s and calls the appropriate method. By default the methods
  * here do nothing with the event. Users are expected to override the methods they are interested in, like this:
  *
  * <pre>
  * actor.addListener(new InputListener() {
  * 	public boolean touchDown (InputEvent event, float x, float y, int pointer, int button) {
  * 		Gdx.app.log(&quot;Example&quot;, &quot;touch started at (&quot; + x + &quot;, &quot; + y + &quot;)&quot;);
  * 		return false;
  * 	}
  *
  * 	public void touchUp (InputEvent event, float x, float y, int pointer, int button) {
  * 		Gdx.app.log(&quot;Example&quot;, &quot;touch done at (&quot; + x + &quot;, &quot; + y + &quot;)&quot;);
  * 	}
  * });
  * </pre> */
@JSName("gdx.scenes.scene2d.InputListener")
@js.native
class InputListener extends EventListener {

}
