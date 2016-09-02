System.register("uwsoft/editor/renderer/Engine", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Engine;
    return {
        setters:[],
        execute: function() {
            class Engine {
                update(delta) {
                }
            }
            exports_1("default", Engine);
        }
    }
});
System.register("uwsoft/editor/renderer/SceneLoader", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var SceneLoader;
    return {
        setters:[],
        execute: function() {
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
            exports_2("default", SceneLoader);
        }
    }
});
//import Gdx from  'gdx/Gdx'
System.register("uwsoft/editor/renderer/resources/ResourceManager", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var File, scenesPath, particleEffectsPath, spriteAnimationsPath, spriterAnimationsPath, spineAnimationsPath, fontsPath, shadersPath, ResourceManager;
    return {
        setters:[],
        execute: function() {
            File = { separator: '/' };
            scenesPath = "scenes";
            particleEffectsPath = "particles";
            spriteAnimationsPath = "sprite_animations";
            spriterAnimationsPath = "spriter_animations";
            spineAnimationsPath = "spine_animations";
            fontsPath = "freetypefonts";
            shadersPath = "shaders";
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
                    //     preparedSceneNames.push(name)
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
            exports_3("default", ResourceManager);
        }
    }
});
System.register("uwsoft/editor/renderer/scene2d/ButtonClickListener", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var ButtonClickListener;
    return {
        setters:[],
        execute: function() {
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
            exports_4("default", ButtonClickListener);
        }
    }
});
System.register("uwsoft/editor/renderer/scene2d/CompositeActor", ["uwsoft/editor/renderer/scene2d/ButtonClickListener"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var ButtonClickListener_1;
    var BuiltItemHandler, CompositeActor;
    return {
        setters:[
            function (ButtonClickListener_1_1) {
                ButtonClickListener_1 = ButtonClickListener_1_1;
            }],
        execute: function() {
            BuiltItemHandler = {
                DEFAULT: {
                    onItemBuild(item) {
                        if (item instanceof CompositeActor) {
                            let data = item.getUserObject();
                            if (data !== null && data.tags !== null && data.tags.indexOf("button") !== -1)
                                item.addListener(new ButtonClickListener_1.default());
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
            exports_5("default", CompositeActor);
        }
    }
});
System.register("uwsoft", ['editor/renderer/SceneLoader', 'editor/renderer/resources/ResourceManager', 'editor/renderer/scene2d/CompositeActor', 'editor/renderer/scene2d/ButtonClickListener'], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var SceneLoader_1, ResourceManager_1, CompositeActor_1, ButtonClickListener_2;
    var editor;
    return {
        setters:[
            function (SceneLoader_1_1) {
                SceneLoader_1 = SceneLoader_1_1;
            },
            function (ResourceManager_1_1) {
                ResourceManager_1 = ResourceManager_1_1;
            },
            function (CompositeActor_1_1) {
                CompositeActor_1 = CompositeActor_1_1;
            },
            function (ButtonClickListener_2_1) {
                ButtonClickListener_2 = ButtonClickListener_2_1;
            }],
        execute: function() {
            class editor {
            }
            exports_6("default", editor);
            editor.renderer = {
                SceneLoader: SceneLoader_1.default,
                commons: {},
                components: {},
                data: {},
                factory: {},
                physics: {},
                resources: {
                    ResourceManager: ResourceManager_1.default
                },
                scene2d: {
                    CompositeActor: CompositeActor_1.default,
                    ButtonClickListener: ButtonClickListener_2.default
                },
                scripts: {},
                systems: {},
                utils: {}
            };
        }
    }
});
System["import"]('uwsoft').then(function (uwsoft) {
    window['uwsoft'] = uwsoft["default"];
}, function (err) {
    console.log(err);
});
