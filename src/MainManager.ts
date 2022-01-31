import * as THREE from "three";

export class MainManager {
	doc: Document;

	player: THREE.Mesh;
	world: THREE.Mesh;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	hemiLight: THREE.HemisphereLight;
	renderer: THREE.WebGLRenderer;

	// extra vars
	scroll: number;

	constructor(document: Document) {
		this.doc = document;

		this.init();
	}

	init() {
		this.scene = new THREE.Scene();

		let floorMat = new THREE.MeshStandardMaterial({
			roughness: 0.8,
			color: 0x0a990a,
			metalness: 0.2,
			bumpScale: 0.0005
		});

		let testMat = new THREE.MeshStandardMaterial({
			roughness: 0.8,
			color: 0x0a0a99,
			metalness: 0.2,
			bumpScale: 0.0005
		});

		let worldGeometry = new THREE.SphereGeometry(20, 50, 50);
		this.world = new THREE.Mesh(worldGeometry, floorMat);
		this.world.receiveShadow = true;
		this.world.position.set(0, 0, 0);

		let objGeometry = new THREE.BoxGeometry(5, 5, 5);
		let o1 = new THREE.Mesh(objGeometry, testMat);
		o1.receiveShadow = true;
		o1.castShadow = true;
		o1.position.set(0, 20, 0);
		let o2 = new THREE.Mesh(objGeometry, testMat);
		o2.receiveShadow = true;
		o2.castShadow = true;
		o2.position.set(0, 0, -20);
		let o3 = new THREE.Mesh(objGeometry, testMat);
		o3.receiveShadow = true;
		o3.castShadow = true;
		o3.position.set(0, -20, 0);
		let o4 = new THREE.Mesh(objGeometry, testMat);
		o4.receiveShadow = true;
		o4.castShadow = true;
		o4.position.set(0, 0, 20);

		this.world.add(o1);
		this.world.add(o2);
		this.world.add(o3);
		this.world.add(o4);

		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
		this.camera.position.set(0, 14, 20);

		let canvas = this.doc.getElementById("webgl");
		this.renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.shadowMap.enabled = true;
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.hemiLight = new THREE.HemisphereLight(0xf06553, 0x1f2a4d, 0.2);
		this.scene.add(this.hemiLight);
		this.scene.add(this.camera);
		this.scene.add(this.world);

		let bulbLight = new THREE.SpotLight(0xffffff, 5, 100);
		bulbLight.shadow.mapSize.width = 512;
		bulbLight.shadow.mapSize.height = 512;
		bulbLight.position.set(5, 21, 21);
		bulbLight.castShadow = true;
		this.scene.add(bulbLight);

		window.addEventListener('resize', _ => {
			this.camera.aspect = window.innerWidth / window.innerHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(window.innerWidth, window.innerHeight)
			this.render()
		}, false)

		this.scroll = window.scrollY;
		window.addEventListener('scroll', _ => {
			this.scroll = window.scrollY;
			console.log("scroll: " + this.scroll);
		}, false);
	}

	move(deltaT) {
		// rotate the world based on scroll value;
		// calc percentage scrolled and map it to radians
		let scrollPerc = (this.scroll % window.innerHeight) / window.innerHeight;
		let rad = 2 * Math.PI * scrollPerc;

		console.log(rad);
		this.world.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}
}