package com.darkoverlordofdata.shmupwarz.systems

import com.badlogic.gdx.{Input, Gdx, InputProcessor}
import com.darkoverlordofdata.entitas.{IInitializeSystem, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.{Match, GameScene}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._
import com.darkoverlordofdata.shmupwarz.Factory._

import scala.scalajs.js.annotation.JSExport


class PlayerInputProcessor(val parent:PlayerInputSystem) extends InputProcessor {
  def keyDown(keycode: Int): Boolean = parent.keyDown(keycode)
  def keyUp(keycode: Int): Boolean = parent.keyUp(keycode)
  def keyTyped(keycode: Char): Boolean = parent.keyTyped(keycode)
  def touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean = parent.touchDown(screenX, screenY, pointer, button)
  def touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean = parent.touchUp(screenX, screenY, pointer, button)
  def touchDragged(screenX: Int, screenY: Int, pointer: Int): Boolean = parent.touchDragged(screenX, screenY, pointer)
  def mouseMoved(screenX: Int, screenY: Int): Boolean = parent.mouseMoved(screenX, screenY)
  def scrolled(amount: Int): Boolean  = parent.scrolled(amount)

}

/**
  * Created by bruce on 5/13/16.
  */
class PlayerInputSystem (val game:GameScene, val pool:Pool)
  extends IExecuteSystem with IInitializeSystem { 
  println("PlayerInputSystem")

  lazy val group = pool.getGroup(Match.Player)
  val width = game.width
  val height = game.height
  val pixelFactor:Int = { if (Gdx.graphics.getDensity > 1f) 2 else 1 }
  val desktop = game.desktop
  val scale = game.scale
  //val pixelFactor = game.pixelFactor
  val FireRate = .1f

  private var shoot = false
  private var mouseX = 0
  private var mouseY = 0
  private var timeToFire = 0f

  override def initialize(): Unit = {
    //Gdx.input.setInputProcessor(this)
    Gdx.input.setInputProcessor(new PlayerInputProcessor(this))
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
    if (desktop) {
      mouseX = (x.toFloat/scale).toInt
      mouseY = ((height - y).toFloat/scale).toInt
    } else {
      mouseX = x/pixelFactor
      mouseY = (height - y)/pixelFactor
    }
    //mouseX = x/pixelFactor
    //mouseY = height - y/pixelFactor
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
