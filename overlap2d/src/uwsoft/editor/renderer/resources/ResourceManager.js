uwsoft.editor.renderer.resources.ResourceManager = (function(){

    var Gdx = gdx.Gdx;
    var File = {separator:'/'};
    var scenesPath = "scenes";
    var particleEffectsPath = "particles";
    var spriteAnimationsPath = "sprite_animations";
    var spriterAnimationsPath = "spriter_animations";
    var spineAnimationsPath = "spine_animations";
    var fontsPath = "freetypefonts";
    var shadersPath = "shaders";

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

}());