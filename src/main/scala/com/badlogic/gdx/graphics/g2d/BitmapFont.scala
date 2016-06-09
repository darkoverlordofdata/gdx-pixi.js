/*
 * Copyright (c) 2008-2010, Matthias Mann
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following
 * conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided with the distribution. * Neither the name of Matthias Mann nor
 * the names of its contributors may be used to endorse or promote products derived from this software without specific prior
 * written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Renders bitmap fonts. The font consists of 2 files: an image file or {@link TextureRegion} containing the glyphs and a file in
  * the AngleCode BMFont text format that describes where each glyph is on the image.
  * <p>
  * Text is drawn using a {@link Batch}. Text can be cached in a {@link BitmapFontCache} for faster rendering of static text, which
  * saves needing to compute the location of each glyph each frame.
  * <p>
  * * The texture for a BitmapFont loaded from a file is managed. {@link #dispose()} must be called to free the texture when no
  * longer needed. A BitmapFont loaded using a {@link TextureRegion} is managed if the region's texture is managed. Disposing the
  * BitmapFont disposes the region's texture, which may not be desirable if the texture is still being used elsewhere.
  * <p>
  * The code was originally based on Matthias Mann's TWL BitmapFont class. Thanks for sharing, Matthias! :)
  * @author Nathan Sweet
  * @author Matthias Mann */
@JSName("gdx.graphics.g2d.BitmapFont")
@js.native
class BitmapFont extends js.Object {
  /** Creates a BitmapFont with the glyphs relative to the specified region. If the region is null, the glyph textures are loaded
    * from the image file given in the font file. The {@link #dispose()} method will not dispose the region's texture in this
    * case!
    * @param region The texture region containing the glyphs. The glyphs must be relative to the lower left corner (ie, the region
    *           should not be flipped). If the region is null the glyph images are loaded from the image path in the font file.
    * @param flip If true, the glyphs will be flipped for use with a perspective where 0,0 is the upper left corner. */
  def this(raw: FileHandle, region: TextureRegion, integer:Boolean) = this()

  /** Specifies whether to use integer positions. Default is to use them so filtering doesn't kick in as badly. */
  def setUseIntegerPositions(integer:Boolean): Unit = js.native

  /** Draws text at the specified position.
    * @see BitmapFontCache#addText(CharSequence, float, float) */
  def draw(batch: Batch, str: String, x:Float, y:Float):Unit = js.native
}
