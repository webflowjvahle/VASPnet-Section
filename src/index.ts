// import { greetUser } from '$utils/greet';

import * as THREE from 'three';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

window.Webflow ||= [];
window.Webflow.push(() => {
  init3D();
});

// Init Function
function init3D() {
  // select the container
  const viewport = document.querySelector('[data-3d="c"]');
  console.log(viewport);

  // create scene
  const scene = new THREE.Scene();

  // create camera
  const camera = new THREE.PerspectiveCamera(
    33.4,
    viewport.clientWidth / viewport.clientHeight,
    0.1,
    1000
  );

  // create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  viewport.appendChild(renderer.domElement);

  window.addEventListener('resize', function () {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // add controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Set the camera's position
  camera.position.set(-52.6214, 14.1942, 4.01969); // Y and Z values are switched, Z is negated

  // Convert rotation from degrees to radians
  const degreesToRadians = Math.PI / 180;
  const rotationX = 90 * degreesToRadians;
  const rotationY = 0.000002 * degreesToRadians;
  const rotationZ = -90 * degreesToRadians;

  // Set the camera's rotation
  camera.rotation.set(rotationX, rotationZ, -rotationY); // Y and Z values are switched, Z is negated

  // add lights
  RectAreaLightUniformsLib.init();

  const width = 30;
  const height = 30;
  const intensity = 5;
  const rectLight1 = new THREE.RectAreaLight(0xffffff, intensity, width, height);
  rectLight1.position.set(30.8558, -4.94707, -11.339);
  rectLight1.rotation.set(
    THREE.MathUtils.degToRad(-80.1165),
    THREE.MathUtils.degToRad(12.6174),
    THREE.MathUtils.degToRad(269.904)
  );

  rectLight1.lookAt(0, -10, -2);

  scene.add(rectLight1);

  // 2nd light

  const width2 = 10;
  const height2 = 10;
  const intensity2 = 15;
  const rectLight2 = new THREE.RectAreaLight(0xffffff, intensity2, width2, height2);
  rectLight2.position.set(24.3479, -4.94707, 7.97078);
  rectLight2.rotation.set(
    THREE.MathUtils.degToRad(-85.1962),
    THREE.MathUtils.degToRad(46.9974),
    THREE.MathUtils.degToRad(269.862)
  );

  rectLight2.lookAt(0, -10, -2);

  scene.add(rectLight2);

  //  3rd light

  const width3 = 10;
  const height3 = 10;
  const intensity3 = 15;
  const rectLight3 = new THREE.RectAreaLight(0xffffff, intensity3, width3, height3);
  rectLight3.position.set(24.5512, 20.6812, 33.0485);
  rectLight3.rotation.set(
    THREE.MathUtils.degToRad(-85.1962),
    THREE.MathUtils.degToRad(46.9974),
    THREE.MathUtils.degToRad(269.862)
  );

  rectLight3.lookAt(20, -10, 2);

  scene.add(rectLight3);

  // const rectLight1Helper = new RectAreaLightHelper(rectLight1);
  // rectLight1.add(rectLight1Helper);

  // const rectLight2Helper = new RectAreaLightHelper(rectLight2);
  // rectLight2.add(rectLight2Helper);

  const rectLight3Helper = new RectAreaLightHelper(rectLight3);
  rectLight3.add(rectLight3Helper);

  // Add Axes Helper

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // animation setup
  const clock = new THREE.Clock();
  const mixer = null;

  const angularSpeed = Math.PI / 4;
  let previousTime = 0;
  const radius = 30.8558;

  function animate() {
    requestAnimationFrame(animate);
    const currentTime = clock.getElapsedTime();
    const deltaTime = currentTime - previousTime;
    previousTime = currentTime;

    // Compute the new angle of the light
    const angle = (Math.PI * (1 + Math.sin(angularSpeed * currentTime))) / 2 - Math.PI / 2;

    // Update the light's position to move in a circular path around the y-axis
    rectLight1.position.x = radius * Math.cos(angle);
    rectLight1.position.z = radius * Math.sin(angle);

    rectLight1.lookAt(0, -10, -2);

    rectLight2.position.x = radius * Math.cos(angle);
    rectLight2.position.z = radius * Math.sin(angle);

    rectLight2.lookAt(0, -10, -2);

    rectLight3.position.x = radius * Math.cos(angle);
    rectLight3.position.z = radius * Math.sin(angle);

    rectLight3.lookAt(-20, 120, 100);

    controls.update();
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  }

  animate();
  // --- load 3d async
  const assets = load();
  assets.then((data) => {
    console.log(data, data.robot);

    data.robot.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial();
        child.material.map = data.texture;
        child.material.metalness = 1;
        child.material.roughness = 0.4;
      }
    });

    data.robot.position.y = -11.5;
    data.robot.position.z = -2;
    data.robot.scale.set(0.9, 0.9, 0.9);
    scene.add(data.robot);
  });
}

/* Loader Functions */
async function load() {
  const robot = await loadModel(
    'https://uploads-ssl.webflow.com/648819b9af1e9b0f389771dc/648819b9af1e9b0f389771bf_VASPdata-HomePage-highlightAnimation-V2.glb.txt'
  );

  const texture = await loadTexture(
    'https://uploads-ssl.webflow.com/648819b9af1e9b0f389771dc/648819b9af1e9b0f389771c1_VASPnet-MainTextureV4.png'
  );

  return { robot, texture };
}

const textureLoader = new TextureLoader();
const modelLoader = new GLTFLoader();

function loadTexture(url) {
  return new Promise((resolve) => {
    textureLoader.load(url, (data) => {
      data.needsUpdate = true;
      data.flipY = false;

      resolve(data);
    });
  });
}

function loadModel(url, id) {
  return new Promise((resolve, reject) => {
    modelLoader.load(url, (gltf) => {
      const result = gltf.scene;
      resolve(result);
    });
  });
}
