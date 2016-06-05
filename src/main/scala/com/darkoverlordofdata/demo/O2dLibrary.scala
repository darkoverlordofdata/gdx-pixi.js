package com.darkoverlordofdata.demo

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.{Sprite, TextureAtlas}

object Layer extends Enumeration {
  type Effect = Value
  var BULLET, BATTLE, PLAYER, ENEMY1, ENEMY2, ENEMY3 = Value
}

object Effect extends Enumeration {
  type Effect = Value
  var PEW, ASPLODE, SMALLASPLODE = Value
}


object O2dLibrary {
  val PROJECT = "project.dt"        /** Overlap2D Project data */
  val SCENE = "scenes/MainScene.dt" /** Overlap2D Scene data */
  val ATLAS = "orig/pack.atlas"     /** Overlap2D Packed atlas */

  lazy val sprites: TextureAtlas = {
    val packFile = Gdx.files.internal(ATLAS)
    new TextureAtlas(packFile)
  }

  def getLayer(name: String): Int = {
    name match {
      case "background" => 1
      case "player" => 2
      case "bullet" => 3
      case "bang" => 4
      case "explosion" => 5
      case "enemy1" => 6
      case "enemy2" => 7
      case "enemy3" => 8
      case _ => 0
    }
  }

  def getResource(name:String):String = {
    name match {
      case "background" => "BackdropBlackLittleSparkBlack"
      case "player" => "spaceshipspr"
      case _ => name
    }
  }

  def getSoundEffect(name:String):Int = {

    name match {
      case "bullet" => Effect.PEW.id
      case "bang" => Effect.SMALLASPLODE.id
      case "explosion" => Effect.ASPLODE.id
      case _ => -1
    }
  }

  def getSprite(name:String):Sprite = {
    new Sprite(new Texture(name))
  }

}
