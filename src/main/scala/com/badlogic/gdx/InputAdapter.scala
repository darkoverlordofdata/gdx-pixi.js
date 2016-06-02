package com.badlogic.gdx

trait InputAdapter extends InputProcessor {
  override def keyDown(keycode: Int): Boolean
  override def keyUp(keycode: Int): Boolean
  override def keyTyped(keycode: Char): Boolean
  override def touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean
  override def touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean
  override def touchDragged(screenX: Int, screenY: Int, pointer: Int): Boolean
  override def mouseMoved(screenX: Int, screenY: Int): Boolean
  override def scrolled(amount: Int): Boolean
}

