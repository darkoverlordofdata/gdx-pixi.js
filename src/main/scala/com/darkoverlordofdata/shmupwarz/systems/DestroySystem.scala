package com.darkoverlordofdata.shmupwarz.systems

import com.darkoverlordofdata.shmupwarz.{GameScene, Match}
import com.darkoverlordofdata.entitas.{Matcher, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._

class DestroySystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("DestroySystem")

  lazy val group = pool.getGroup(Match.Destroy)

  override def execute(): Unit = {
    group.entities.map(pool.destroyEntity)
  }
}
