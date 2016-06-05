package com.darkoverlordofdata.demo

import com.badlogic.gdx.{Screen, Game}

class Demo extends Game {


  def create(): Unit = {
    setScreen(new GameScene())
  }

}
