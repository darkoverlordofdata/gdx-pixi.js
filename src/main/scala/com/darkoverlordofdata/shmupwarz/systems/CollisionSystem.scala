package com.darkoverlordofdata.shmupwarz.systems

import com.darkoverlordofdata.shmupwarz.{Component, GameScene, Match}
import com.darkoverlordofdata.entitas.{Entity, Pool, IExecuteSystem}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._
import com.darkoverlordofdata.shmupwarz.Factory._


class CollisionSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("CollisionSystem")

  lazy val bullets = pool.getGroup(Match.Bullet)
  lazy val enemies = pool.getGroup(Match.Enemy)
  lazy val players = pool.getGroup(Match.Player)

  override def execute(): Unit = {
    for (bullet <- bullets.entities)
      for (enemy <- enemies.entities)
        if (collidesWith(bullet, enemy))
          collisionHandler(bullet, enemy)

  }

  def collidesWith(e1:Entity, e2:Entity):Boolean = {
    val position1 = e1.position
    val position2 = e2.position
    val a = (position1.x - position2.x).toDouble
    val b = (position1.y - position2.y).toDouble

    (Math.sqrt(a * a + b * b) - e1.bounds.radius) < e2.bounds.radius
  }

  def collisionHandler(weapon:Entity, ship:Entity) {
    val pos = weapon.position
    pool.createSmallExplosion(pos.x, pos.y)
    weapon.setDestroy(true)
    val health = ship.health
    ship.updateHealth(health.copy(currentHealth = health.currentHealth-1))
    if (health.currentHealth <= 0f) {
      val position = ship.position
      pool.createBigExplosion(position.x, position.y)
      ship.setDestroy(true)
      val player = players.singleEntity
      if (player != null) {
        val score = player.score
        player.updateScore(score.copy(value = score.value + health.maximumHealth.toInt))
      }
        //player.score.value += health.maximumHealth.toInt
    }
  }
}
