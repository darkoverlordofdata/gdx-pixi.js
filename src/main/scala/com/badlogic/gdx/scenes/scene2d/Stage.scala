package com.badlogic.gdx.scenes.scene2d

import com.badlogic.gdx.InputAdapter

trait Stage extends InputAdapter {
  def act(): Unit
  def draw(): Unit

  def getWidth(): Float
  def getHeight(): Float

  def addActor(actor: Actor): Unit
}
