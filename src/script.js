import style from "./style.css"
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { Mesh } from "three";



const gui = new dat.GUI();

const canvas = document.querySelector('canvas.webgl');
const sizes = {
  width: innerWidth, 
  height: innerHeight
};



addEventListener('resize', ()=>{
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const scene = new THREE.Scene();

//Textures
const textureLoader = new THREE.TextureLoader();

const earthColor = textureLoader.load('/galaxy/earth/color.jpg')
const earthHeight = textureLoader.load('/galaxy/earth/height.jpg')
const earthShine = textureLoader.load('/galaxy/earth/shine.png')
const cloudColor2 = textureLoader.load('/galaxy/earth/cloud2.jpg')

const sunColor = textureLoader.load('/galaxy/sun/color.jpg');

const mercuryColor = textureLoader.load('/galaxy/mercury/mercurymap.jpg');
const mercuryHeight = textureLoader.load('/galaxy/mercury/mercurybump.jpg');


const venusColor = textureLoader.load('galaxy/venus/venusmap.jpg');
const venusHeight = textureLoader.load('galaxy/venus/venusbump.jpg');


const marsColor = textureLoader.load('/galaxy/mars/marsmap1k.jpg');
const marsHeight = textureLoader.load('/galaxy/mars/marsbump1k.jpg');


const jupiterColor = textureLoader.load('/galaxy/jupiter/jupitermap.jpg');


const saturnColor = textureLoader.load('/galaxy/saturn/saturnmap.jpg');
const saturnringpattern = textureLoader.load('/galaxy/saturn/saturnringpattern.gif');
const saturnringcolor = textureLoader.load('/galaxy/saturn/saturnringcolor.jpg');


const uranusColor = textureLoader.load('/galaxy/uranus/uranusmap.jpg');
const uranusringpattern = textureLoader.load('/galaxy/uranus/uranusringtrans.gif');
const uranusringcolor = textureLoader.load('/galaxy/uranus/uranusringcolour.jpg');



const neptuneColor = textureLoader.load('/galaxy/neptune/neptunemap.jpg');






const parameters = {
  count: 100000,
  size: 0.01,
  radius: 15,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
}

gui.add(parameters,'count').min(100).max(10000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters,'size').min(0.001).max(0.1).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters,'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters,'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters,'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);

gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy);


/**
 * Galaxy
 */

let geometry = null;
let material = null;
let points = null;

function generateGalaxy(){

  if(points !== null){
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);


  for(let i=0;i<parameters.count;i++){
    const idx = i*3;

    //Positios
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) ;
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) ;
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) ;

    positions[idx] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[idx+1] = randomY;
    positions[idx+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    
    //Color
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameters.radius);

    colors[idx] = mixedColor.r;
    colors[idx+1] = mixedColor.g;
    colors[idx+2] = mixedColor.b;
  
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


  /*
    Material
  */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })


  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);


}

generateGalaxy();



/**
 * PLANETS-------
 */


// SUN
const sun = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1.5,32,32),
  new THREE.MeshStandardMaterial({
    map: sunColor
  })
)



//Mercury
const mercury = new THREE.Mesh(
  new THREE.SphereBufferGeometry(.3, 32,32),
  new THREE.MeshPhongMaterial({
    map: mercuryColor,
    bumpMap: mercuryHeight,
    bumpScale: 0.5
  })
)


//Venus
const venus = new Mesh(
  new THREE.SphereBufferGeometry(0.3,32,32),
  new THREE.MeshPhongMaterial({
    map: venusColor,
    bumpMap: venusHeight,
    bumpScale: 0.5
  })
)



//Earth
const earth = new THREE.Mesh(
  new THREE.SphereBufferGeometry(.3,32,32),
  new THREE.MeshPhongMaterial({
    map: earthColor,
    bumpMap: earthHeight,
    bumpScale: 0.5,
    specularMap: earthShine,
    specular: new THREE.Color('grey')
  })
)

const cloud = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.31, 32,32),
  new THREE.MeshPhongMaterial({
    map: cloudColor2,
    side: THREE.DoubleSide,
    opacity: 0.4,
    transparent : true,
    depthWrite: false,
  })
)
earth.add(cloud);




//Mars
const mars = new Mesh(
  new THREE.SphereBufferGeometry(0.3,32,32),
  new THREE.MeshPhongMaterial({
    map: marsColor,
    bumpMap: marsHeight,
    bumpScale: 0.5
  })
)


//Jupiter
const jupiter = new Mesh(
  new THREE.SphereBufferGeometry(0.5,32,32),
  new THREE.MeshPhongMaterial({
    map: jupiterColor,
    bumpMap: jupiterColor,
    bumpScale: 0.5
  })
)



//Saturn
const saturn = new Mesh(
  new THREE.SphereBufferGeometry(0.5,32,32),
  new THREE.MeshPhongMaterial({
    map: saturnColor,
    bumpMap: saturnColor,
    bumpScale: 0.5
  })
)


const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(0.6,0.8,30,30,0,6.3),
  new THREE.MeshPhongMaterial({ map: saturnringcolor, side: THREE.DoubleSide } )
)
saturnRing.rotation.x = Math.PI - 1;
saturn.add(saturnRing);


//Saturn
const uranus = new Mesh(
  new THREE.SphereBufferGeometry(0.3,32,32),
  new THREE.MeshPhongMaterial({
    map: uranusColor,
    bumpMap: uranusColor,
    bumpScale: 0.5
  })
)


//Neptune
const neptune = new Mesh(
  new THREE.SphereBufferGeometry(0.3,32,32),
  new THREE.MeshPhongMaterial({
    map: neptuneColor,
    bumpMap: neptuneColor,
    bumpScale: 0.5
  })
)

scene.add(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);








/**
 * Light
 */

const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);





/* 
  CAMERA
*/ 


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.y = 4;
camera.position.z = 7;


scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer( {canvas: canvas} );
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 








gui.close();
const clock = new THREE.Clock();


console.time('renderer')

function tick(){
  
  const eplapsedTime = clock.getElapsedTime();

  //sun
  sun.rotation.y = eplapsedTime;  

  //mercury
  mercury.position.x = Math.cos(eplapsedTime * 0.5) * 2;
  mercury.position.z = Math.sin(eplapsedTime * 0.5) * 2;
  
  
  //Venus
  venus.position.x = -Math.cos(eplapsedTime * 0.5) * 3;
  venus.position.z = Math.sin(eplapsedTime * 0.5) * 3;
  
  //earth
  earth.position.x = Math.cos(eplapsedTime * 0.40) * 4;
  earth.position.z = Math.sin(eplapsedTime * 0.40) * 4;

  //mars
  mars.position.x = -Math.cos(eplapsedTime * 0.25) * 5;
  mars.position.z = Math.sin(eplapsedTime * 0.25) * 5;
  
  
  //jupiter
  jupiter.position.x = Math.cos(eplapsedTime * 0.20) * 6;
  jupiter.position.z = Math.sin(eplapsedTime * 0.20) * 6;
  
  
  //Saturn
  saturn.position.x = -Math.cos(eplapsedTime * 0.13) * 8;
  saturn.position.z = Math.sin(eplapsedTime * 0.13) * 8;
  
  
  //uranus
  uranus.position.x = Math.cos(eplapsedTime * 0.10) * 10;
  uranus.position.z = Math.sin(eplapsedTime * 0.10) * 10;
  
  //neptune
  neptune.position.x = Math.cos(eplapsedTime * 0.11) * 12;
  neptune.position.z = -Math.sin(eplapsedTime * 0.11) * 12;


  
  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);

}

tick();