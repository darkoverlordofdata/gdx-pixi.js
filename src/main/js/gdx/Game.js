
export default class Game {

    constructor() {
        this.screen = null
    }

    dispose() {
        if (this.screen != null) this.screen.hide()
    }
    pause() {
        if (this.screen != null) this.screen.pause()
    }

    resume() {
        if (this.screen != null) this.screen.resume()
    }

    render() {
        if (this.screen != null) this.screen.render(Gdx.graphics.getDeltaTime())
    }

    resize(width, height) {
        if (this.screen != null) this.screen.resize(width, height)
    }

    /** Sets the current screen. {@link Screen#hide()} is called on any old screen, and {@link Screen#show()} is called on the new
        * screen, if any.
        * @param screen may be {@code null} */
    setScreen(screen) {
        if (this.screen != null) this.screen.hide()
        this.screen = screen
        if (this.screen != null) {
        this.screen.show()
        this.screen.resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight())
        }
    }

    /** @return the currently active {@link Screen}. */
    getScreen() {return this.screen}
}