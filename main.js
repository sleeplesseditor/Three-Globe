import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Creation of Earth sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('./img/globe.jpg')
            }
        }
    })
);

// Creation of atmosphere sphere
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    })
);

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(sphere);
scene.add(atmosphere)

camera.position.z = 15;

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera);
    sphere.rotation.y += 0.01;
}

animate();
