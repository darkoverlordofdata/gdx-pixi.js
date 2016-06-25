import Vector3 from 'gdx/math/Vector3'

/*
 * @JSName("gdx.graphics.Camera")
 */
export default class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth
    this.viewportHeight = viewportHeight
    this.position = new Vector3()
  }

  update() {}

}
