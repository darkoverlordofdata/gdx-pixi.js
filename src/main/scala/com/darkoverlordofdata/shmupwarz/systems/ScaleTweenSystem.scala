package com.darkoverlordofdata.shmupwarz.systems

import com.badlogic.gdx.Gdx
import com.darkoverlordofdata.entitas.{Matcher, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.{Match, GameScene}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._


class ScaleTweenSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("ScaleTweenSystem")

  lazy val group = pool.getGroup(Matcher.allOf(Match.Scale, Match.Tween))

  override def execute(): Unit = {
    val delta = Gdx.graphics.getDeltaTime

    for (entity <- group.entities) {
      val tween = entity.tween
      val scale = entity.scale
      var x = scale.x
      var y = scale.y
      var active = tween.active

      x += (tween.speed * delta)
      y += (tween.speed * delta)
      if (x > tween.max) {
        x = tween.max
        y = tween.max
        active = false
      } else if (x < tween.min) {
        x = tween.min
        y = tween.min
        active = false
      }

      entity.updateScale(scale.copy(x = x, y = y))
      entity.updateTween(tween.copy(active = active))

      //scale.x = x
      //scale.y = y
      //tween.active = active

    }

  }
}
