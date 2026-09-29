import * as THREE from 'three';
import { CityBuilder, InteractiveZone } from './CityBuilder';
import { PlayerController } from './PlayerController';

export interface GameSceneCallbacks {
  onZoneChange: (zone: InteractiveZone | null) => void;
}

export class GameScene {
  private container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cityBuilder: CityBuilder;
  public player: PlayerController;

  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private ambientLight: THREE.AmbientLight;

  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();
  private callbacks: GameSceneCallbacks;

  private prevZoneId: string | null = null;

  constructor(container: HTMLElement, callbacks: GameSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene & Atmospheric Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7dd3fc); // default morning/day sky
    this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.012);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 400);

    // 3. Renderer with soft shadow maps and device pixel ratio cap
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    container.appendChild(this.renderer.domElement);

    // 4. Lighting System
    this.hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.7);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    this.dirLight.position.set(40, 60, 30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 160;
    this.dirLight.shadow.camera.left = -60;
    this.dirLight.shadow.camera.right = 60;
    this.dirLight.shadow.camera.top = 60;
    this.dirLight.shadow.camera.bottom = -60;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // 5. Build Procedural City
    this.cityBuilder = new CityBuilder(this.scene);
    this.cityBuilder.buildCity();

    // 6. Spawn Player Controller at Apartment entrance courtyard
    this.player = new PlayerController(this.camera, [-28, 0, -16]);
    this.scene.add(this.player.mesh);
    this.player.setColliders(this.cityBuilder.collisionBoxes);
    this.player.setInteractiveZones(this.cityBuilder.interactiveZones);

    // 7. Event Listeners
    this.setupListeners();

    // Start loop
    this.start();
  }

  private setupListeners() {
    window.addEventListener('resize', this.onWindowResize);

    // Pointer Drag for Camera Rotation
    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Rotate camera with right click or middle click or Shift + left click
      if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
        isDragging = true;
        prevMouseX = e.clientX;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        this.player.rotateCamera(deltaX);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    // Clean WebGL context recovery
    dom.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
    });
    dom.addEventListener('webglcontextrestored', () => {
      this.start();
    });
  }

  public updateTimeOfDay(hour: number) {
    // Hour range: 8 (morning) to 23 (night)
    const isNight = hour >= 20 || hour < 6;
    const isDusk = hour >= 17 && hour < 20;
    const isMidday = hour >= 11 && hour < 17;

    let skyColor: THREE.Color;
    let sunColor: THREE.Color;
    let sunIntensity: number;
    let hemiIntensity: number;

    if (isNight) {
      skyColor = new THREE.Color(0x090d16); // Deep midnight blue
      sunColor = new THREE.Color(0x60a5fa); // Soft cool moonlight
      sunIntensity = 0.25;
      hemiIntensity = 0.3;
    } else if (isDusk) {
      skyColor = new THREE.Color(0xd97706); // Warm sunset amber/orange
      sunColor = new THREE.Color(0xf97316);
      sunIntensity = 0.9;
      hemiIntensity = 0.6;
    } else if (isMidday) {
      skyColor = new THREE.Color(0x7dd3fc); // Bright sky cyan/blue
      sunColor = new THREE.Color(0xffedd5);
      sunIntensity = 1.35;
      hemiIntensity = 0.75;
    } else {
      // Morning
      skyColor = new THREE.Color(0x93c5fd);
      sunColor = new THREE.Color(0xfef08a);
      sunIntensity = 1.1;
      hemiIntensity = 0.65;
    }

    this.scene.background = skyColor;
    if (this.scene.fog) {
      this.scene.fog.color = skyColor;
    }

    this.dirLight.color = sunColor;
    this.dirLight.intensity = sunIntensity;
    this.hemiLight.intensity = hemiIntensity;

    // Angle the sun based on hour of day
    const sunAngle = ((hour - 6) / 18) * Math.PI;
    this.dirLight.position.set(Math.cos(sunAngle) * 50, Math.sin(sunAngle) * 45 + 10, 30);

    // Update city streetlights
    this.cityBuilder.updateTimeOfDayLighting(hour);
  }

  public setInput(key: 'forward' | 'backward' | 'left' | 'right' | 'interact', value: boolean) {
    this.player.inputs[key] = value;
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.loop);

    const delta = Math.min(this.clock.getDelta(), 0.1); // clamp delta
    const elapsedTime = this.clock.getElapsedTime();

    // Update Player & Camera
    this.player.update(delta);

    // Update procedural animations in city (fountain spout, glowing beacons, kinetic art)
    this.cityBuilder.updateAnimations(elapsedTime);

    // Notify React layer if active zone changed
    const currentZone = this.player.activeZone;
    const currentId = currentZone ? currentZone.id : null;
    if (currentId !== this.prevZoneId) {
      this.prevZoneId = currentId;
      this.callbacks.onZoneChange(currentZone);
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
