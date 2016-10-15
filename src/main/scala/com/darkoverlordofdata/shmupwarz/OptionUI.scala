package com.darkoverlordofdata.shmupwarz

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.scenes.scene2d.{InputEvent, Stage}
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener
import com.badlogic.gdx.utils.viewport.FitViewport
import com.uwsoft.editor.renderer.SceneLoader
import com.uwsoft.editor.renderer.scene2d.CompositeActor

class OptionUI(game: Shmupwarz, sceneLoader: SceneLoader) extends Stage() {
  sceneLoader.loadScene("OptionsScene", new FitViewport(320f, 480f))

  val backButtonVo = sceneLoader.loadVoFromLibrary("backButton")
  val backButtonActor = new CompositeActor(backButtonVo, sceneLoader.getRm)
  val pixelFactor = if (Gdx.graphics.getDensity > 1f) 2f else 1f
  val col = (getWidth-backButtonActor.getWidth*pixelFactor)/2f
  val row = (pixelFactor-1f)*100f-200f*pixelFactor

  addActor(backButtonActor)
  backButtonActor.setX(col)
  backButtonActor.setY(row+110f*2f*pixelFactor)
  backButtonActor.setScale(pixelFactor)
  backButtonActor.addListener(new ClickListener() {
    override def clicked(event: InputEvent, x: Float, y: Float) {
      game.menuGame()
    }
  })

  Gdx.input.setInputProcessor(this)

}
