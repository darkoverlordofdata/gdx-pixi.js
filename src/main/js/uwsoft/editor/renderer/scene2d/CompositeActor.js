import ButtonClickListener from 'uwsoft/editor/renderer/scene2d/ButtonClickListener'
import Actor from 'gdx/scenes/scene2d/Actor'
// import NinePatch from 'gdx/graphics/g2d/NinePatch'
// import Image from 'gdx/scenes/scene2d/ui/Image'
// import Label from 'gdx/scenes/scene2d/ui/Label'

const BuiltItemHandler = {
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


export default class CompositeActor extends Actor {
    constructor(vo, ir) {
        super()
        this.scripts = []
        this.indexes = {}
        this.layerMap = {}
        this.itemHandler = BuiltItemHandler.DEFAULT
        this.vo = vo
        this.ir = ir
        this.width = vo.width
        this.height = vo.height
        // this.pixelsPerWU = ir.getProjectVO().pixelToWorld
        // let resolutionEntryVO = ir.getLoadedResolution()
        // this.resMultiplier = resolutionEntryVO.getMultiplier(ir.getProjectVO().originalResolution)
        // this.makeLayerMap(vo)
        // this.build(vo, this.itemHandler, true)
        console.log('CompositeActor.ctor', vo)
    }

    makeLayerMap(vo) {
        this.layerMap = {}
        for (let i = 0; i < vo.composite.layers.length; i++) {
            this.layerMap[vo.composite.layers[i].layerName] = vo.composite.layers[i]
        }
    }

    build(vo, itemHandler, isRoot) {
        console.log('CompositeActor.build', vo)
        this.buildImages(vo.composite.sImages||[], itemHandler)
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

    buildComposites(composites, itemHandler) {
        for (let i=0; i<composites.length; i++) {
            // CompositeActor actor;
            // if(className!=null){
            //     try {
            //         Class<?> c = Class.forName(className);
            //         actor   =   (CompositeActor) c.getConstructors()[0].newInstance(composites.get(i), ir, itemHandler);
            //     }catch (Exception ex){
            //         actor  = new CompositeActor(composites.get(i), ir, itemHandler, false);
            //     }
            // }else {
            //     actor  = new CompositeActor(composites.get(i), ir, itemHandler, false);
            // }
            let actor  = new CompositeActor(composites[i], this.ir, itemHandler, false)

            this.processMain(actor, composites[i])
            this.addActor(actor)

            this.itemHandler.onItemBuild(actor)
            
        }
    }

    buildImages(images, itemHandler) {
        for (let i = 0; i < images.length; i++) {
            let image = new Image(this.ir.getTextureRegion(images[i].imageName))
            this.processMain(image, images[i])
            this.addActor(image)

            itemHandler.onItemBuild(image)
        }
    }

    build9PatchImages(patches, itemHandler) {
        for (let i = 0; i < patches.length; i++) {
            let region = this.ir.getTextureRegion(patches[i].imageName)
            let ninePatch = new NinePatch(region, region.splits[0], region.splits[1], region.splits[2], region.splits[3])
            let image = new Image(ninePatch)
            image.setWidth(patches[i].width*this.pixelsPerWU/this.resMultiplier)
            image.setHeight(patches[i].height * this.pixelsPerWU/this.resMultiplier)
            this.processMain(image, patches[i])
            this.addActor(image)

            itemHandler.onItemBuild(image)

        }
    }

    buildLabels(labels, itemHandler) {
        for (let i = 0; i < labels.length; i++) {
            let style = new Label.LabelStyle(ir.getBitmapFont(labels[i].style, labels[i].size), Color.WHITE)
            let label = new Label(labels[i].text, style)
            label.setAlignment(labels[i].align)
            label.setWidth(labels[i].width * this.pixelsPerWU / this.resMultiplier)
            label.setHeight(labels[i].height * this.pixelsPerWU / this.resMultiplier)
            this.processMain(label, labels[i])
            this.addActor(label)

            itemHandler.onItemBuild(image)
            
        }
    }

    processMain(actor, vo) {

        actor.setName(vo.itemIdentifier)
        buildCoreData(actor, vo)

        actor.setPosition(vo.x * this.pixelsPerWU/this.resMultiplier, vo.y * this.pixelsPerWU/this.resMultiplier)
        actor.setOrigin(vo.originX * this.pixelsPerWU/this.resMultiplier, vo.originY * this.pixelsPerWU/this.resMultiplier)
        actor.setScale(vo.scaleX, vo.scaleY)
        actor.setRotation(vo.rotation)
        actor.setColor(new Color(vo.tint[0], vo.tint[1], vo.tint[2], vo.tint[3]))

        //this.indexes[this.getLayerIndex(vo.layerName) + vo.zIndex, actor)]

        if (this.layerMap[vo.layerName].isVisible) {
            actor.setVisible(true)
        } else {
            actor.setVisible(false)
        }
    }

    buildCoreData(actor, vo) {

        //custom variables
        let cv = null
        if (vo.customVars != null && !vo.customVars.isEmpty()) {
            cv = new CustomVariables()
            cv.loadFromString(vo.customVars)
        }
        
        //core data
        let data = new CoreActorData()
        data.id = vo.itemIdentifier
        data.layerIndex = this.getLayerIndex(vo.layerName)
        data.tags = vo.tags
        data.customVars = cv

        actor.setUserObject(data)
    }

    processZIndexes() {

        let indexArray = Object.keys(indexes)
        indexArray.sort()

        for(let i = 0; i < indexArray.length; i++) {
            indexes[indexArray[i]].setZIndex(i)
        }

    }

    getLayerIndex(name) {
        return vo.composite.layers.indexOf(layerMap[name])
    }

    getItem(id) {
        
    }

    recalculateSize() {

    }
}

