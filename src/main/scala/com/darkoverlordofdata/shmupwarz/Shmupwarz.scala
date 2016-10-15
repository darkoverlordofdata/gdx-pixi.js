package com.darkoverlordofdata.shmupwarz

import com.badlogic.gdx.{Screen, Game}
import com.uwsoft.editor.renderer.SceneLoader

class Shmupwarz(val desktop:Boolean, val scale:Float) extends Game {

  var menuScene: MenuScene = null
  var gameScene: GameScene = null
  var optionScene: MenuScene = null
  var scoreScene: MenuScene = null

  def create(): Unit = {
    //menuGame()
    playGame()
  }

  def menuGame() {
    val sceneLoader = new SceneLoader()
    menuScene = new MenuScene(sceneLoader, new MenuUI(this, sceneLoader))
    optionScene = null
    scoreScene = null
    gameScene = null
    setScreen(menuScene)
  }

  def optionsGame() {
    val sceneLoader = new SceneLoader()
    menuScene = null
    optionScene = new MenuScene(sceneLoader, new OptionUI(this, sceneLoader))
    setScreen(optionScene)
    scoreScene = null
    gameScene = null
  }

  def scoreGame() {
    val sceneLoader = new SceneLoader()
    menuScene = null
    optionScene = null
    scoreScene = new MenuScene(sceneLoader, new ScoreUI(this, sceneLoader))
    setScreen(scoreScene)
    gameScene = null
  }

  def playGame() {
    menuScene = null
    optionScene = null
    scoreScene = null
    gameScene = new GameScene(desktop, scale)
    setScreen(gameScene)
  }


}
