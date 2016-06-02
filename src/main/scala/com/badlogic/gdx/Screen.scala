package com.badlogic.gdx

trait Screen {
  def hide(): Unit
  def dispose(): Unit
  def pause(): Unit
  def resize(height: Int, width: Int): Unit
  def show(): Unit
  def resume(): Unit
  def render(time: Float): Unit
}

