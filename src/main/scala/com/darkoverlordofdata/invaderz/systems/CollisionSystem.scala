package com.darkoverlordofdata.invaderz.systems

import com.darkoverlordofdata.entitas.Pool
import com.darkoverlordofdata.entitas.Entity
import com.darkoverlordofdata.invaderz.EntityExtensions._
import com.darkoverlordofdata.invaderz.Match
import com.darkoverlordofdata.entitas.IExecuteSystem   

class CollisionSystem(pool:Pool) extends IExecuteSystem {

  lazy val bullets = pool.getGroup(Match.Bullet)
  lazy val aliens = pool.getGroup(Match.Alien)

  override def execute(): Unit = {
    for (bullet <- bullets.entities) {
      for (alien <- aliens.entities) {
        if (collidesWith(bullet, alien)) {
          bullet.setDestroy(true)
          alien.setDestroy(true)
        }
      }
    }
  }

  def collidesWith(e1:Entity, e2:Entity):Boolean = {
    val bounds1 = e1.bounds
    val bounds2 = e2.bounds
    val position1 = e1.position
    val position2 = e2.position

    position1.x < position2.x + bounds2.width &&
      position1.x + bounds1.width > position2.x &&
      position1.y < position2.y + bounds2.height &&
      position1.y + bounds1.height > position2.y
  }

}