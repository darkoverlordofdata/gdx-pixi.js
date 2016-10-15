package com.darkoverlordofdata.shmupwarz.systems

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.{SpriteBatch, TextureRegion, BitmapFont}
import com.badlogic.gdx.math.MathUtils
import com.darkoverlordofdata.entitas.{Matcher, IExecuteSystem, Pool}
import com.darkoverlordofdata.shmupwarz.{Match, GameScene}
import com.darkoverlordofdata.shmupwarz.EntityExtensions._

class HealthRenderSystem (val game:GameScene, val pool:Pool) extends IExecuteSystem {
  println("HealthRenderSystem")

  lazy val group = pool.getGroup(Matcher.allOf(Match.Position, Match.Health))
  lazy val camera = game.camera
  lazy val batch = new SpriteBatch()
  lazy val font = CreateFont("fonts/normal")

  override def execute(): Unit = {
    batch.setProjectionMatrix(camera.combined)
    batch.begin()
    for (entity <- group.entities) {
      val health = entity.health
      val position = entity.position

      val percentage = MathUtils.round(health.currentHealth/health.maximumHealth*100f).toInt
      font.draw(batch, s"$percentage%", position.x, position.y)
    }
    batch.end()
  }

  def CreateFont(file: String): BitmapFont = {
    val fontTexture = new Texture(Gdx.files.internal(s"${file}_0.png"))
    fontTexture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.MipMapLinearLinear)
    val fontRegion = new TextureRegion(fontTexture)
    val font = new BitmapFont(Gdx.files.internal(s"$file.fnt"), fontRegion, false)
    font.setUseIntegerPositions(false)
    font
  }
}
