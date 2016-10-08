package com.darkoverlordofdata.shmupwarz

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.OrthographicCamera
import com.darkoverlordofdata.entitas.Pool
import com.darkoverlordofdata.entitas.Systems
import com.darkoverlordofdata.shmupwarz.systems._

import scala.scalajs.js.annotation.{JSExport, ScalaJSDefined}

class GameScene extends Screen {

  lazy val width:Int = { Gdx.graphics.getWidth }
  lazy val height:Int = { Gdx.graphics.getHeight }
  lazy val pixelFactor:Int = { if (Gdx.graphics.getDensity > 1f) 2 else 1 }
  lazy val camera:OrthographicCamera = { new OrthographicCamera(width.toFloat/pixelFactor, height.toFloat/pixelFactor) }
  lazy val pool:Pool = { new Pool(Component.TotalComponents.id) }
  lazy val spriteRenderSystem:SpriteRenderSystem = { new SpriteRenderSystem(this, pool) }
  lazy val systems:Systems = { createSystems(pool, spriteRenderSystem) }

  systems.initialize()

  def createSystems(pool: Pool, spriteRenderSystem: SpriteRenderSystem): Systems = {
    new Systems()
      .add(pool.createSystem(spriteRenderSystem))
      .add(pool.createSystem(new PhysicsSystem(this, pool)))
      .add(pool.createSystem(new ViewManagerSystem(this, pool)))
      .add(pool.createSystem(new PlayerInputSystem(this, pool)))
      .add(pool.createSystem(new SoundEffectSystem(this, pool)))
      .add(pool.createSystem(new CollisionSystem(this, pool)))
      .add(pool.createSystem(new ExpiringSystem(this, pool)))
      .add(pool.createSystem(new EntitySpawningTimerSystem(this, pool)))
      .add(pool.createSystem(new ScaleTweenSystem(this, pool)))
      .add(pool.createSystem(new RemoveOffscreenShipsSystem(this, pool)))
      .add(pool.createSystem(new HealthRenderSystem(this, pool)))
      .add(pool.createSystem(new ScoreRenderSystem(this, pool)))
      .add(pool.createSystem(new DestroySystem(this, pool)))
  }

  override def hide(): Unit = {}
  override def dispose(): Unit = {}
  override def pause(): Unit = {}
  override def render(delta: Float): Unit = {
    systems.execute()
  }
  override def resize(width: Int, height: Int): Unit = {
    spriteRenderSystem.resize(width, height)
    ()
  }
  override def show(): Unit = {}
  override def resume(): Unit = {}
}
