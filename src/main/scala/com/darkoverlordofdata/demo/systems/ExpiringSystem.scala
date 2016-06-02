package com.darkoverlordofdata.demo.systems

import com.badlogic.gdx.Gdx
import com.darkoverlordofdata.demo.{Match, GameScene}
import com.darkoverlordofdata.entitas.{IExecuteSystem, Pool}
import com.darkoverlordofdata.demo.EntityExtensions._


class ExpiringSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("ExpiringSystem")

  lazy val group = pool.getGroup(Match.Expires)

  override def execute(): Unit = {
    val delta = Gdx.graphics.getDeltaTime
    for (entity <- group.entities) {
      val expires = entity.expires
      entity.updateExpires(expires.copy(delay = expires.delay-delta))

      //entity.expires.delay -= delta
      if (entity.expires.delay < 0) {
        pool.destroyEntity(entity)
      }
    }


  }
}
