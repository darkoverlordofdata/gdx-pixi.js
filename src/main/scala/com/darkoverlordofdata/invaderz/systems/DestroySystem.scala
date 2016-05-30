package com.darkoverlordofdata.invaderz.systems

import com.darkoverlordofdata.entitas.Pool
import com.darkoverlordofdata.entitas.Group
import com.darkoverlordofdata.entitas.Entity
import com.darkoverlordofdata.entitas.Matcher
import com.darkoverlordofdata.entitas.TriggerOnEvent
import com.darkoverlordofdata.invaderz.EntityExtensions._
import com.darkoverlordofdata.invaderz.{Invaderz, Match}
import com.darkoverlordofdata.entitas.IExecuteSystem   

class DestroySystem(pool:Pool) extends IExecuteSystem {

  lazy val group = pool.getGroup(Match.Destroy)

  override def execute(): Unit = {
    for (entity <- group.entities) {
      Invaderz.stage.removeChild(entity.view.sprite)
      pool.destroyEntity(entity)
    }
  }
}