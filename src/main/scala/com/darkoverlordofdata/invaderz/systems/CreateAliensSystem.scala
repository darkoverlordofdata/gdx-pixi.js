package com.darkoverlordofdata.invaderz.systems

import com.darkoverlordofdata.entitas._
import com.darkoverlordofdata.invaderz.EntityExtensions._
import com.darkoverlordofdata.invaderz.PoolExtensions._
import com.darkoverlordofdata.invaderz.{Invaderz, Match}

class CreateAliensSystem(pool:Pool)
  extends IInitializeSystem with IExecuteSystem {

  lazy val group = pool.getGroup(Matcher.allOf(Match.Alien))

  val speed = 50f
  val size = 46
  val margin = 148
  var dir = speed
  var row = 0

  override def initialize(): Unit = {
    val xPos = margin
    val yPos = 18
    for (i <- 0 to 3) {
      for (j <- 0 to 6) {
        pool.createAlien(xPos + j * size, yPos + i * size, speed)
      }
    }
  }

  override def execute(): Unit = {
    var changeDir = false
    for (entity <- group.entities) {
      if (entity.position.x < margin || entity.position.x > Invaderz.width-margin) {
        changeDir = true
      }
    }
    if (changeDir) {
      row = 10
      dir = - dir
    }

    for (entity <- group.entities) {
      entity.velocity.x = dir
      entity.position.y += row
    }
    row = 0
  }
}