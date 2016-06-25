System.register("uwsoft", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var uwsoft;
    return {
        setters:[],
        execute: function() {
            /**
             * uwsoft.js
             *
             * MIT License
             * Copyright (c) 2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;
             *
             * partial implementation. to start, this is just enough for ShmupWarz to
             * run in the browser.
             */
            class uwsoft {
            }
            exports_1("default", uwsoft);
            uwsoft.editor = {
                renderer: {
                    commons: {},
                    components: {},
                    data: {},
                    factory: {},
                    physics: {},
                    resources: {},
                    scene2d: {},
                    scripts: {},
                    systems: {},
                    utils: {}
                }
            };
        }
    }
});
uwsoft.editor.renderer.Engine = (function () {
    return class Engine {
        update(delta) {
        }
    }
    ;
}());
uwsoft.editor.renderer.SceneLoader = (function () {
    /**
     * @JSName("uwsoft.editor.renderer.SceneLoader")
     */
    return class SceneLoader {
        constructor(name, viewport) {
            this.name = '';
            this.viewport = null;
            this.engine = new Engine();
            this.rm = new ResourceManager();
            this.rm.initAllResources();
            this.sceneVO = null;
        }
        loadScene(sceneName, viewport) {
            this.name = name;
            this.viewport = viewport;
            this.sceneVO = this.rm.getSceneVO(sceneName);
            return this.sceneVO;
        }
        getRm() { return this.rm; }
        loadVoFromLibrary(libraryName) {
            let projectInfoVO = this.getRm().getProjectVO();
            let compositeItemVO = projectInfoVO.libraryItems[libraryName];
            return compositeItemVO;
        }
    }
    ;
}());
uwsoft.editor.renderer.resources.ResourceManager = (function () {
    const Gdx = gdx.Gdx;
    const File = { separator: '/' };
    const scenesPath = "scenes";
    const particleEffectsPath = "particles";
    const spriteAnimationsPath = "sprite_animations";
    const spriterAnimationsPath = "spriter_animations";
    const spineAnimationsPath = "spine_animations";
    const fontsPath = "freetypefonts";
    const shadersPath = "shaders";
    return class ResourceManager {
        constructor() {
            this.projectVO = null;
            this.loadedSceneVOs = {};
            this.preparedSceneNames = [];
        }
        initAllResources() {
            this.loadProjectVO();
            for (let i = 0; i < this.projectVO.scenes.length; i++) {
                console.log(`i ${i}`, this.projectVO.scenes[i].sceneName);
                this.loadSceneVO(this.projectVO.scenes[i].sceneName);
                this.scheduleScene(this.projectVO.scenes[i].sceneName);
            }
            this.prepareAssetsToLoad();
            this.loadAssets();
        }
        loadProjectVO() {
            let file = Gdx.files.internal('project.dt');
            this.projectVO = JSON.parse(file.readString());
            return this.projectVO;
        }
        loadSceneVO(sceneName) {
            let file = Gdx.files.internal(scenesPath + File.separator + sceneName + ".dt");
            let sceneVO = JSON.parse(file.readString());
            this.loadedSceneVOs[sceneName] = sceneVO;
            return sceneVO;
        }
        scheduleScene(name) {
            // if (preparedSceneNames.indexOf(name) !== -1) {
            //     preparedSceneNames.push(name);
            // }
        }
        getProjectVO() {
            return this.projectVO;
        }
        getSceneVO(sceneName) {
            return this.loadedSceneVOs[sceneName];
        }
        prepareAssetsToLoad() {
            //gdx.graphics.g2d.TextureAtlas()
        }
        loadAssets() {
            loadAtlasPack();
        }
        loadAtlasPack() {
        }
    }
    ;
}());
uwsoft.editor.renderer.scene2d.CompositeActor = (function () {
    var ButtonClickListener = uwsoft.editor.renderer.scene2d.ButtonClickListener;
    var BuiltItemHandler = {
        DEFAULT: {
            onItemBuild(item) {
                if (item instanceof CompositeActor) {
                    let data = item.getUserObject();
                    if (data !== null && data.tags !== null && data.tags.indexOf("button") !== -1)
                        item.addListener(new ButtonClickListener());
                }
            }
        }
    };
    class CompositeActor extends gdx.scenes.scene2d.Actor {
        constructor(vo, ir) {
            super();
            this.layerMap = {};
            this.itemHandler = BuiltItemHandler.DEFAULT;
            this.vo = vo;
            this.ir = ir;
            this.width = vo.width;
            this.height = vo.height;
            this.pixelsPerWU = ir.getProjectVO().pixelToWorld;
            this.makeLayerMap(vo);
            this.build(vo, itemHandler, true);
        }
        makeLayerMap(vo) {
            this.layerMap = {};
            for (let i = 0; i < vo.composite.layers.length; i++) {
                layerMap[vo.composite.layers[i].layerName] = vo.composite.layers[i];
            }
        }
        build(vo, itemHandler, isRoot) {
            this.buildImages(vo.composite.sImages, itemHandler);
            this.build9PatchImages(vo.composite.sImage9patchs, itemHandler);
            this.buildLabels(vo.composite.sLabels, itemHandler);
            this.buildComposites(vo.composite.sComposites, itemHandler);
            this.processZIndexes();
            this.recalculateSize();
            if (isRoot) {
                this.buildCoreData(this, vo);
                itemHandler.onItemBuild(this);
            }
        }
        buildImages(images, itemHandler) {
            for (let i = 0; i < images.length; i++) {
                let image = new Image(this.ir.getTextureRegion(images[i].imageName));
            }
        }
        build9PatchImages(patches, itemHandler) {
        }
        buildLabels(labeles, itemHandler) {
        }
        buildComposites(composites, itemHandler) {
        }
        processZIndexes() {
        }
        recalculateSize() {
        }
    }
    return CompositeActor;
}());
uwsoft.editor.renderer.scene2d.ButtonClickListener = (function () {
    return class ButtonClickListener extends gdx.scenes.scene2d.utils.ClickListener {
        touchDown(event, x, y, pointer, button) {
            let compositeActor = event.getListenerActor();
            compositeActor.setLayerVisibility("normal", false);
            compositeActor.setLayerVisibility("pressed", true);
            return true;
        }
        touchUp(event, x, y, pointer, button) {
            let compositeActor = event.getListenerActor();
            compositeActor.setLayerVisibility("normal", true);
            compositeActor.setLayerVisibility("pressed", false);
        }
    }
    ;
}());
System["import"]('uwsoft').then(function (uwsoft) {
    window['uwsoft'] = uwsoft["default"];
}, function (err) {
    console.log(err);
});
