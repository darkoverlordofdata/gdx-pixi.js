package com.darkoverlordofdata.shmupwarz.systems

import com.badlogic.gdx.{Input, Gdx, InputProcessor}
import com.darkoverlordofdata.entitas.{IInitializeSystem, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.{Match, GameScene}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._
import com.darkoverlordofdata.shmupwarz.Factory._

import scala.scalajs.js.annotation.JSExport

/**
  * Created by bruce on 5/13/16.
  */
class PlayerInputSystem (val game:GameScene, val pool:Pool)
  extends IExecuteSystem with IInitializeSystem with InputProcessor {
  println("PlayerInputSystem")

  lazy val group = pool.getGroup(Match.Player)
  val width = game.width
  val height = game.height
  val pixelFactor = game.pixelFactor
  val FireRate = .1f

  private var shoot = false
  private var mouseX = 0
  private var mouseY = 0
  private var timeToFire = 0f


  override def initialize(): Unit = {
    Gdx.input.setInputProcessor(this)
    pool.createPlayer(width.toFloat, height.toFloat)
  }

  override def execute(): Unit = {
    val player = group.singleEntity

    if (player != null) {
      val position = player.position
      player.updatePosition(position.copy(x = mouseX.toFloat, y = mouseY.toFloat))
      //player.position.x = mouseX.toFloat
      //player.position.y = mouseY.toFloat
      if (shoot) {
        timeToFire -= Gdx.graphics.getDeltaTime
        if (timeToFire < 0) {
          pool.createBullet(mouseX - 27f, mouseY - 10f)
          pool.createBullet(mouseX + 27f, mouseY - 10f)
          timeToFire = FireRate
        }
      }
    }
  }


  def moveTo(x: Int, y:Int) = {
    mouseX = x/pixelFactor
    mouseY = height - y/pixelFactor
  }

  def keyTyped(character: Char): Boolean = {
    false
  }

  @JSExport
  def mouseMoved(screenX: Int, screenY: Int): Boolean = {
    moveTo(screenX, screenY)
    false
  }

  @JSExport
  def keyDown(keycode: Int): Boolean = {
    if (Input.Keys.Z == keycode) shoot = true
    true
  }

  @JSExport
  def touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean = {
    shoot = true
    moveTo(screenX, screenY)
    false
  }

  @JSExport
  def keyUp(keycode: Int): Boolean = {
    if (Input.Keys.Z == keycode) shoot = false
    true
  }

  def scrolled(amount: Int): Boolean = {
    false
  }

  @JSExport
  def touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean = {
    shoot = false
    true
  }

  @JSExport
  def touchDragged(screenX: Int, screenY: Int, pointer: Int): Boolean = {
    moveTo(screenX, screenY)
    false
  }
}
