import './style.css'
import * as THREE from 'three';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { FloatType } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color("#CCDDD3");

const camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 0.1, 1000);
// camera.position.set( -17,31,33, );
camera.position.set(0,0,50)


const renderer = new THREE.WebGLRenderer( { antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.useLegacyLights = true;
document.body.appendChild( renderer.domElement )

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 )
controls.dampingFactor = 0.05;
controls.enableDamping = true;

let envmap;


(async function(){
  let pmrem = new THREE.PMREMGenerator(renderer);
  let envmapTexture = await new RGBELoader().setDataType(FloatType).loadAsync("/clarens-night.hdr");
  envmap = pmrem.fromEquirectangular(envmapTexture).texture;
  
  let spehreMesh = new THREE.Mesh(
    new THREE.SphereGeometry( 5, 10, 10 ),
    new THREE.MeshStandardMaterial({ 
      envMap: envmap,
      roughness: 0,
      metalness: 1
    })
  );
  scene.add(spehreMesh);

  renderer.setAnimationLoop(() => {
    renderer.render(scene,camera)
  });
})();

