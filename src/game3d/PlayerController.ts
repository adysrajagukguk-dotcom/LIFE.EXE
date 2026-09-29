import * as THREE from 'three';
import { CollisionBox, InteractiveZone } from './CityBuilder';
import { soundManager } from '../audio/soundManager';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
}

export class PlayerController {
  public mesh: THREE.Group;
  public camera: THREE.PerspectiveCamera;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public rotationY: number = 0;

  // Visual sub-meshes for procedural walk cycle
  private leftLeg: THREE.Mesh;
  private rightLeg: THREE.Mesh;
  private leftArm: THREE.Mesh;
  private rightArm: THREE.Mesh;
  private torso: THREE.Mesh;
  private head: THREE.Group;

  // Controller parameters
  public speed: number = 13.5;
  private walkTime: number = 0;
  private stepTimer: number = 0;
  public isMoving: boolean = false;

  // Camera follow parameters
  public cameraDistance: number = 9.5;
  public cameraHeight: number = 6.2;
  public cameraAngle: number = 0; // horizontal orbit angle offset
  public cameraPitch: number = 0.28; // vertical tilt angle
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3();
  private targetLookAt: THREE.Vector3 = new THREE.Vector3();

  // Inputs & Interaction
  public inputs: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    interact: false,
  };

  public activeZone: InteractiveZone | null = null;
  private collisionBoxes: CollisionBox[] = [];
  private interactiveZones: InteractiveZone[] = [];

  constructor(camera: THREE.PerspectiveCamera, initialPos: [number, number, number] = [-28, 0, -18]) {
    this.camera = camera;
    this.position = new THREE.Vector3(...initialPos);

    // Build stylized player humanoid
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);

    // Colors: Midnight blue jacket, cream pants, stylish backpack
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffe0bd, roughness: 0.6 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }); // Midnight blue
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.7 });
    const backpackMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }); // Amber backpack

    // 1. Torso (Jacket)
    this.torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 0.5), jacketMat);
    this.torso.position.y = 1.35;
    this.torso.castShadow = true;
    this.mesh.add(this.torso);

    // Backpack on back
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.35), backpackMat);
    backpack.position.set(0, 1.35, -0.38);
    backpack.castShadow = true;
    this.mesh.add(backpack);

    // 2. Head & Hair
    this.head = new THREE.Group();
    this.head.position.y = 2.18;

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.52, 0.48), skinMat);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Stylish haircut
    const hairMesh = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.28, 0.54), hairMat);
    hairMesh.position.y = 0.24;
    this.head.add(hairMesh);

    // Headphone band
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 });
    const headphones = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 6, 16, Math.PI), bandMat);
    headphones.rotation.x = Math.PI / 2;
    headphones.position.y = 0.12;
    this.head.add(headphones);

    this.mesh.add(this.head);

    // 3. Left Arm & Right Arm
    const armGeo = new THREE.BoxGeometry(0.24, 0.9, 0.24);
    this.leftArm = new THREE.Mesh(armGeo, jacketMat);
    this.leftArm.position.set(-0.55, 1.35, 0);
    this.leftArm.castShadow = true;
    this.mesh.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, jacketMat);
    this.rightArm.position.set(0.55, 1.35, 0);
    this.rightArm.castShadow = true;
    this.mesh.add(this.rightArm);

    // 4. Legs & Shoes
    const legGeo = new THREE.BoxGeometry(0.3, 0.85, 0.3);
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.24, 0.45, 0);
    this.leftLeg.castShadow = true;

    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.45), shoeMat);
    leftShoe.position.set(0, -0.38, 0.08);
    this.leftLeg.add(leftShoe);
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.24, 0.45, 0);
    this.rightLeg.castShadow = true;

    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.45), shoeMat);
    rightShoe.position.set(0, -0.38, 0.08);
    this.rightLeg.add(rightShoe);
    this.mesh.add(this.rightLeg);

    // Player base shadow circle
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x090d16,
      transparent: true,
      opacity: 0.4,
    });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.65, 16), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    this.mesh.add(shadow);
  }

  public setColliders(colliders: CollisionBox[]) {
    this.collisionBoxes = colliders;
  }

  public setInteractiveZones(zones: InteractiveZone[]) {
    this.interactiveZones = zones;
  }

  public update(delta: number) {
    // 1. Calculate movement vector based on camera direction
    const moveVector = new THREE.Vector3();

    // Camera forward on XZ plane
    const camForward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraAngle);
    const camRight = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraAngle);

    if (this.inputs.forward) moveVector.add(camForward);
    if (this.inputs.backward) moveVector.sub(camForward);
    if (this.inputs.right) moveVector.add(camRight);
    if (this.inputs.left) moveVector.sub(camRight);

    this.isMoving = moveVector.lengthSq() > 0.001;

    if (this.isMoving) {
      moveVector.normalize();

      // Face direction of movement
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      // Smooth rotation angle interpolation
      let diff = targetRotation - this.rotationY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.rotationY += diff * Math.min(1, delta * 14);
      this.mesh.rotation.y = this.rotationY;

      // Apply displacement with collision detection
      const moveDistance = this.speed * delta;
      const nextX = this.position.x + moveVector.x * moveDistance;
      const nextZ = this.position.z + moveVector.z * moveDistance;

      // Check collision on X axis
      if (!this.checkCollision(nextX, this.position.z)) {
        this.position.x = nextX;
      }
      // Check collision on Z axis
      if (!this.checkCollision(this.position.x, nextZ)) {
        this.position.z = nextZ;
      }

      this.mesh.position.copy(this.position);

      // Walk cycle animation
      this.walkTime += delta * 12;
      const legAngle = Math.sin(this.walkTime) * 0.7;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      this.leftArm.rotation.x = -legAngle * 0.8;
      this.rightArm.rotation.x = legAngle * 0.8;

      // Subtle vertical bobbing
      this.torso.position.y = 1.35 + Math.abs(Math.sin(this.walkTime * 2)) * 0.08;
      this.head.position.y = 2.18 + Math.abs(Math.sin(this.walkTime * 2)) * 0.08;

      // Step audio cadence
      this.stepTimer += delta;
      if (this.stepTimer > 0.32) {
        soundManager.playStep();
        this.stepTimer = 0;
      }
    } else {
      // Idle procedural breathing
      this.walkTime += delta * 2.5;
      const idleSway = Math.sin(this.walkTime) * 0.02;

      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = idleSway;
      this.rightArm.rotation.x = -idleSway;
      this.torso.position.y = 1.35 + idleSway * 0.5;
      this.head.position.y = 2.18 + idleSway * 0.6;
    }

    // 2. Smooth Third-Person Camera Follow
    const cameraOffset = new THREE.Vector3(
      Math.sin(this.cameraAngle) * this.cameraDistance,
      this.cameraHeight + Math.sin(this.cameraPitch) * 2,
      Math.cos(this.cameraAngle) * this.cameraDistance
    );

    this.targetCameraPos.copy(this.position).add(cameraOffset);
    // Smooth lerp camera towards target
    this.camera.position.lerp(this.targetCameraPos, Math.min(1, delta * 8));

    this.targetLookAt.copy(this.position).add(new THREE.Vector3(0, 1.8, 0));
    this.camera.lookAt(this.targetLookAt);

    // 3. Interactive Zone check
    this.updateInteractiveZoneCheck();
  }

  private checkCollision(x: number, z: number): boolean {
    const playerRadius = 0.55;
    for (const box of this.collisionBoxes) {
      if (
        x + playerRadius > box.minX &&
        x - playerRadius < box.maxX &&
        z + playerRadius > box.minZ &&
        z - playerRadius < box.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  private updateInteractiveZoneCheck() {
    let nearest: InteractiveZone | null = null;
    let minDistance = Infinity;

    for (const zone of this.interactiveZones) {
      const dist = this.position.distanceTo(zone.position);
      if (dist < zone.radius && dist < minDistance) {
        minDistance = dist;
        nearest = zone;
      }
    }

    this.activeZone = nearest;
  }

  public rotateCamera(deltaX: number) {
    this.cameraAngle -= deltaX * 0.005;
  }

  public teleport(x: number, z: number) {
    this.position.set(x, 0, z);
    this.mesh.position.copy(this.position);
  }
}
