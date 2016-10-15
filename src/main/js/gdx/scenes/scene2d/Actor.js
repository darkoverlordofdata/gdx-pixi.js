/**
 * @JSName("gdx.scenes.scene2d.Actor")
 */
import Gdx from 'gdx/Gdx'
import Color from 'gdx/graphics/Color'
import Touchable from 'gdx/scenes/scene2d/Touchable'

export default class Actor {

    constructor() {
        this.stage = null
        this.parent = null
        this.listeners = []
        this.actions = []
        this.name = ''
        this.touchable = Touchable.enabled
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        this.originX = 0
        this.originY = 0
        this.scaleX = 1
        this.scaleY = 1
        this.rotation = 0
        this.color = new Color(1, 1, 1, 1)
        this.userObject = null        
    }

    draw(batch, parentAlpha) {}
    act(delta) {
        let actions = this.actions
        if (actions.length > 0) {
            if (this.stage && this.stage.getActionsRequestRendering()) Gdx.graphics.requestRendering()
            for (let i = 0; i < actions.length; i++) {
                let action = actions[i]
                if (action.act(delta) && i < actions.length) {
                    let current = actions[i]
                    let actionIndex = current === action ? i : actions.indexOf(action, true)
                    if (actionIndex !== -1) {
                        actions.removeIndex(actionIndex)
                        action.setActor(null)
                        i--
                    }
                }
            }
        }
    }

    fire(event) {
        
    }


    addListener(listener) {
        if (this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener)
            return true
        }
        return false
    }

    removeListener(listener) {
        return listeners.removeValue(listener)
    }

    getStage() {return this.stage}
    setStage(stage) {this.stage = stage}

    hasParent() {return this.parent != null}
    getParent() {return this.parent}
    setParent(parent) {this.parent = parent}

    isTouchable() {return this.touchable === Touchable.enabled}
    getTouchable() {return this.touchable}
    setTouchable(touchable) {this.touchable = touchable}

    isVisible() {return this.visible}
    setVisible(visible) {this.visible = visible}

    getWidth() {return Math.ceil(this.width)}
    getHeight() {return Math.ceil(this.height)}

    getUserObject() {return this.userObject}
    setUserObject(userObject) {this.userObject = userObject}

    getX(alignment) {return this.x}
    setX(x) {this.x = x}

    getY(alignment) {return this.y}
    setY(y) {this.y = y}

    setPosition(x, y, ) {
		if (this.x !== x || this.y !== y) {
			this.x = x;
			this.y = y;
			this.positionChanged();
		}
    }

    moveBy(x, y) {
		if (x !== 0 || y !== 0) {
			this.x += x
			this.y += y
			positionChanged()
		}
    }

    //getWidth() {return this.width}
    setWidth(width) {
        if (this.width !== width) {
            this.width = width
            this.sizeChanged()
        }
    }

    //getHeight() {return this.height}
    setHeight(height) {
        if (this.height !== height) {
            this.height = height
            this.sizeChanged()
        }
    }

    getTop() {return this.y + this.height}
    getRight() {return this.x + this.width}

    positionChanged() {}
    sizeChanged() {}
    rotationChanged() {}

    setSize(width, height) {
		if (this.width !== width || this.height !== height) {
			this.width = width
			this.height = height
			sizeChanged()
		}
    }

    sizeBy(width, height) {
        if (typeof height === 'undefined') {
            if (width !== 0) {
                this.width += width
                this.height += width
                sizeChanged()
            }
        } else {
            if (width != 0 || height != 0) {
                this.width += width
                this.height += height
                sizeChanged()
            }
        }
    }

    setBounds(x, y, width, height) {
		if (this.x !== x || this.y !== y) {
			this.x = x
			this.y = y
			positionChanged()
		}
		if (this.width !== width || this.height !== height) {
			this.width = width
			this.height = height
			sizeChanged()
		}
    }

    getOriginX() {return this.originX}
    setOriginX(originX) {this.originX = originX}

    getOriginY() {return this.originY}
    setOriginY(originY) {this.originY = originY}
    
    setOrigin(originX, originY) {
		this.originX = originX
		this.originY = originY
    }

    getScaleX() {return this.scaleX}
    setScaleX(scaleX) {this.scaleX = scaleX}

    getScaleY() {return this.scaleY}
    setScaleY(scaleY) {this.scaleY = scaleY}

    setScale(scaleX, scaleY=scaleX) {
        this.scaleX = scaleX
        this.scaleY = scaleY
    }

    scaleBy(scale) {
		this.scaleX += scale
		this.scaleY += scale
    }
    scaleBy(scaleX, scaleY) {
		this.scaleX += scaleX
		this.scaleY += scaleY
    }

    getRotation() {return rotation}
    setRotation(degrees) {
		if (this.rotation !== degrees) {
			this.rotation = degrees
			rotationChanged()
		}
    }
    rotateBy(amountInDegrees) {
		if (amountInDegrees != 0) {
			this.rotation += amountInDegrees
			rotationChanged()
		}
    }

    setColor(color) {this.color.set.apply(this.color, arguments)}
    getColor() {return this.color}

    getName() {return this.name}
    setName(name) {this.name = name}

    toFront() {this.setZIndex(Number.MAX_VALUE)}
    toBack() {this.setZIndex(0)}

    setZIndex(index) {
		if (index < 0) throw new IllegalArgumentException("ZIndex cannot be < 0.")
		let parent = this.parent
		if (parent == null) return
		let children = parent.children
		if (children.length === 1) return
		index = Math.min(index, children.length - 1)
		if (index === children.indexOf(this)) return
        children.splice(index, 0, value)

    }

    getZIndex() {
		let parent = this.parent
		if (parent == null) return -1
		return parent.children.indexOf(this)
    }

}

                
