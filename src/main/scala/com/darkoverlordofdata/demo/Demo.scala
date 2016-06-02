package com.darkoverlordofdata.demo

import com.badlogic.gdx.{Screen, Game}

class Demo extends Game {


  def create(): Unit = {
    setScreen(new GameScene())
  }

  def resize(width: Int, height: Int): Unit = {}

  def dispose(): Unit = {}

  def setScreen(screen: Screen): Unit = {}

  def pause(): Unit = {}

  def render(): Unit = {}

  def resume(): Unit = {}

  def getScreen: Screen = null
}
