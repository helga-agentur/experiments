import * as THREE from '../../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../../node_modules/three/examples/jsm/loaders/RGBELoader';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import * as BufferGeometryUtils from '../../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js'
import { DRACOLoader } from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Metal textures are only somewhat bright if we're in an environment
const renderer = new THREE.WebGLRenderer({ antialias: true });

const pmremGenerator = new THREE.PMREMGenerator(renderer);
new RGBELoader().load('./model/moon_1k.hdr', (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    // scene.background = envMap;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
});
pmremGenerator.compileEquirectangularShader();




let model;
// const loader = new DRACOLoader();
// loader.setDecoderPath('./js/draco/');
// loader.preload();
const loader = new GLTFLoader();
loader.load(
    './model/MIDOS_complete.glb',
    // './model/MIDOS_complete-small-gltf.insimo.com.glb',
    (gltf) => {
        model = gltf.scene;
        model.traverse((object) => {
            console.log(object);
            if (object.isMesh) {
                object.castShadow = true;
                // object.receiveShadow = true;
                object.material.flatShading = false;

                object.geometry.computeVertexNormals();

                // object.material.metalness = 1;
            }
        });
        console.log('model %o', model);
        scene.add(model);
        // loaded();
    },
    (xhr) => console.log(xhr.loaded / xhr.total),
    console.error,
);


const ambient = new THREE.AmbientLight(0xffe4b5, 0);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0);
scene.add(hemi);

const spotlightTarget = new THREE.Object3D(0, 0, 0);
scene.add(spotlightTarget);

const spotlight = new THREE.SpotLight(0xffe4b5, 0);
spotlight.penumbra = 0.5;
// spotlight.castShadow = true;
spotlight.position.set(0, 5, 0);
spotlight.distance = 7;
spotlight.target = spotlightTarget;
spotlight.shadow.mapSize.width = 2048;
spotlight.shadow.mapSize.height = 2048;
spotlight.shadow.radius = 20;
spotlight.shadow.bias = -0.0001;
spotlight.shadow.blurSamples = 50;
// spotlight.shadow.camera.near = 1;
// spotlight.shadow.camera.far = 7;
// spotlight.shadow.camera.fov = 45;

scene.add(spotlight);
const helper = new THREE.CameraHelper(spotlight.shadow.camera);
// scene.add(helper);

// const toplight = new THREE.SpotLight(0xffffff, 5, 5, 0.5);
// toplight.position.set(0, 10, 0);
// toplight.target = spotlightTarget;
// spotlight.castShadow = true;
// scene.add(toplight);
const highlight = new THREE.SpotLight(0xffe4b5, 10);
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
// scene.add(highlightHelper);



// We need a plane to see the shadow
const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const planeMaterial = new THREE.ShadowMaterial();
planeMaterial.opacity = 0.2;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(Math.PI / -2);
plane.receiveShadow = true;
scene.add(plane);



const directional = new THREE.DirectionalLight(0xffe4b5, 0.3);
directional.position.set(0, 5, 0);
directional.castShadow = true;
directional.shadow.radius = 30;
directional.shadow.blurSamples = 50;
directional.shadow.mapSize.width = 2048;
directional.shadow.mapSize.height = 2048;
scene.add(directional);
const directionalHelper = new THREE.DirectionalLightHelper(directional);
// scene.add(directionalHelper);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 3);
const cameraTarget = new THREE.Vector3(0, 0.7, 0);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = cameraTarget;
controls.update();


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.y = 2;
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
// scene.add( sphere );

// const loaded = () => {
//     directional.target = model;
// }


const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    spotlight.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z,
    );
    if (model) {
        // model.rotation.y += 0.01;
    }
};
animate();



// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render()
// }


// https://discourse.threejs.org/t/solved-rotate-camera-to-face-point-on-sphere/1676/4
const { x, y, z } = camera.position
const start = new THREE.Vector3(x, y, z)
console.log('start', start);

const move1 = () => {
    console.log('m1');
    gsap.to(camera.position, {
        x: 3.5,
        y: 1,
        z: 0,
        duration: 3,
        onUpdate: controls.update,
        onComplete: () => setTimeout(move2, 1000),
    });    
    gsap.to(cameraTarget, {
        x: 0,
        y: 0,
        z: 0,
        duration: 3,
    });    
};


const move2 = () => {
    console.log('m2');
    gsap.to(camera.position, {
        x: 0,
        y: 6,
        z: -0.5,
        duration: 1.5,
        onUpdate: controls.update,
        ease: 'power2.in',
        onComplete: move3,
    });
    gsap.to(cameraTarget, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: 'power2.in'
    });    
};

const move3 = () => {
    console.log('m2');
    gsap.to(camera.position, {
        x: -2,
        y: 4,
        z: -1,
        duration: 1.5,
        onUpdate: controls.update,
        ease: 'power2.out',
    });
    gsap.to(cameraTarget, {
        x: 0,
        y: 1,
        z: 0,
        duration: 1.5,
        ease: 'power2.out',
    });    
};

// setTimeout(move1, 1000);

