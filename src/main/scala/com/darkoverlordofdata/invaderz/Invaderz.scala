package com.darkoverlordofdata.invaderz

import co.technius.scalajs.pixi.Container
import co.technius.scalajs.pixi.Pixi
import co.technius.scalajs.pixi.loaders.{ResourceDictionary, Loader}
import com.darkoverlordofdata.entitas.{Systems, Pool}
import com.darkoverlordofdata.invaderz.systems._
import org.scalajs.dom.document
import org.scalajs.dom.window
import org.scalajs.dom.KeyboardEvent
import org.scalajs.dom.raw.TouchEvent
import org.scalajs.dom.MouseEvent

object Invaderz {
  var delta = 0.0f
  var previousTime = 0.0f
  var shoot = false
  var mouseX = 0.0f
  var mouseY = 0.0f

  val keys = new scala.collection.mutable.HashMap[Int, Boolean]()
  lazy val width = { window.innerWidth }
  lazy val height = { window.innerHeight }

  lazy val renderer = Pixi.autoDetectRenderer(width, height)
  lazy val stage = new Container

  lazy val pool: Pool = { new Pool(Component.TotalComponents.id) }
  lazy val systems: Systems = { new Systems() }

  def start(): Unit = {
    systems
      .add(pool.createSystem(new RenderSystem(pool)))
      .add(pool.createSystem(new PhysicsSystem(pool)))
      .add(pool.createSystem(new InputSystem(pool)))
      .add(pool.createSystem(new CreateAliensSystem(pool)))
      .add(pool.createSystem(new CollisionSystem(pool)))
      .add(pool.createSystem(new DestroySystem(pool)))

    systems.initialize()
    document.addEventListener("touchstart", onTouchStart, useCapture = true)
    document.addEventListener("touchmove", onTouchMove, useCapture = true)
    document.addEventListener("touchend", onTouchEnd, useCapture = true)
    document.addEventListener("mousedown", onMouseDown, useCapture = true)
    document.addEventListener("mousemove", onMouseMove, useCapture = true)
    document.addEventListener("mouseup", onMouseUp, useCapture = true)
    window.addEventListener("keydown", onKeyDown, useCapture = false)
    window.addEventListener("keyup", onKeyUp, useCapture = false)
  }

  lazy val render: (Double) => Unit = { time =>
    val prev = if (previousTime == 0) time else previousTime
    previousTime = time.toFloat
    delta = ((time - prev) * 0.001).toFloat
    systems.execute()
    window.requestAnimationFrame(render)
  }

  lazy val onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX.toFloat
    mouseY = height - e.clientY.toFloat
  }

  lazy val onMouseUp = (e: MouseEvent) => {
    shoot = false
  }

  lazy val onMouseDown = (e: MouseEvent) => {
    shoot = true
  }

  lazy val onTouchEnd = (e: TouchEvent) => {
    shoot = false
  }

  lazy val onTouchMove = (e: TouchEvent) => {
    mouseX = e.touches.item(0).clientX.toFloat
    mouseY = height - e.touches.item(0).clientY.toFloat
  }

  lazy val onTouchStart = (e: TouchEvent) => {
    shoot = true
    mouseX = e.touches.item(0).clientX.toFloat
    mouseY = height - e.touches.item(0).clientY.toFloat
  }

  lazy val onKeyUp = (e: KeyboardEvent) => {
    keys.remove(e.keyCode)
  }

  lazy val onKeyDown = (e: KeyboardEvent) => {
    keys.put(e.keyCode, true)
  }



}
