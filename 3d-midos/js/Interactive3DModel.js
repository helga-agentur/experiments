import * as THREE from '../../node_modules/three/build/three.module.min.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../../node_modules/three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from '../../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';
import gsap from 'gsap';

export default class {

    #scene;
    #renderer;
    #camera;
    #width;
    #height;

    setup({
        environmentPath,
        modelPath,
        backgroundColor = 0x202020,
        width = window.innerWidth,
        height = window.innerHeight,
    } = {}) {

        const promises = [];

        this.#width = width;
        this.#height = height;

        if (!modelPath) {
            throw new Error(`Parameter modelPath is mandatory, value passed (${modelPath}) is invalid`);
        }
        this.#setupScene(backgroundColor);
        this.#setupRenderer();
        this.#setupCamera();
        this.#setupControls();
        this.setDimensions(width, height);

        // Don't use shadow at the moment
        this.#setupPlane(backgroundColor);
        
        // this.#setupAmbientLight();
        this.#setupSpotlight();
        this.#setupHemisphereLight();
        this.#setupDirectionalLight();

        if (environmentPath) {
            promises.push(this.#loadEnvironment(environmentPath));
        }
        
        promises.push(this.#loadModel(modelPath));
        
        // this.#setupHemisphereLight();        
        // this.#setupHelpers();

        this.#animate();
        return Promise.all(promises);

    }

    getDomElement() {
        return this.#renderer.domElement;
    }

    setDimensions(width, height) {
        // https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
        this.#width = width;
        this.#height = height;
        this.#camera.aspect = this.#width / this.#height;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(this.#width, this.#height);
    }

    setCameraPosition({ x, y, z }) {
        this.#camera.position.set(x, y, z);
        this.#camera.lookAt(0, 0, 0);
    }

    getCameraPosition() {
        const { x, y, z } = this.#camera.position;
        return { x, y, z };
    }

    #setupScene(backgroundColor) {
        this.#scene = new THREE.Scene();
        // this.#scene.background = new THREE.Color(backgroundColor);
    }

    #setupRenderer() {
        this.#renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.#renderer.toneMappingExposure = 1;
        this.#renderer.shadowMap.enabled = true;
        this.#renderer.shadowMap.type = THREE.VSMShadowMap;
        this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    #loadEnvironment(environmentPath) {
        let resolve;
        const promise = new Promise((res) => {
            resolve = res;
        })
        // Metal textures are only somewhat bright if we're in an empty environment
        const pmremGenerator = new THREE.PMREMGenerator(this.#renderer);
        new RGBELoader().load(environmentPath, (texture) => {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            this.#scene.environment = envMap;
            console.log(this.#scene.environment);
            texture.dispose();
            pmremGenerator.dispose();
            resolve();
        });
        pmremGenerator.compileEquirectangularShader();
        return promise;
    }

    #loadModel(modelPath) {
        let resolve;
        const promise = new Promise((res) => {
            resolve = res;
        });
        let model;
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                model = gltf.scene;
                model.traverse((object) => {
                    if (object.isMesh) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                        object.material.flatShading = false;        
                        object.geometry.computeVertexNormals(true);
                        // object.material.transparent = true;
                        // object.material.opacity = 0.2;
                        // See here: https://discourse.threejs.org/t/how-soften-hard-edges/6919
                        // const mergedGeometry = BufferGeometryUtils.mergeVertices(
                        //     object.geometry,
                        //     0.2,
                        // );
                        // mergedGeometry.computeVertexNormals();
                        // object.geometry = mergedGeometry;
                    }
                });
                this.#scene.add(model);
                resolve();
            },
            // (xhr) => console.log(`loading ${Math.round(xhr.loaded / xhr.total * 100)}%`),
            () => {},
            console.error,
        );
        return promise;
    }

    #setupCamera() {
        this.#camera = new THREE.PerspectiveCamera(60, this.#width / this.#height, 0.1, 1000);
        this.#camera.position.set(2, 4, 3);
        const cameraTarget = new THREE.Vector3(0, 1, 0);
        this.#camera.frustrum = 0.1;
        this.#camera.lookAt(cameraTarget);
}

    #setupAmbientLight() {
        const ambient = new THREE.AmbientLight(0xffffff, 1);
        this.#scene.add(ambient);        
    }

    #animate() {
        requestAnimationFrame(this.#animate.bind(this));
        this.#renderer.render(this.#scene, this.#camera);
        // spotlight.position.set(
        //     this.#camera.position.x,
        //     this.#camera.position.y,
        //     this.#camera.position.z,
        // );
    }

    #setupHemisphereLight() {
        const hemi = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.2);
        this.#scene.add(hemi);
    }

    #setupSpotlight() {
        const spotlightTarget = new THREE.Object3D(0, 0, 0);
        const spotlight = new THREE.SpotLight(0xffe4b5, 0.5);
        spotlight.penumbra = 0.5;
        spotlight.castShadow = true;
        spotlight.position.set(0, 5, 0);
        spotlight.distance = 7;
        spotlight.target = spotlightTarget;
        spotlight.shadow.mapSize.width = 2048;
        spotlight.shadow.mapSize.height = 2048;
        spotlight.shadow.radius = 20;
        spotlight.shadow.bias = -0.0001;
        spotlight.shadow.blurSamples = 50;        
        this.#scene.add(spotlightTarget);
        this.#scene.add(spotlight);
    }

    #setupHighlight() {
        const highlight = new THREE.SpotLight(0xffe4b5, 10, 0.2);
        highlight.position.set(2, 4, 0);
        const highlightTarget = new THREE.Object3D(2, 2, 3);
        scene.add(highlightTarget);
        // highlight.target = highlightTarget;
        highlight.target.position.set(0, 0, 0);
        scene.add(highlight.target);
        highlight.distance = 7;
        highlight.angle = 0.07;
        highlight.penumbra = 0.1;
        
        scene.add(highlight);
        const highlightHelper = new THREE.SpotLightHelper(highlight);        
    }


    #setupDirectionalLight() {
        const directional = new THREE.DirectionalLight(0xffe4b5, 0.2);
        directional.position.set(0, 5, 0);
        directional.castShadow = true;
        directional.shadow.radius = 30;
        directional.shadow.blurSamples = 50;
        directional.shadow.mapSize.width = 2048;
        directional.shadow.mapSize.height = 2048;
        this.#scene.add(directional);
        // const directionalHelper = new THREE.DirectionalLightHelper(directional);
        // this.#scene.add(directionalHelper);
    }

    #setupPlane(backgroundColor) {
        // We need a plane to see a shadow on the ground (needs something better than
        // AmbientLight to work)
        const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
        const planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.color.setHex(backgroundColor);
        planeMaterial.opacity = 1;
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotateX(Math.PI / -2);
        plane.receiveShadow = true;
        console.log(plane);
        this.#scene.add(plane);
    }

    #setupHelpers() {
        const gridHelper = new THREE.GridHelper(10, 10);
        this.#scene.add(gridHelper);
        const axesHelper = new THREE.AxesHelper(5);
        this.#scene.add(axesHelper);
    }

    #setupControls() {
        const controls = new OrbitControls(this.#camera, this.getDomElement());
        // Must be identical with the camera's lookAt
        const cameraTarget = new THREE.Vector3(0, 0.7, 0);
        controls.target = cameraTarget;
        controls.update();
    }

}


