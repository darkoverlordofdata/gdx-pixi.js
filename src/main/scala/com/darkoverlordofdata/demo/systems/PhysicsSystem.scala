package com.darkoverlordofdata.demo.systems

import com.badlogic.gdx.Gdx
import com.darkoverlordofdata.entitas.{Matcher, IExecuteSystem, Pool}
import com.darkoverlordofdata.demo.{Match, GameScene}
import com.darkoverlordofdata.demo.EntityExtensions._


class PhysicsSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("PhysicsSystem")

  lazy val group = pool.getGroup(Matcher.allOf(Match.Position, Match.Velocity))

  override def execute(): Unit = {

    for (entity <- group.entities) {
      val position = entity.position
      entity.updatePosition(position.copy(
        x = position.x + entity.velocity.x * Gdx.graphics.getDeltaTime,
        y = position.y - entity.velocity.y * Gdx.graphics.getDeltaTime
      ))
      //entity.position.x = entity.position.x + entity.velocity.x * Gdx.graphics.getDeltaTime
      //entity.position.y = entity.position.y - entity.velocity.y * Gdx.graphics.getDeltaTime

    }
  }
}
