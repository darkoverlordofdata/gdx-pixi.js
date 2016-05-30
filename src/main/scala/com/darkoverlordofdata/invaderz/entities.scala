package com.darkoverlordofdata.invaderz

import com.darkoverlordofdata.entitas.Pool
import com.darkoverlordofdata.entitas.Entity
import com.darkoverlordofdata.invaderz.EntityExtensions.ExtendEntity
import co.technius.scalajs.pixi.Sprite
import co.technius.scalajs.pixi.Pixi.Texture

object PoolExtensions {

  implicit class ExtendPool(val pool:Pool) {

    def createPlayer(): Entity = {
      val sprite = new Sprite(Texture.fromImage("images/ship.png"))
      sprite.anchor.set(.5, .5)
      sprite.y = Invaderz.height
      sprite.x = Invaderz.width/2
      pool.createEntity("player")
        .addView(sprite)
        .addPosition(sprite.x.toFloat, sprite.y.toFloat)
        .addBounds(sprite.width.toFloat, sprite.height.toFloat)
        .addVelocity(0f, 0f)
        .setPlayer(true)
    }

    def createBullet(position:PositionComponent): Entity = {
      val sprite = new Sprite(Texture.fromImage("images/bullet.png"))
      sprite.anchor.set(.5, .5)
      sprite.x = position.x
      sprite.y = position.y
      pool.createEntity("bullet")
        .addView(sprite)
        .addPosition(sprite.x.toFloat, sprite.y.toFloat)
        .addBounds(sprite.width.toFloat, sprite.height.toFloat)
        .addVelocity(0f, -100f)
        .setBullet(true)
    }

    def createAlien(x:Float, y:Float, speed:Float): Entity = {
      val sprite = new Sprite(Texture.fromImage("images/invader.png"))
      sprite.anchor.set(.5, .5)
      sprite.x = x
      sprite.y = y
      pool.createEntity("invader")
        .addView(sprite)
        .addPosition(sprite.x.toFloat, sprite.y.toFloat)
        .addBounds(sprite.width.toFloat, sprite.height.toFloat)
        .addVelocity(speed, 0f)
        .setAlien(true)
    }
  }
}
