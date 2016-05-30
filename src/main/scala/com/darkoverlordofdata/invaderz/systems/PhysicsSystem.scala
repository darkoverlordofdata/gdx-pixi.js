package com.darkoverlordofdata.invaderz.systems

import com.darkoverlordofdata.entitas.Pool
import com.darkoverlordofdata.entitas.Group
import com.darkoverlordofdata.entitas.Entity
import com.darkoverlordofdata.entitas.Matcher
import com.darkoverlordofdata.entitas.TriggerOnEvent
import com.darkoverlordofdata.invaderz.{Invaderz, Match}
import com.darkoverlordofdata.entitas.IExecuteSystem
import com.darkoverlordofdata.invaderz.EntityExtensions._

class PhysicsSystem(pool:Pool) extends IExecuteSystem {

  lazy val group = pool.getGroup(Matcher.allOf(Match.Position, Match.Velocity))

  override def execute(): Unit = {
    for (entity <- group.entities) {
      val position = entity.position
      val velocity = entity.velocity
      val view = entity.view

      position.x += velocity.x * Invaderz.delta
      position.y += velocity.y * Invaderz.delta

      view.sprite.x = position.x
      view.sprite.y = position.y
    }
  }
}