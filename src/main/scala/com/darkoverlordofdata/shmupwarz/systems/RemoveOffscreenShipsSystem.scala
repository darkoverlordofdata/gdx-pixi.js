package com.darkoverlordofdata.shmupwarz.systems

import com.darkoverlordofdata.entitas.{IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.{Match, GameScene}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._

class RemoveOffscreenShipsSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("RemoveOffscreenShipsSystem")

  lazy val group = pool.getGroup(Match.Position)

  override def execute(): Unit = {

    for (entity <- group.entities) {
      if (entity.isEnemy) {
        if (entity.position.y < 0) {
          pool.destroyEntity(entity)
        }
      }

    }
  }
}
