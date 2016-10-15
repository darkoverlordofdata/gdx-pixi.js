package com.darkoverlordofdata.shmupwarz.systems

import com.darkoverlordofdata.entitas.{GroupChangedArgs, ISystem, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.{Match, GameScene}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._


class ViewManagerSystem (val game:GameScene, val pool:Pool) extends ISystem {
  println("ViewManagerSystem")

  /**
    * onEntityAdded
    * Fix up the sprite position
    */
  pool.getGroup(Match.Position).onEntityAdded += {it:GroupChangedArgs =>
    val entity = it.entity
    val sprite = entity.view.sprite
    if (sprite != null) {
      if (entity.hasPosition) {
        val pos = entity.position
        sprite.setX(pos.x)
        sprite.setY(pos.y)
      }
    }
  }

  /**
    * onEntityAdded
    * Fix up the sprite color
    */
  pool.getGroup(Match.Tint).onEntityAdded += {it:GroupChangedArgs =>
    val entity = it.entity
    val sprite = entity.view.sprite
    if (entity.hasTint) {
      val tint = entity.tint
      sprite.setColor(tint.r, tint.g, tint.b, tint.a)
    }
  }


  /**
    * onEntityRemoved
    * Reset the sprite color
    */
  pool.getGroup(Match.Tint).onEntityRemoved += {it:GroupChangedArgs =>
    val entity = it.entity
    val sprite = entity.view.sprite
    sprite.setColor(0f, 0f, 0f, 0f)
  }

  /**
    * onEntityAdded
    * Fix up the sprite scale
    */
  pool.getGroup(Match.Scale).onEntityAdded += {it:GroupChangedArgs =>
    val entity = it.entity
    val sprite = entity.view.sprite
    if (entity.hasScale) {
      val scale = entity.scale
      sprite.setScale(scale.x, scale.y)
    }
  }



}
