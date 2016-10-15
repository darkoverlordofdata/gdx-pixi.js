package com.darkoverlordofdata.shmupwarz

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener
import com.badlogic.gdx.scenes.scene2d.{InputEvent, Stage}
import com.badlogic.gdx.utils.viewport.FitViewport
import com.uwsoft.editor.renderer.SceneLoader
import com.uwsoft.editor.renderer.scene2d.CompositeActor

class MenuUI(game: Shmupwarz, sceneLoader: SceneLoader) extends Stage() {

  sceneLoader.loadScene("MenuScene", new FitViewport(320f, 480f))
  val playButtonVo = sceneLoader.loadVoFromLibrary("playButton")
  val playButtonActor = new CompositeActor(playButtonVo, sceneLoader.getRm)
  val pixelFactor = if (Gdx.graphics.getDensity > 1f) 2f else 1f
  println("class MenuUI", getWidth, playButtonActor)

  val col = (getWidth-playButtonActor.getWidth*pixelFactor)/2f
  val row = (pixelFactor-1f)*100f-200f*pixelFactor

  println(s" $col, $row")

  addActor(playButtonActor)
  playButtonActor.setX(col)
  playButtonActor.setY(row+220f*2f*pixelFactor)
  playButtonActor.setScale(pixelFactor)
  /**
  playButtonActor.addListener(new ClickListener() {
    override def clicked(event: InputEvent, x: Float, y: Float) {
      game.playGame()
    }
  })*/

  /**
  val scoreButtonVo  = sceneLoader.loadVoFromLibrary("scoreButton")
  val scoreButtonActor = new CompositeActor(scoreButtonVo, sceneLoader.getRm)
  addActor(scoreButtonActor)
  scoreButtonActor.setX(col)
  scoreButtonActor.setY(row+180f*2f*pixelFactor)
  scoreButtonActor.setScale(pixelFactor)
  scoreButtonActor.addListener(new ClickListener() {
    override def clicked(event: InputEvent, x: Float, y: Float) {
      game.scoreGame()
    }
  })

  val optionButtonVo  = sceneLoader.loadVoFromLibrary("optionButton")
  val optionButtonActor = new CompositeActor(optionButtonVo, sceneLoader.getRm)
  addActor(optionButtonActor)
  optionButtonActor.setX(col)
  optionButtonActor.setY(row+140f*2f*pixelFactor)
  optionButtonActor.setScale(pixelFactor)
  optionButtonActor.addListener(new ClickListener() {
    override def clicked(event: InputEvent, x: Float, y: Float) {
      game.optionsGame()
    }
  })
  */
  
  Gdx.input.setInputProcessor(this)

}

/**
gdx.scenes.scene2d.Actor.js
  gdx.scenes.scene2d.Group.js
    uwsoft.editor.renderer.scene2d.CompositeActor.js


com.badlogic.gdx.InputProcessor.scala
	com.badlogic.gdx.InputAdapter.scala
		com.badlogic.gdx.scenes.scene2d.Stage.scala
			com.darkoverlordofdata.shmupwarz.MenuUI.scala
*/
