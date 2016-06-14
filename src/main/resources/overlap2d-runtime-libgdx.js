/**
 * overlap2d-runtime-libgdx.js
 *
 * MIT License
 * Copyright (c) 2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;
 *
 * hacky, hackish overlap2d hacks.
 */
(function (window, document, gdx) {
    "use strict";
    File = { separator: '/' };
    var scenesPath = "scenes";
    var particleEffectsPath = "particles";
    var spriteAnimationsPath = "sprite_animations";
    var spriterAnimationsPath = "spriter_animations";
    var spineAnimationsPath = "spine_animations";
    var fontsPath = "freetypefonts";
    var shadersPath = "shaders";
    var Gdx = gdx.Gdx;
    /**
     * getJSON
     *
     * Load a json resource
     *
     * @see https://mathiasbynens.be/notes/xhr-responsetype-json
     * @param url
     * @returns Promise
     */
    function getJSON(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = () => {
                var status = xhr.status;
                if (status == 200) {
                    resolve(xhr.response);
                }
                else {
                    reject(status);
                }
            };
            xhr.send();
        });
    }
    /**
     * @JSName("uwsoft.editor.renderer.SceneLoader")
     */
    class SceneLoader {
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
    class Engine {
        update(delta) {
        }
    }
    class ButtonClickListener extends gdx.scenes.scene2d.utils.ClickListener {
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
    class ResourceManager {
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
    window.uwsoft = {
        editor: {
            renderer: {
                scene2d: {
                    CompositeActor: CompositeActor
                },
                Engine: Engine,
                SceneLoader: SceneLoader
            }
        }
    };
}(this, this.document, gdx));
