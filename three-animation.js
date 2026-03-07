const container = document.getElementById("three-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);

const particles = new THREE.BufferGeometry();
const positions = [];

for(let i=0;i<200;i++){
positions.push(
(Math.random()-0.5)*200,
(Math.random()-0.5)*200,
(Math.random()-0.5)*200
);
}

particles.setAttribute(
"position",
new THREE.Float32BufferAttribute(positions,3)
);

const material = new THREE.PointsMaterial({
color:0x00f5ff,
size:1.5
});

const particleSystem = new THREE.Points(particles,material);
scene.add(particleSystem);

function animate(){
requestAnimationFrame(animate);
particleSystem.rotation.y += 0.001;
renderer.render(scene,camera);
}

animate();

window.addEventListener("resize",()=>{
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);
});