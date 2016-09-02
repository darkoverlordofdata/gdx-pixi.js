import ButtonClickListener from 'editor/renderer/scene2d/ButtonClickListener'


var BuiltItemHandler = {
    DEFAULT: {
        onItemBuild(item) {
            if(item instanceof CompositeActor) {
                let data = item.getUserObject()
                if (data !== null && data.tags !== null && data.tags.indexOf("button") !== -1)
                    item.addListener(new ButtonClickListener())
            }
        }
    }
}


export default class CompositeActor extends gdx.scenes.scene2d.Actor {
    constructor(vo, ir) {
        super()
        this.layerMap = {}
        this.itemHandler = BuiltItemHandler.DEFAULT
        this.vo = vo
        this.ir = ir
        this.width = vo.width
        this.height = vo.height
        this.pixelsPerWU = ir.getProjectVO().pixelToWorld
        this.makeLayerMap(vo)
        this.build(vo, itemHandler, true)
    }

    makeLayerMap(vo) {
        this.layerMap = {}
        for (let i = 0; i < vo.composite.layers.length; i++) {
            layerMap[vo.composite.layers[i].layerName] = vo.composite.layers[i]
        }
    }

    build(vo, itemHandler, isRoot) {
        this.buildImages(vo.composite.sImages, itemHandler)
        this.build9PatchImages(vo.composite.sImage9patchs, itemHandler)
        this.buildLabels(vo.composite.sLabels, itemHandler)
        this.buildComposites(vo.composite.sComposites, itemHandler)
        this.processZIndexes()
        this.recalculateSize()

        if (isRoot) {
            this.buildCoreData(this, vo)
            itemHandler.onItemBuild(this)
        }
        
    }

    buildImages(images, itemHandler) {
        for (let i = 0; i < images.length; i++) {
            let image = new Image(this.ir.getTextureRegion(images[i].imageName))
        }
    }

    build9PatchImages(patches, itemHandler) {

    }

    buildLabels(labeles, itemHandler) {

    }

    buildComposites(composites,itemHandler) {

    }

    processZIndexes() {

    }

    recalculateSize() {

    }
}

