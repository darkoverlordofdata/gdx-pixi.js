package com.darkoverlordofdata.invaderz.systems

import com.darkoverlordofdata.entitas._
import com.darkoverlordofdata.invaderz.Invaderz
import com.darkoverlordofdata.invaderz.EntityExtensions._
import com.darkoverlordofdata.invaderz.PoolExtensions._

class InputSystem(pool:Pool)
  extends IExecuteSystem {

  lazy val player = pool.createPlayer()//pool.createEntity("player")
  val FireRate = .2f
  var timeToFire = 0.0f

  override def execute(): Unit = {
    var keypress = false
    val v = player.velocity
    for (key <- Invaderz.keys) {
      key match {
        case (37,true) => {
          keypress = true
          player.velocity.x = -200
        }
        case (39, true) => {
          keypress = true
          player.velocity.x = 200
        }
        case (38, true) => {
          timeToFire -= Invaderz.delta
          if (timeToFire < 0) {
            timeToFire = FireRate
            pool.createBullet(player.position)
          }

        }
        case _ => {
          println(s"$key")
        }
      }
    }
    if (!keypress) {
      if (v.x != 0f) {
        player.velocity.x = 0
      }
    }
  }
}