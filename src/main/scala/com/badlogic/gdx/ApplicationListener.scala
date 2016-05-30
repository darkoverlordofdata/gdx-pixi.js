package com.badlogic.gdx

trait ApplicationListener {
  def create(): Unit
  def resize(width: Double, height: Double): Unit
  def render(): Unit
  def pause(): Unit
  def resume(): Unit
  def dispose(): Unit

}
