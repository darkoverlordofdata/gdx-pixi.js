package com.darkoverlordofdata.shmupwarz.systems

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.{OrthographicCamera, GL20}
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.viewport.FillViewport
import com.darkoverlordofdata.entitas.{Entity, GroupChangedArgs, IInitializeSystem, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._
import com.darkoverlordofdata.shmupwarz.Factory._
import com.darkoverlordofdata.shmupwarz.{O2dLibrary, Match, GameScene}

import scala.collection.mutable.ListBuffer

class SpriteRenderSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("SpriteRenderSystem")

  lazy val group = pool.getGroup(Match.View)
  val scale = .8f
  val width = game.width.toFloat
  val height = game.height.toFloat
  val pixelFactor = game.pixelFactor
  lazy val batch = new SpriteBatch()
  val camera = game.camera
  lazy val viewport = new FillViewport(width/pixelFactor, height/pixelFactor, camera)
  lazy val background = O2dLibrary.getSprite("background")

  var sprites = new ListBuffer[Entity]()

  viewport.apply()
  camera.position.set(width/(pixelFactor*2f), height/(pixelFactor*2f), 0f)
  camera.update()

  /**
    * onEntityAdded
    * Maintain sorted list of entities
    */
  group.onEntityAdded += {e: GroupChangedArgs =>
    sprites = (sprites += e.entity).sortBy(-_.layer.ordinal)
  }

  /**
    * onEntityRemoved
    * Remove entity from the list
    */
  group.onEntityRemoved += {e: GroupChangedArgs =>
    //println(s"onEntityRemoved ${e.entity}")
    sprites -= e.entity
  }

  def drawEntity(entity:Entity): Unit = {
    val sprite = entity.view.sprite
    if (sprite != null) {
      if (entity.hasScale)
        sprite.setScale(entity.scale.x * scale, entity.scale.y * scale)
      else
        sprite.setScale(scale)

      val x = sprite.getWidth / 2f
      val y = sprite.getHeight / 2f

      sprite.setPosition(entity.position.x - x, entity.position.y - y)
      sprite.draw(batch)
    }
  }
/**  def drawEntity(entity:Entity): Unit = {
    val sprite = entity.view.sprite
    var scaleX = 1f
    var scaleY = 1f
    if (sprite != null) {
      if (entity.hasScale) {
        scaleX = entity.scale.x
        scaleY = entity.scale.y
        sprite.setScale(scaleX * scale, scaleY * scale)
      } else {
        sprite.setScale(scale)
      }
      val x = sprite.getWidth / 2f * scale * scaleX
      val y = sprite.getHeight / 2f * scale * scaleY

      sprite.setPosition(entity.position.x - x, entity.position.y - y)
      sprite.draw(batch)
    }
  }*/
  
  /**
    * Draw the list
    */
  override def execute(): Unit = {
    Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
    Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
    batch.setProjectionMatrix(camera.combined)
    batch.begin()
    batch.draw(background, 0f, 0f, width, height)
    sprites.foreach(drawEntity)
    batch.end()
  }

  def resize(width: Int, height: Int) = {
    viewport.update(width, height)
    camera.position.set(camera.viewportWidth/2f, camera.viewportHeight/2f, 0f)
  }

}
