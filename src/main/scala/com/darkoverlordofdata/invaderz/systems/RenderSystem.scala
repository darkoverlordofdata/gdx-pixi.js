package com.darkoverlordofdata.invaderz.systems

import com.darkoverlordofdata.entitas._
import com.darkoverlordofdata.invaderz.{Invaderz, Match}
import com.darkoverlordofdata.invaderz.EntityExtensions._
import co.technius.scalajs.pixi.Sprite
import co.technius.scalajs.pixi.Pixi.Texture

class RenderSystem(pool:Pool)
  extends IInitializeSystem with IExecuteSystem {

  lazy val views = pool.getGroup(Match.View)

  lazy val background = new Sprite(Texture.fromImage("images/black.png"))

  override def initialize(): Unit = {

    background.scale.x = Invaderz.width / background.width
    background.scale.y = Invaderz.height / background.height
    Invaderz.stage.addChild(background)
  }

  override def execute(): Unit = {
    Invaderz.renderer.render(Invaderz.stage)
  }


  views.onEntityAdded += {e: GroupChangedArgs =>
    Invaderz.stage.addChild(e.entity.view.sprite)
  }

}
