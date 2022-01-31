import { Clock } from "three";
import { MainManager } from "./MainManager";

let gm = new MainManager(document);

let clock = new Clock(true);
function animate() {
	let deltaT = clock.getElapsedTime();

	gm.move(deltaT);
	gm.render();

	requestAnimationFrame(animate);
}

animate();