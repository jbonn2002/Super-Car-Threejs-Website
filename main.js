import './style.css'
import * as THREE from 'three';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { FloatType } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

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
 

  for ( let i = -10; i < 10; i++ ){
    for ( let j = -10; j < 10; j++ ){
      makeHex( 3, tileToPosition( i, j ));
    }
  }


  makeHex( 3, new THREE.Vector2( 0, 0 ));
  let hexagonMesh = new THREE.Mesh(
    hexagonGeometries,
    new THREE.MeshStandardMaterial({
      envMap: envmap,
      flatShading: true
    })
  );
  scene.add( hexagonMesh );


  function tileToPosition( tileX, tileY ){
    return new THREE.Vector2(( tileX + ( tileY % 2 ) * 0.5 ) * 1.77, tileY * 1.535 );
  }



  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene,camera);
  });
})();


let hexagonGeometries = new THREE.BoxGeometry(0,0,0);

function hexGeometry( height, position ){
  let geo = new THREE.CylinderGeometry( 1, 1, height, 6, 1, false );
  geo.translate( position.x, height * 0.5, position.y );

  return geo
}


function makeHex( height, position ){

  let geo = hexGeometry( height, position );
  hexagonGeometries = BufferGeometryUtils.mergeBufferGeometries( [hexagonGeometries, geo] );

}



