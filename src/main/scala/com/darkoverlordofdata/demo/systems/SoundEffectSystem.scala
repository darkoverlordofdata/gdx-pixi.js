package com.darkoverlordofdata.demo.systems

import com.badlogic.gdx.Gdx
import com.darkoverlordofdata.entitas.{IExecuteSystem, Pool}
import com.darkoverlordofdata.demo.{Match, GameScene}
import com.darkoverlordofdata.demo.EntityExtensions._

class SoundEffectSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("SoundEffectSystem")

  val group = pool.getGroup(Match.SoundEffect)

  lazy val sound = List(
    Gdx.audio.newSound(Gdx.files.internal("sfx/pew.ogg")),
    Gdx.audio.newSound(Gdx.files.internal("sfx/asplode.ogg")),
    Gdx.audio.newSound(Gdx.files.internal("sfx/smallasplode.ogg"))
  )

  override def execute(): Unit = {

    for (entity <- group.entities) {
      if (entity.soundEffect.effect <= sound.size) {
        sound(entity.soundEffect.effect).play()
      }
      entity.removeSoundEffect()

    }
  }
}
