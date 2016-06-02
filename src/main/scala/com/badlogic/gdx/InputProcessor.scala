package com.badlogic.gdx

trait InputProcessor {
  def keyDown(keycode: Int): Boolean
  def keyUp(keycode: Int): Boolean
  def keyTyped(keycode: Char): Boolean
  def touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean
  def touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean
  def touchDragged(screenX: Int, screenY: Int, pointer: Int): Boolean
  def mouseMoved(screenX: Int, screenY: Int): Boolean
  def scrolled(amount: Int): Boolean
}

