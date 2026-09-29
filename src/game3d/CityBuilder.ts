import * as THREE from 'three';
import { LOCATIONS, NPCS } from '../data/cityData';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface InteractiveZone {
  id: string;
  type: 'location' | 'npc';
  name: string;
  position: THREE.Vector3;
  radius: number;
  targetId: string;
  markerMesh?: THREE.Group;
}

export class CityBuilder {
  public scene: THREE.Scene;
  public collisionBoxes: CollisionBox[] = [];
  public interactiveZones: InteractiveZone[] = [];
  public streetLights: THREE.PointLight[] = [];
  public animatedMeshes: { mesh: THREE.Object3D; update: (time: number) => void }[] = [];
  public npcMeshes: Map<string, THREE.Group> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public buildCity() {
    this.createGroundAndRoads();
    this.createPlaza();
    this.createApartment();
    this.createUniversity();
    this.createCafe();
    this.createOffice();
    this.createPark();
    this.createCreativeHub();
    this.createStreetFurniture();
    this.createDecorativeTrees();
    this.createBoundaryWalls();
    this.spawnNPCs();
    this.createInteractionBeacons();
  }

  private createGroundAndRoads() {
    // City ground foundation (grass & plaza base)
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x22303c, // deep slate urban tone
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Cross-shaped asphalt roads with sidewalks
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x181f26,
      roughness: 0.8,
      metalness: 0.2,
    });

    // Main East-West road
    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(150, 14), roadMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.y = 0.02;
    roadEW.receiveShadow = true;
    this.scene.add(roadEW);

    // Main North-South road
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(14, 150), roadMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.y = 0.02;
    roadNS.receiveShadow = true;
    this.scene.add(roadNS);

    // Sidewalks flanking the roads
    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x3d4b58,
      roughness: 0.7,
      metalness: 0.1,
    });

    const createSidewalk = (w: number, d: number, x: number, z: number) => {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, d), sidewalkMat);
      sw.position.set(x, 0.075, z);
      sw.receiveShadow = true;
      this.scene.add(sw);
    };

    // Four sidewalk corner quadrants around the central road intersection
    createSidewalk(65, 65, -40, -40);
    createSidewalk(65, 65, 40, -40);
    createSidewalk(65, 65, -40, 40);
    createSidewalk(65, 65, 40, 40);

    // Road markings (dashed white centerlines)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -60; i <= 60; i += 8) {
      if (Math.abs(i) < 14) continue; // skip central intersection
      // EW dashed lines
      const dashEW = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.4), lineMat);
      dashEW.rotation.x = -Math.PI / 2;
      dashEW.position.set(i, 0.03, 0);
      this.scene.add(dashEW);

      // NS dashed lines
      const dashNS = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 4), lineMat);
      dashNS.rotation.x = -Math.PI / 2;
      dashNS.position.set(0, 0.03, i);
      this.scene.add(dashNS);
    }

    // Crosswalks around center
    const crosswalkOffsets = [-10, 10];
    crosswalkOffsets.forEach((pos) => {
      // EW crosswalk stripes
      for (let s = -5; s <= 5; s += 1.4) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.5), lineMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(s, 0.035, pos);
        this.scene.add(stripe);
      }
      // NS crosswalk stripes
      for (let s = -5; s <= 5; s += 1.4) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.8), lineMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(pos, 0.035, s);
        this.scene.add(stripe);
      }
    });
  }

  private createPlaza() {
    // Central circular plaza fountain
    const plazaGroup = new THREE.Group();
    plazaGroup.position.set(0, 0, 0);

    // Stone basin
    const basinGeo = new THREE.CylinderGeometry(5, 5.2, 0.8, 16);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.6 });
    const basin = new THREE.Mesh(basinGeo, stoneMat);
    basin.position.y = 0.4;
    basin.castShadow = true;
    basin.receiveShadow = true;
    plazaGroup.add(basin);

    // Inner water surface
    const waterGeo = new THREE.CylinderGeometry(4.6, 4.6, 0.1, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.75;
    plazaGroup.add(water);

    // Center fountain pillar & jet
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 2.2, 8), stoneMat);
    pillar.position.y = 1.1;
    pillar.castShadow = true;
    plazaGroup.add(pillar);

    // Spouting water crystal
    const spoutGeo = new THREE.IcosahedronGeometry(0.7, 0);
    const spoutMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
    const spout = new THREE.Mesh(spoutGeo, spoutMat);
    spout.position.y = 2.4;
    plazaGroup.add(spout);

    this.scene.add(plazaGroup);

    // Animate spout water pulsing
    this.animatedMeshes.push({
      mesh: spout,
      update: (time) => {
        spout.rotation.y = time * 0.8;
        spout.position.y = 2.4 + Math.sin(time * 3) * 0.12;
      },
    });

    // Central fountain collision
    this.collisionBoxes.push({
      minX: -5.2,
      maxX: 5.2,
      minZ: -5.2,
      maxZ: 5.2,
    });
  }

  // 1. APARTMENT (Unit 404) at [-28, 0, -26]
  private createApartment() {
    const loc = LOCATIONS.apartment;
    const [x, , z] = loc.position;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main brick/slate loft building
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2b3748, roughness: 0.8 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(14, 18, 12), bodyMat);
    body.position.y = 9;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Architectural roof terrace trim
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(14.8, 1.2, 12.8), roofMat);
    roof.position.y = 18.6;
    group.add(roof);

    // Warm lit windows grid
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 0.4,
      roughness: 0.3,
    });

    for (let floor = 0; floor < 3; floor++) {
      for (let col = -1; col <= 1; col++) {
        // Front windows
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.4), winMat);
        win.position.set(col * 3.5, 5 + floor * 4.5, 6.02);
        group.add(win);
      }
    }

    // Modern glass entrance door
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 4.2, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    doorFrame.position.set(0, 2.1, 6.1);
    group.add(doorFrame);

    const doorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 3.6),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      })
    );
    doorGlass.position.set(0, 2, 6.32);
    group.add(doorGlass);

    // Entrance canopy awning
    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.4, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
    );
    awning.position.set(0, 4.4, 7);
    group.add(awning);

    // Building Sign: "UNIT 404"
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 1.1, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, emissive: 0x1e40af, emissiveIntensity: 0.5 })
    );
    signBoard.position.set(0, 5.4, 6.2);
    group.add(signBoard);

    this.scene.add(group);

    // Collision
    this.collisionBoxes.push({
      minX: x - 7.5,
      maxX: x + 7.5,
      minZ: z - 6.5,
      maxZ: z + 6.5,
    });
  }

  // 2. UNIVERSITY (Metropolitan University) at [-26, 0, 26]
  private createUniversity() {
    const loc = LOCATIONS.university;
    const [x, , z] = loc.position;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main neoclassical / modernist faculty hall
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const mainHall = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 14), wallMat);
    mainHall.position.y = 7;
    mainHall.castShadow = true;
    mainHall.receiveShadow = true;
    group.add(mainHall);

    // Classical entrance colonnade
    const colMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.4 });
    [-5, -2, 2, 5].forEach((cx) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 7.5, 12), colMat);
      col.position.set(cx, 3.75, -7.2);
      col.castShadow = true;
      group.add(col);
    });

    // Colonnade pediment triangular roof
    const pedimentGeo = new THREE.CylinderGeometry(7, 7, 14, 3);
    const pediment = new THREE.Mesh(pedimentGeo, colMat);
    pediment.rotation.z = Math.PI / 2;
    pediment.rotation.y = Math.PI / 6;
    pediment.position.set(0, 9, -7.2);
    group.add(pediment);

    // Central Glass Clock Tower
    const towerGeo = new THREE.BoxGeometry(5, 12, 5);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 18, 0);
    tower.castShadow = true;
    group.add(tower);

    // Glowing Clock Dial
    const clockGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 16);
    const clockMat = new THREE.MeshBasicMaterial({ color: 0xe0e7ff });
    const clock = new THREE.Mesh(clockGeo, clockMat);
    clock.rotation.x = Math.PI / 2;
    clock.position.set(0, 20, -2.6);
    group.add(clock);

    // University banner
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x6d28d9, emissiveIntensity: 0.6 })
    );
    banner.position.set(0, 6.2, -7.4);
    group.add(banner);

    this.scene.add(group);

    // Collision
    this.collisionBoxes.push({
      minX: x - 8.5,
      maxX: x + 8.5,
      minZ: z - 8.5,
      maxZ: z + 7.5,
    });
  }

  // 3. CAFE (Bean & Byte) at [24, 0, -26]
  private createCafe() {
    const loc = LOCATIONS.cafe;
    const [x, , z] = loc.position;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Warm brick base
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
    const cafeBody = new THREE.Mesh(new THREE.BoxGeometry(13, 8, 12), brickMat);
    cafeBody.position.y = 4;
    cafeBody.castShadow = true;
    cafeBody.receiveShadow = true;
    group.add(cafeBody);

    // Glass panoramic shopfront
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.35,
      roughness: 0.2,
    });
    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(9, 4), glassMat);
    frontGlass.position.set(0, 3, 6.02);
    group.add(frontGlass);

    // Striped cafe awning (orange/cream)
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const awning = new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 3.5), awningMat);
    awning.position.set(0, 5.5, 7.5);
    awning.rotation.x = 0.15;
    group.add(awning);

    // Outdoor wooden patio platform
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const patio = new THREE.Mesh(new THREE.BoxGeometry(11, 0.2, 5), woodMat);
    patio.position.set(0, 0.1, 8.5);
    patio.receiveShadow = true;
    group.add(patio);

    // Outdoor cafe table with parasol
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 12), tableMat);
    table.position.set(-2.5, 1.2, 8.5);
    group.add(table);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8), tableMat);
    pole.position.set(-2.5, 1.25, 8.5);
    group.add(pole);

    const umbrella = new THREE.Mesh(
      new THREE.ConeGeometry(2, 0.8, 10),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    );
    umbrella.position.set(-2.5, 2.7, 8.5);
    group.add(umbrella);

    // Glowing Coffee Cup Neon Sign
    const signMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.7, 1.1, 12), signMat);
    cup.position.set(0, 6.8, 6.2);
    group.add(cup);

    this.scene.add(group);

    // Collision
    this.collisionBoxes.push({
      minX: x - 7,
      maxX: x + 7,
      minZ: z - 6.5,
      maxZ: z + 6.5,
    });
  }

  // 4. OFFICE (Apex Ventures) at [28, 0, 26]
  private createOffice() {
    const loc = LOCATIONS.office;
    const [x, , z] = loc.position;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Modern blue glass corporate tower
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x0e7490,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x083344,
      emissiveIntensity: 0.2,
    });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(14, 26, 14), towerMat);
    tower.position.y = 13;
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);

    // Sleek white structural exoskeleton ribs
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.3 });
    for (let floor = 1; floor <= 4; floor++) {
      const ring = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.5, 14.4), frameMat);
      ring.position.y = floor * 5;
      group.add(ring);
    }

    // High tech communications spire / antenna on rooftop
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.4, 9, 8), frameMat);
    spire.position.set(0, 30.5, 0);
    group.add(spire);

    // Beacon light on top of antenna
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    beacon.position.set(0, 35, 0);
    group.add(beacon);

    // Revolving glass entrance lobby
    const lobby = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4, 3),
      new THREE.MeshStandardMaterial({
        color: 0xa5f3fc,
        emissive: 0x0891b2,
        emissiveIntensity: 0.4,
        roughness: 0.1,
      })
    );
    lobby.position.set(0, 2, -7.5);
    group.add(lobby);

    this.scene.add(group);

    // Collision
    this.collisionBoxes.push({
      minX: x - 7.5,
      maxX: x + 7.5,
      minZ: z - 8.5,
      maxZ: z + 7.5,
    });
  }

  // 5. PARK (Starlight City Park) at [0, 0, -28]
  private createPark() {
    const loc = LOCATIONS.park;
    const [x, , z] = loc.position;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Lush green park lawn elevated mound
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 });
    const lawn = new THREE.Mesh(new THREE.CylinderGeometry(11, 12, 0.4, 24), lawnMat);
    lawn.position.y = 0.2;
    lawn.receiveShadow = true;
    group.add(lawn);

    // Serene reflective pond
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const pond = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.1, 16), pondMat);
    pond.position.set(2, 0.42, -1);
    group.add(pond);

    // Curved stone perimeter bridge / pathway
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    for (let a = 0; a < Math.PI * 2; a += 0.4) {
      if (a > 1.2 && a < 2.2) continue; // gap for pond
      const steppingStone = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 8), pathMat);
      steppingStone.position.set(Math.cos(a) * 7.5, 0.42, Math.sin(a) * 7.5);
      group.add(steppingStone);
    }

    // Classic park benches
    const createBench = (bx: number, bz: number, rotY: number) => {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(bx, 0.4, bz);
      benchGroup.rotation.y = rotY;

      const benchWood = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.6), benchWood);
      seat.position.y = 0.5;
      benchGroup.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.1), benchWood);
      back.position.set(0, 0.8, -0.28);
      benchGroup.add(back);

      group.add(benchGroup);
    };

    createBench(-4, 0, Math.PI / 4);
    createBench(4, 4, -Math.PI / 3);

    // Park Cherry Blossom & Pine Trees
    this.createParkTree(group, -5, -4, 'cherry');
    this.createParkTree(group, -6, 3, 'pine');
    this.createParkTree(group, 5, -5, 'cherry');

    this.scene.add(group);

    // Collisions for pond and large center features
    this.collisionBoxes.push({
      minX: x - 1,
      maxX: x + 5.5,
      minZ: z - 4.5,
      maxZ: z + 2.5,
    });
  }

  // 6. CREATIVE HUB (Nexus Studio) at [0, 0, 28]
  private createCreativeHub() {
    const loc = LOCATIONS.creative_hub;
    const [x, , z] = loc.position;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Asymmetric angular industrial warehouse
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
    const hubBody = new THREE.Mesh(new THREE.BoxGeometry(15, 9, 13), darkMat);
    hubBody.position.y = 4.5;
    hubBody.castShadow = true;
    hubBody.receiveShadow = true;
    group.add(hubBody);

    // Pink / Magenta glowing neon edge accents
    const neonMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.9,
    });
    const neonStripe = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.3, 0.3), neonMat);
    neonStripe.position.set(0, 9.1, -6.6);
    group.add(neonStripe);

    const neonStripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 13.2), neonMat);
    neonStripe2.position.set(-7.6, 9.1, 0);
    group.add(neonStripe2);

    // Sawtooth glass skylights on roof
    for (let r = -4; r <= 4; r += 4) {
      const skylight = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 1.8, 4, 3),
        new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 0.3 })
      );
      skylight.rotation.z = Math.PI / 2;
      skylight.position.set(0, 10.5, r);
      group.add(skylight);
    }

    // Modern kinetic art sculpture outside entrance
    const artGroup = new THREE.Group();
    artGroup.position.set(0, 0, -8.5);

    const artBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.8, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x374151 })
    );
    artBase.position.y = 0.2;
    artGroup.add(artBase);

    const kineticTorus = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.25, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xec4899,
        emissiveIntensity: 0.7,
        metalness: 0.5,
        roughness: 0.3,
      })
    );
    kineticTorus.position.y = 2.4;
    artGroup.add(kineticTorus);

    group.add(artGroup);

    this.animatedMeshes.push({
      mesh: kineticTorus,
      update: (time) => {
        kineticTorus.rotation.x = time * 0.9;
        kineticTorus.rotation.y = time * 1.3;
      },
    });

    this.scene.add(group);

    // Collision
    this.collisionBoxes.push({
      minX: x - 8,
      maxX: x + 8,
      minZ: z - 7,
      maxZ: z + 7,
    });
  }

  private createParkTree(parent: THREE.Group, tx: number, tz: number, type: 'cherry' | 'pine') {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(tx, 0.4, tz);

    // Trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 2.5, 8), trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    if (type === 'cherry') {
      const folMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 });
      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), folMat);
      foliage.position.y = 3;
      foliage.castShadow = true;
      treeGroup.add(foliage);
    } else {
      const folMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 });
      for (let layer = 0; layer < 3; layer++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(1.5 - layer * 0.35, 1.4, 7),
          folMat
        );
        cone.position.y = 2.2 + layer * 0.9;
        cone.castShadow = true;
        treeGroup.add(cone);
      }
    }

    parent.add(treeGroup);
  }

  private createDecorativeTrees() {
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x422006, roughness: 0.9 });

    // Trees planted along main street sidewalks
    const treeCoords = [
      [-12, -18], [-12, -34], [12, -18], [12, -34],
      [-12, 18], [-12, 34], [12, 18], [12, 34],
      [-18, -12], [-34, -12], [-18, 12], [-34, 12],
      [18, -12], [34, -12], [18, 12], [34, 12],
    ];

    treeCoords.forEach(([tx, tz]) => {
      const tg = new THREE.Group();
      tg.position.set(tx, 0.15, tz);

      // Low poly stylized street planter box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.3, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x4b5563 })
      );
      box.position.y = 0.15;
      tg.add(box);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 2.2, 6), trunkMat);
      trunk.position.y = 1.25;
      trunk.castShadow = true;
      tg.add(trunk);

      // Spherical stylized foliage
      const foliage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1), treeMat);
      foliage.position.y = 2.8;
      foliage.castShadow = true;
      tg.add(foliage);

      this.scene.add(tg);
    });
  }

  private createStreetFurniture() {
    // Streetlights at key road intersections
    const lightCoords = [
      [-9, -9], [9, -9], [-9, 9], [9, 9],
      [-9, -24], [9, -24], [-9, 24], [9, 24],
      [-24, -9], [24, -9], [-24, 9], [24, 9],
    ];

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7, roughness: 0.3 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    lightCoords.forEach(([lx, lz]) => {
      const lampGroup = new THREE.Group();
      lampGroup.position.set(lx, 0, lz);

      // Vertical pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 5, 8), poleMat);
      pole.position.y = 2.5;
      pole.castShadow = true;
      lampGroup.add(pole);

      // Horizontal bracket
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), poleMat);
      bracket.position.set(lx > 0 ? -0.35 : 0.35, 4.9, 0);
      lampGroup.add(bracket);

      // Lamp bulb
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lampMat);
      bulb.position.set(lx > 0 ? -0.7 : 0.7, 4.75, 0);
      lampGroup.add(bulb);

      // PointLight for nighttime city glow
      const pl = new THREE.PointLight(0xfff7ed, 0.7, 16);
      pl.position.set(lx > 0 ? -0.7 : 0.7, 4.6, 0);
      lampGroup.add(pl);
      this.streetLights.push(pl);

      this.scene.add(lampGroup);
    });
  }

  private createBoundaryWalls() {
    // City bounds: limits player inside [-65, 65]
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
    });

    const createWall = (w: number, d: number, x: number, z: number) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), borderMat);
      wall.position.set(x, 2, z);
      this.scene.add(wall);
    };

    // Four perimeter boundary hedges / walls
    createWall(140, 2, 0, -65);
    createWall(140, 2, 0, 65);
    createWall(2, 140, -65, 0);
    createWall(2, 140, 65, 0);

    // Perimeter collision
    this.collisionBoxes.push(
      { minX: -70, maxX: 70, minZ: -70, maxZ: -63 },
      { minX: -70, maxX: 70, minZ: 63, maxZ: 70 },
      { minX: -70, maxX: -63, minZ: -70, maxZ: 70 },
      { minX: 63, maxX: 70, minZ: -70, maxZ: 70 }
    );
  }

  private spawnNPCs() {
    // 1. Interactive Core Story NPCs
    NPCS.forEach((npc, index) => {
      const group = new THREE.Group();
      const [nx, ny, nz] = npc.position;
      group.position.set(nx, ny, nz);

      // Stylized low-poly NPC humanoid
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
      const outfitMat = new THREE.MeshStandardMaterial({ color: parseInt(npc.color.replace('#', '0x')), roughness: 0.5 });
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

      // Torso Group for procedural breathing / swaying
      const torsoGroup = new THREE.Group();
      torsoGroup.position.y = 1.35;

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.45), outfitMat);
      torso.castShadow = true;
      torsoGroup.add(torso);

      // Head & Neck Group for looking around
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.8, 0);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.5, 0.45), skinMat);
      head.castShadow = true;
      headGroup.add(head);

      // Hair
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.25, 0.5), hairMat);
      hair.position.y = 0.23;
      headGroup.add(hair);

      torsoGroup.add(headGroup);

      // Arms for subtle gestures / swaying
      const armMat = outfitMat;
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.22), armMat);
      leftArm.position.set(-0.52, 0, 0);
      leftArm.castShadow = true;
      torsoGroup.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.22), armMat);
      rightArm.position.set(0.52, 0, 0);
      rightArm.castShadow = true;
      torsoGroup.add(rightArm);

      group.add(torsoGroup);

      // Legs
      const legMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), legMat);
      leftLeg.position.set(-0.2, 0.4, 0);
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), legMat);
      rightLeg.position.set(0.2, 0.4, 0);
      group.add(rightLeg);

      // Floating NPC Interaction Diamond Indicator
      const diaGeo = new THREE.OctahedronGeometry(0.3, 0);
      const diaMat = new THREE.MeshBasicMaterial({ color: parseInt(npc.color.replace('#', '0x')) });
      const dia = new THREE.Mesh(diaGeo, diaMat);
      dia.position.y = 2.9;
      group.add(dia);

      this.scene.add(group);
      this.npcMeshes.set(npc.id, group);

      // Register interactive zone for NPC
      this.interactiveZones.push({
        id: `zone_${npc.id}`,
        type: 'npc',
        name: npc.name,
        position: new THREE.Vector3(nx, 0, nz),
        radius: 4.5,
        targetId: npc.id,
        markerMesh: group,
      });

      // Subtle idle animation: breathing, body swaying, head looking around, diamond bobbing
      const phaseOffset = index * 1.7;
      this.animatedMeshes.push({
        mesh: group,
        update: (time) => {
          // Floating diamond
          dia.rotation.y = time * 2;
          dia.position.y = 2.9 + Math.sin(time * 3 + phaseOffset) * 0.15;

          // Torso breathing & subtle weight shift sway
          torsoGroup.position.y = 1.35 + Math.sin(time * 2.2 + phaseOffset) * 0.035;
          torsoGroup.rotation.z = Math.sin(time * 1.1 + phaseOffset) * 0.025;
          torsoGroup.rotation.y = Math.sin(time * 0.7 + phaseOffset) * 0.04;

          // Head turning / looking around naturally
          headGroup.rotation.y = Math.sin(time * 0.85 + phaseOffset * 1.3) * 0.28;
          headGroup.rotation.x = Math.sin(time * 1.5 + phaseOffset) * 0.06;

          // Arm idle oscillation
          leftArm.rotation.x = Math.sin(time * 1.8 + phaseOffset) * 0.06;
          rightArm.rotation.x = -Math.sin(time * 1.8 + phaseOffset) * 0.06;
        },
      });

      // NPC collision buffer
      this.collisionBoxes.push({
        minX: nx - 0.7,
        maxX: nx + 0.7,
        minZ: nz - 0.7,
        maxZ: nz + 0.7,
      });
    });

    // 2. Ambient City NPCs to populate University Campus and Cafe Patio
    this.spawnAmbientNPCs();
  }

  private spawnAmbientNPCs() {
    // Campus students and Cafe patrons
    const ambientList = [
      // University Campus courtyard students
      { pos: [-29, 0, 21], rotY: 0.5, color: 0x38bdf8, hair: 0x92400e, label: 'Student studying notes', seated: false },
      { pos: [-24, 0, 19], rotY: -2.2, color: 0xa855f7, hair: 0x1e1b4b, label: 'Student with backpack', seated: false },
      { pos: [-31, 0, 24], rotY: 1.4, color: 0x10b981, hair: 0xd97706, label: 'Student chatting near library', seated: false },
      { pos: [-19, 0, 25], rotY: -1.1, color: 0xf43f5e, hair: 0x172554, label: 'Student walking with tablet', seated: false },

      // Bean & Byte Cafe outdoor patio patrons & sidewalk visitors
      { pos: [22, 0, -17], rotY: 2.8, color: 0xf59e0b, hair: 0x451a03, label: 'Cafe customer with coffee', seated: false },
      { pos: [26, 0, -18], rotY: -0.6, color: 0x06b6d4, hair: 0x18181b, label: 'Laptop programmer on patio', seated: false },
      { pos: [21.5, 0, -26], rotY: -1.8, color: 0x84cc16, hair: 0x7c2d12, label: 'Friend talking on patio bench', seated: false },
      { pos: [27, 0, -22], rotY: 0.9, color: 0xec4899, hair: 0x312e81, label: 'Creative discussing design', seated: false },
    ];

    ambientList.forEach((amb, idx) => {
      const group = new THREE.Group();
      group.position.set(amb.pos[0], amb.pos[1], amb.pos[2]);
      group.rotation.y = amb.rotY;

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
      const outfitMat = new THREE.MeshStandardMaterial({ color: amb.color, roughness: 0.5 });
      const hairMat = new THREE.MeshStandardMaterial({ color: amb.hair, roughness: 0.8 });
      const legMat = new THREE.MeshStandardMaterial({ color: 0x334155 });

      // Torso group
      const torsoGroup = new THREE.Group();
      torsoGroup.position.y = 1.35;

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.05, 0.42), outfitMat);
      torso.castShadow = true;
      torsoGroup.add(torso);

      // Ambient prop (e.g. coffee cup or tablet for specific NPCs)
      if (idx % 2 === 0) {
        // Holding a coffee cup or book
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.06, 0.18, 8),
          new THREE.MeshStandardMaterial({ color: 0xfef08a })
        );
        cup.position.set(0.42, -0.1, 0.28);
        torsoGroup.add(cup);
      } else {
        // Small notebook / tablet
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 0.32, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x0284c7 })
        );
        book.position.set(-0.4, -0.1, 0.24);
        book.rotation.y = 0.3;
        torsoGroup.add(book);
      }

      // Head group
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.75, 0);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.48, 0.42), skinMat);
      head.castShadow = true;
      headGroup.add(head);

      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.46), hairMat);
      hair.position.y = 0.22;
      headGroup.add(hair);

      torsoGroup.add(headGroup);

      // Arms
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), outfitMat);
      leftArm.position.set(-0.48, 0, 0);
      leftArm.castShadow = true;
      torsoGroup.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), outfitMat);
      rightArm.position.set(0.48, 0, 0);
      rightArm.castShadow = true;
      torsoGroup.add(rightArm);

      group.add(torsoGroup);

      // Legs
      const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.8, 0.26), legMat);
      leftLeg.position.set(-0.18, 0.4, 0);
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.8, 0.26), legMat);
      rightLeg.position.set(0.18, 0.4, 0);
      group.add(rightLeg);

      this.scene.add(group);

      // Add gentle idle swaying & looking around animation
      const phase = idx * 2.1;
      this.animatedMeshes.push({
        mesh: group,
        update: (time) => {
          // Breathing motion
          torsoGroup.position.y = 1.35 + Math.sin(time * 2.0 + phase) * 0.03;
          torsoGroup.rotation.z = Math.sin(time * 0.9 + phase) * 0.02;

          // Looking around campus/cafe
          headGroup.rotation.y = Math.sin(time * 0.65 + phase * 1.5) * 0.35;
          headGroup.rotation.x = Math.sin(time * 1.2 + phase) * 0.05;

          // Subtle arm movement
          leftArm.rotation.x = Math.sin(time * 1.5 + phase) * 0.05;
          rightArm.rotation.x = -Math.sin(time * 1.5 + phase) * 0.05;
        },
      });

      // Add collision for ambient NPCs
      this.collisionBoxes.push({
        minX: amb.pos[0] - 0.6,
        maxX: amb.pos[0] + 0.6,
        minZ: amb.pos[2] - 0.6,
        maxZ: amb.pos[2] + 0.6,
      });
    });
  }

  private createInteractionBeacons() {
    // For each major location, create a glowing entrance zone circle and floating icon diamond
    Object.values(LOCATIONS).forEach((loc) => {
      const [lx, , lz] = loc.position;

      // Adjust entrance offset towards the road/pathway
      let entranceX = lx;
      let entranceZ = lz;
      if (loc.id === 'apartment') entranceZ += 8.5;
      else if (loc.id === 'university') entranceZ -= 9;
      else if (loc.id === 'cafe') entranceZ += 8.5;
      else if (loc.id === 'office') entranceZ -= 9;
      else if (loc.id === 'park') entranceZ += 10;
      else if (loc.id === 'creative_hub') entranceZ -= 10;

      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(entranceX, 0.05, entranceZ);

      // Glowing pulsing circular floor ring
      const ringGeo = new THREE.RingGeometry(1.8, 2.3, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: parseInt(loc.color.replace('#', '0x')),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      beaconGroup.add(ring);

      // Floating beacon gem
      const gemGeo = new THREE.OctahedronGeometry(0.65, 0);
      const gemMat = new THREE.MeshBasicMaterial({
        color: parseInt(loc.accentColor.replace('#', '0x')),
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.y = 2.2;
      beaconGroup.add(gem);

      this.scene.add(beaconGroup);

      // Register interactive zone
      this.interactiveZones.push({
        id: `zone_${loc.id}`,
        type: 'location',
        name: loc.name,
        position: new THREE.Vector3(entranceX, 0, entranceZ),
        radius: 4.8,
        targetId: loc.id,
        markerMesh: beaconGroup,
      });

      // Animate beacon pulsing and spinning
      this.animatedMeshes.push({
        mesh: gem,
        update: (time) => {
          gem.rotation.y = time * 1.5;
          gem.position.y = 2.2 + Math.sin(time * 2.5 + lx) * 0.25;
          ring.scale.setScalar(1 + Math.sin(time * 3) * 0.08);
        },
      });
    });
  }

  public updateTimeOfDayLighting(hour: number) {
    // Update streetlights intensity based on time of day
    const isNight = hour < 7 || hour >= 19;
    const isDusk = hour >= 17 && hour < 19;

    let targetIntensity = 0;
    if (isNight) targetIntensity = 1.2;
    else if (isDusk) targetIntensity = 0.6;

    this.streetLights.forEach((pl) => {
      pl.intensity = targetIntensity;
    });
  }

  public updateAnimations(time: number) {
    this.animatedMeshes.forEach((item) => item.update(time));
  }
}
