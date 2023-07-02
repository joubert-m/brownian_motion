import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let renderer, scene, camera, points, controls;
let particles = 100000;
const MAX_PARTICLES = 1000000;
const POSITIONS = new Float32Array(MAX_PARTICLES * 3)
const MOVES = [[0, 0, 0], [0, 0, 1], [0, 0, -1], [0, 1, 0], [0, 1, 1], [0, 1, -1], [0, -1, 0], [0, -1, 1], [0, -1, -1], [1, 0, 0], [1, 0, 1], [1, 0, -1], [1, 1, 0], [1, 1, 1], [1, 1, -1], [1, -1, 0], [1, -1, 1], [1, -1, -1], [-1, 0, 0], [-1, 0, 1], [-1, 0, -1], [-1, 1, 0], [-1, 1, 1], [-1, 1, -1], [-1, -1, 0], [-1, -1, 1], [-1, -1, -1]];

const getRandomColor = () => {
	const colorsArray = [0x9D69A3, 0x007DC1, 0x26C21E];
	return colorsArray[Math.floor(Math.random() * colorsArray.length)];
};

const setSliderInfo = (value) => {
	document.getElementById('sliderValue').innerText = `Number of particles: ${value}`;
};

const init = (particles) => {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 0, 1000);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.1;

	setSliderInfo(particles);

	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(particles * 3);
	const colors = new Float32Array(MAX_PARTICLES * 3);

	for (let i = 0; i < MAX_PARTICLES; i++) {
		const color = new THREE.Color(getRandomColor());
		colors[i * 3] = color.r;
		colors[i * 3 + 1] = color.g;
		colors[i * 3 + 2] = color.b;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

	const sprite = new THREE.TextureLoader().load('/disc.png');
	sprite.colorSpace = THREE.SRGBColorSpace;
	const material = new THREE.PointsMaterial({ vertexColors: true, size: 10, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });

	points = new THREE.Points(geometry, material);
	scene.add(points);
};

const updatePositions = () => {
	for (let i = 0; i < MAX_PARTICLES; i++) {
		const pos = MOVES[Math.floor(Math.random() * MOVES.length)];
		const index = i * 3;
		POSITIONS[index + 0] += pos[0];
		POSITIONS[index + 1] += pos[1];
		POSITIONS[index + 2] += pos[2];
	}

	points.geometry.attributes.position.array = POSITIONS;
	points.geometry.attributes.position.needsUpdate = true;
};

const updateNumParticles = (particles) => {
	const positions = new Float32Array(particles * 3);
	points.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
};

const render = () => renderer.render(scene, camera);

const animate = () => {
	requestAnimationFrame(animate);
	controls.update();
	updatePositions();
	render();
};

slider.addEventListener('input', (event) => {
	particles = parseInt(event.target.value);
	setSliderInfo(particles);
	updateNumParticles(particles)
});

init(particles);
animate();
