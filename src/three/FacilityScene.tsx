import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { facilityBuildings } from '../data/facility';
import type { BuildingData } from '../data/facility';

interface Props {
  focusedBuildingId: string | null;
  onExitInterior: () => void;
}

export default function FacilityScene({ focusedBuildingId, onExitInterior }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef<string | null>(null);
  const exitRef = useRef(onExitInterior);
  exitRef.current = onExitInterior;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    focusedRef.current = focusedBuildingId;

    // ─── Setup ──────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#dbeafe');
    scene.fog = new THREE.Fog('#dbeafe', 28, 75);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.5, 120);
    camera.position.set(8, 14, 14);
    camera.lookAt(1, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    const defaultTarget = new THREE.Vector3(0, 1, 0);
    controls.target.copy(defaultTarget);
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 8;
    controls.maxDistance = 40;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.update();

    // ─── Lighting ───────────────────────────────────────
    scene.add(new THREE.AmbientLight('#ffffff', 0.55));
    const sun = new THREE.DirectionalLight('#fff8e7', 1.8);
    sun.position.set(20, 25, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.bias = -0.0003;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight('#87ceeb', '#2d5a27', 0.35));

    // ─── Ground ─────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 40),
      new THREE.MeshStandardMaterial({ color: '#2d5a27', roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const beach = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 6),
      new THREE.MeshStandardMaterial({ color: '#c2a66b', roughness: 0.8 })
    );
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(0, 0.01, 12);
    beach.receiveShadow = true;
    scene.add(beach);

    const oceanGeo = new THREE.PlaneGeometry(50, 22, 80, 40);
    const oceanMat = new THREE.MeshStandardMaterial({ color: '#0c4a6e', metalness: 0.5, roughness: 0.1 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, -0.02, 18);
    scene.add(ocean);

    const sitePad = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 18),
      new THREE.MeshStandardMaterial({ color: '#3a3a3a', roughness: 0.85 })
    );
    sitePad.rotation.x = -Math.PI / 2;
    sitePad.position.y = 0.02;
    sitePad.receiveShadow = true;
    scene.add(sitePad);

    // Helipad
    const helipad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 0.2 })
    );
    helipad.position.set(9, 0.04, 4.5);
    helipad.receiveShadow = true;
    scene.add(helipad);

    const hMark = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: '#1e293b' })
    );
    hMark.rotation.x = -Math.PI / 2;
    hMark.position.set(9, 0.06, 4.5);
    scene.add(hMark);

    // ─── Helpers ────────────────────────────────────────
    function createBuildingMaterial(color: string): THREE.MeshStandardMaterial {
      return new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.65 });
    }

    function createLabel(text: string): THREE.Sprite {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.font = 'bold 20px Inter, PingFang SC, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // White text with dark outline for visibility on any background
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeText(text, 128, 32);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 128, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
      sprite.scale.set(3, 0.75, 1);
      return sprite;
    }

    // ─── Interior geometry builders ─────────────────────
    function buildReactorInterior(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w] = data.size;
      // Pressure vessel (main cylinder)
      const vessel = new THREE.Mesh(
        new THREE.CylinderGeometry(w * 0.35, w * 0.35, 4.5, 24),
        new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.6, roughness: 0.3 })
      );
      vessel.position.y = 2.3;
      g.add(vessel);

      // Vessel head (dome)
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(w * 0.35, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.5, roughness: 0.35 })
      );
      head.position.y = 4.55;
      g.add(head);

      // Control rod drives (small cylinders on top)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = w * 0.2;
        const crd = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
          new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.4, roughness: 0.3 })
        );
        crd.position.set(Math.cos(angle) * r, 5, Math.sin(angle) * r);
        g.add(crd);
      }

      // Steam generators (4 cylinders around vessel)
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const r = w * 0.55;
        const sg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 3.5, 12),
          new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.5, roughness: 0.3 })
        );
        sg.position.set(Math.cos(angle) * r, 1.8, Math.sin(angle) * r);
        g.add(sg);

        // Pipe from SG to vessel
        const pipePoints = [
          new THREE.Vector3(Math.cos(angle) * r, 2.5, Math.sin(angle) * r),
          new THREE.Vector3(Math.cos(angle) * (r - 0.3), 2.5, Math.sin(angle) * (r - 0.3)),
        ];
        const pipeCurve = new THREE.LineCurve3(pipePoints[0], pipePoints[1]);
        const pipe = new THREE.Mesh(
          new THREE.TubeGeometry(pipeCurve, 8, 0.06, 8, false),
          new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.5, roughness: 0.3 })
        );
        g.add(pipe);
      }

      // Floor grating
      const floor = new THREE.Mesh(
        new THREE.CylinderGeometry(w * 0.7, w * 0.7, 0.05, 24),
        new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.3, roughness: 0.7 })
      );
      floor.position.y = 0.05;
      g.add(floor);

      g.visible = false;
      return g;
    }

    function buildTurbineInterior(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [, h, d] = data.size;
      // Turbine rotor (horizontal cylinder)
      const rotor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, d * 0.7, 16),
        new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.7, roughness: 0.2 })
      );
      rotor.rotation.z = Math.PI / 2;
      rotor.position.y = h * 0.3;
      g.add(rotor);

      // Rotor blades (discs along shaft)
      for (let z = -d * 0.3; z <= d * 0.3; z += d * 0.12) {
        const disc = new THREE.Mesh(
          new THREE.TorusGeometry(0.5, 0.12, 8, 16),
          new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.6, roughness: 0.2 })
        );
        disc.position.set(0, h * 0.3, z);
        g.add(disc);
      }

      // Generator casing
      const casing = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.2, d * 0.25),
        new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.4, roughness: 0.4 })
      );
      casing.position.set(0, h * 0.3, d * 0.3);
      g.add(casing);

      g.visible = false;
      return g;
    }

    function buildMedicineInterior(_data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      // Hot cells (shielded boxes)
      for (let i = 0; i < 3; i++) {
        const cell = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 1.5, 1.2),
          new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.4, roughness: 0.35 })
        );
        cell.position.set(-1.5 + i * 1.5, 0.8, 0);
        g.add(cell);

        // Glove port windows (small circles on front)
        for (let gy = 0; gy < 2; gy++) {
          const port = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.05, 12),
            new THREE.MeshStandardMaterial({ color: '#87ceeb', emissive: '#87ceeb', emissiveIntensity: 0.3 })
          );
          port.rotation.x = Math.PI / 2;
          port.position.set(-1.5 + i * 1.5, 0.6 + gy * 0.5, 0.63);
          g.add(port);
        }
      }

      // Conveyor between cells
      const belt = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.1, 0.3),
        new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.3, roughness: 0.5 })
      );
      belt.position.set(0, 0.3, 0);
      g.add(belt);

      // Pipes overhead
      for (let i = 0; i < 3; i++) {
        const pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 4, 8),
          new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.5, roughness: 0.3 })
        );
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0, 2, -1 + i);
        g.add(pipe);
      }

      g.visible = false;
      return g;
    }

    function buildScienceInterior(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [, h, d] = data.size;

      // Exhibition walls with colored display screens
      const displayColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      for (let i = 0; i < 4; i++) {
        const screen = new THREE.Mesh(
          new THREE.PlaneGeometry(1.5, 1),
          new THREE.MeshStandardMaterial({ color: displayColors[i], emissive: displayColors[i], emissiveIntensity: 0.4 })
        );
        screen.position.set(-2 + i * 1.4, h * 0.4, -d / 2 + 0.05);
        g.add(screen);
      }

      // Seating
      for (let i = 0; i < 5; i++) {
        const seat = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8),
          new THREE.MeshStandardMaterial({ color: '#78716c' })
        );
        seat.position.set(-1.5 + i * 0.75, 0.2, -d * 0.15);
        g.add(seat);
      }

      // Central hologram table
      const table = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.8, 0.1, 16),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', emissive: '#e2e8f0', emissiveIntensity: 0.2 })
      );
      table.position.y = 0.7;
      g.add(table);

      // Hologram glow
      const glow = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: '#3b82f6', emissive: '#3b82f6', emissiveIntensity: 0.6, transparent: true, opacity: 0.4 })
      );
      glow.position.y = 1.1;
      g.add(glow);

      g.visible = false;
      return g;
    }

    function buildCoolingInterior(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w, h] = data.size;

      // Inner hyperboloid surface
      const pts: THREE.Vector2[] = [];
      const segs = 24;
      const rB = w / 2;
      const rMin = rB * 0.55;
      const zMin = h * 0.25;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const z = t * h * 0.9;
        let r: number;
        if (z < zMin) r = rB - (rB - rMin) * (z / zMin);
        else { const topR = rB * 0.75; r = rMin + (topR - rMin) * ((z - zMin) / (h * 0.9 - zMin)); }
        pts.push(new THREE.Vector2(r - 0.1, z));
      }
      const innerGeo = new THREE.LatheGeometry(pts, 24);
      const innerWall = new THREE.Mesh(innerGeo, new THREE.MeshStandardMaterial({
        color: '#94a3b8', metalness: 0.1, roughness: 0.7, side: THREE.DoubleSide,
      }));
      g.add(innerWall);

      // Spray ring at throat
      const throatY = zMin;
      const throatR = rMin;
      const sprayRing = new THREE.Mesh(
        new THREE.TorusGeometry(throatR - 0.15, 0.06, 8, 24),
        new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.5, roughness: 0.3 })
      );
      sprayRing.rotation.x = Math.PI / 2;
      sprayRing.position.y = throatY;
      g.add(sprayRing);

      // Water collection basin at bottom
      const basin = new THREE.Mesh(
        new THREE.CylinderGeometry(w * 0.42, w * 0.45, 0.1, 24),
        new THREE.MeshStandardMaterial({ color: '#0c4a6e', metalness: 0.3, roughness: 0.2 })
      );
      basin.position.y = 0.05;
      g.add(basin);

      g.visible = false;
      return g;
    }

    function buildGreenhouseInterior(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w, h, d] = data.size;

      // Plant rows (small green cones)
      const plantMat = new THREE.MeshStandardMaterial({ color: '#22c55e' });
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          const plant = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 6), plantMat);
          plant.position.set(-w * 0.3 + col * (w * 0.15), 0.25, -d * 0.2 + row * (d * 0.2));
          g.add(plant);
        }
      }

      // Irrigation pipes
      for (let row = 0; row < 3; row++) {
        const pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, w * 0.8, 8),
          new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.5, roughness: 0.3 })
        );
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0, h * 0.5, -d * 0.2 + row * (d * 0.2));
        g.add(pipe);
      }

      // Growing beds
      for (let row = 0; row < 3; row++) {
        const bed = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.8, 0.15, d * 0.12),
          new THREE.MeshStandardMaterial({ color: '#3f2e1d' })
        );
        bed.position.set(0, 0.08, -d * 0.2 + row * (d * 0.2));
        g.add(bed);
      }

      g.visible = false;
      return g;
    }

    function buildDefaultInterior(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [, h, d] = data.size;

      // Structural columns
      for (let x = -0.8; x <= 0.8; x += 0.8) {
        for (let z = -0.8; z <= 0.8; z += 0.8) {
          const col = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, h * 0.8, 8),
            new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.3, roughness: 0.5 })
          );
          col.position.set(x, h * 0.4, z);
          g.add(col);
        }
      }

      // Floor
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(2, d * 0.7),
        new THREE.MeshStandardMaterial({ color: '#78716c' })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0.03;
      g.add(floor);

      g.visible = false;
      return g;
    }

    function buildInterior(data: BuildingData): THREE.Group {
      switch (data.shape) {
        case 'dome': return buildReactorInterior(data);
        case 'box':
          if (data.id === 'turbine') return buildTurbineInterior(data);
          if (data.id === 'medicine' || data.id === 'hotcell') return buildMedicineInterior(data);
          if (data.id === 'science') return buildScienceInterior(data);
          return buildDefaultInterior(data);
        case 'hyperboloid': return buildCoolingInterior(data);
        case 'greenhouse': return buildGreenhouseInterior(data);
        default: return buildDefaultInterior(data);
      }
    }

    // ─── Buildings (exterior) ───────────────────────────
    const buildingMeshes: Map<string, THREE.Group> = new Map();
    const interiorGroups: Map<string, THREE.Group> = new Map();
    const exteriorMaterials: Map<string, THREE.MeshStandardMaterial[]> = new Map();

    function buildDome(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w, h] = data.size;
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(w / 2, w / 2 + 0.15, h - 1, 32),
        createBuildingMaterial(data.color)
      );
      base.position.y = h / 2 - 0.5;
      base.castShadow = true; base.receiveShadow = true;
      g.add(base);

      for (let y = 0.6; y < h - 0.8; y += 1.2) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(w / 2 + 0.05, 0.06, 8, 32),
          new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.3, roughness: 0.4 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        g.add(ring);
      }

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(w / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.1, roughness: 0.45 })
      );
      dome.position.y = h - 0.5;
      dome.castShadow = true;
      g.add(dome);

      const label = createLabel(data.name);
      label.position.y = h + 0.8;
      g.add(label);

      trackExteriorMaterials(g, data.color);
      g.position.set(...data.position);
      return g;
    }

    function buildBox(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w, h, d] = data.size;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), createBuildingMaterial(data.color));
      body.castShadow = true; body.receiveShadow = true;
      g.add(body);

      const win = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.8, 0.15, 0.05),
        new THREE.MeshStandardMaterial({ color: '#87ceeb', emissive: '#87ceeb', emissiveIntensity: 0.3 })
      );
      win.position.set(0, h * 0.2, d / 2 + 0.02);
      g.add(win);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.1, 0.1, d + 0.1),
        new THREE.MeshStandardMaterial({ color: '#334155' })
      );
      roof.position.y = h / 2 + 0.05;
      g.add(roof);

      const label = createLabel(data.name);
      label.position.y = h + 0.6;
      g.add(label);

      trackExteriorMaterials(g, data.color);
      g.position.set(...data.position);
      return g;
    }

    function buildHyperboloid(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w, h] = data.size;
      const pts: THREE.Vector2[] = [];
      const segs = 32;
      const rB = w / 2;
      const rMin = rB * 0.55;
      const zMin = h * 0.25;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const z = t * h;
        let r: number;
        if (z < zMin) r = rB - (rB - rMin) * (z / zMin);
        else { const topR = rB * 0.75; r = rMin + (topR - rMin) * ((z - zMin) / (h - zMin)); }
        pts.push(new THREE.Vector2(r, z));
      }
      const geo = new THREE.LatheGeometry(pts, 32);
      const body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: data.color, metalness: 0.1, roughness: 0.7, side: THREE.DoubleSide,
      }));
      body.castShadow = true;
      g.add(body);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(w * 0.38, 0.08, 8, 32),
        new THREE.MeshStandardMaterial({ color: '#94a3b8' })
      );
      rim.position.y = h;
      rim.rotation.x = Math.PI / 2;
      g.add(rim);

      const emitter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: '#64748b' })
      );
      emitter.position.y = h + 0.15;
      g.add(emitter);
      g.userData = { ...data, steamEmitterY: h + 0.3 };

      const label = createLabel(data.name);
      label.position.y = h + 1.2;
      g.add(label);

      trackExteriorMaterials(g, data.color);
      g.position.set(...data.position);
      return g;
    }

    function buildGreenhouse(data: BuildingData): THREE.Group {
      const g = new THREE.Group();
      const [w, h, d] = data.size;
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), new THREE.MeshStandardMaterial({ color: '#78716c' }));
      base.position.y = 0.1;
      base.castShadow = true; base.receiveShadow = true;
      g.add(base);

      const shell = new THREE.Mesh(
        new THREE.CylinderGeometry(w / 2, w / 2, h, 16, 1, false, 0, Math.PI),
        new THREE.MeshStandardMaterial({ color: data.color, transparent: true, opacity: 0.45, roughness: 0.25, side: THREE.DoubleSide })
      );
      shell.position.y = h / 2;
      g.add(shell);

      for (let a = 0; a < Math.PI; a += Math.PI / 6) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.06), new THREE.MeshStandardMaterial({ color: '#d1d5db' }));
        rib.position.set(Math.cos(a) * (w / 2 - 0.03), h / 2, 0);
        g.add(rib);
      }

      const label = createLabel(data.name);
      label.position.y = h + 0.6;
      g.add(label);

      trackExteriorMaterials(g, data.color);
      g.position.set(...data.position);
      return g;
    }

    function trackExteriorMaterials(group: THREE.Group, originalColor: string) {
      const mats: THREE.MeshStandardMaterial[] = [];
      group.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          if (!(child.material as any).isWindow) {
            mats.push(child.material);
            (child.material as any)._originalColor = originalColor;
            (child.material as any)._originalOpacity = child.material.opacity;
            (child.material as any)._originalTransparent = child.material.transparent;
          }
        }
      });
      exteriorMaterials.set(group.uuid, mats);
    }

    for (const b of facilityBuildings) {
      let extGroup: THREE.Group;
      switch (b.shape) {
        case 'dome':        extGroup = buildDome(b); break;
        case 'hyperboloid': extGroup = buildHyperboloid(b); break;
        case 'greenhouse':  extGroup = buildGreenhouse(b); break;
        default:            extGroup = buildBox(b); break;
      }
      extGroup.userData = b;
      scene.add(extGroup);
      buildingMeshes.set(b.id, extGroup);

      // Build interior and add as child
      const intGroup = buildInterior(b);
      intGroup.userData = { isInterior: true };
      extGroup.add(intGroup);
      interiorGroups.set(b.id, intGroup);
    }

    // ─── Steam particles ────────────────────────────────
    const steamParticles: { mesh: THREE.Mesh; tower: THREE.Group; life: number; maxLife: number }[] = [];
    const steamGeo = new THREE.SphereGeometry(0.12, 6, 4);
    const coolingTowers = Array.from(buildingMeshes.values()).filter(
      g => (g.userData as BuildingData).shape === 'hyperboloid'
    );

    for (const tower of coolingTowers) {
      for (let i = 0; i < 15; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.7, roughness: 0.1 });
        const mesh = new THREE.Mesh(steamGeo, mat);
        const tp = tower.position;
        const th = (tower.userData as BuildingData).size[1];
        mesh.position.set(tp.x + (Math.random() - 0.5) * 0.8, tp.y + th + Math.random() * 3, tp.z + (Math.random() - 0.5) * 0.8);
        mesh.scale.setScalar(0.4 + Math.random() * 0.8);
        scene.add(mesh);
        steamParticles.push({ mesh, tower, life: Math.random() * 3, maxLife: 2 + Math.random() * 3 });
      }
    }

    // ─── Roads & details ────────────────────────────────
    function addRoad(sx: number, sz: number, ex: number, ez: number, w = 0.5) {
      const dx = ex - sx, dz = ez - sz, len = Math.sqrt(dx * dx + dz * dz), angle = Math.atan2(dx, dz);
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, len), new THREE.MeshStandardMaterial({ color: '#4a4a4a' }));
      road.position.set((sx + ex) / 2, 0.04, (sz + ez) / 2);
      road.rotation.y = angle; road.receiveShadow = true;
      scene.add(road);
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, len), new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 0.2 }));
      line.position.set((sx + ex) / 2, 0.06, (sz + ez) / 2);
      line.rotation.y = angle;
      scene.add(line);
    }

    addRoad(0, -9, 0, 9, 0.8);
    addRoad(-10, 0, 10, 0, 0.6);
    addRoad(0, 0, -6, -3, 0.5);
    addRoad(4, 0, 8, -7, 0.5);
    addRoad(0, 0, 0, -8, 0.5);
    addRoad(0, 0, -4, 6, 0.5);

    // Trees
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 42, z = (Math.random() - 0.5) * 34;
      if (Math.abs(x) < 11 && Math.abs(z) < 7.5) continue;
      if (z > 10) continue;
      const isPalm = Math.random() < 0.3, s = 0.5 + Math.random() * 1.2;
      const treeG = new THREE.Group();

      if (isPalm) {
        const trunkH = 1.2 * s;
        treeG.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06 * s, 0.1 * s, trunkH, 8), new THREE.MeshStandardMaterial({ color: '#a16207' }))).position.y = trunkH / 2;
        for (let f = 0; f < 6; f++) {
          const frond = new THREE.Mesh(new THREE.ConeGeometry(0.08 * s, 0.7 * s, 4), new THREE.MeshStandardMaterial({ color: '#22c55e' }));
          frond.position.y = trunkH;
          frond.rotation.z = Math.PI / 3 + (f / 6) * Math.PI * 2 * 0.5;
          frond.rotation.x = 0.4;
          frond.position.x = Math.cos(f / 6 * Math.PI * 2) * 0.15 * s;
          frond.position.z = Math.sin(f / 6 * Math.PI * 2) * 0.15 * s;
          treeG.add(frond);
        }
      } else {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * s, 0.12 * s, 0.8 * s, 6), new THREE.MeshStandardMaterial({ color: '#78350f' }));
        trunk.position.y = 0.4 * s; treeG.add(trunk);
        const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.4 * s, 0.9 * s, 8), new THREE.MeshStandardMaterial({ color: '#166534' }));
        c1.position.y = 1.05 * s; treeG.add(c1);
        const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.3 * s, 0.6 * s, 8), new THREE.MeshStandardMaterial({ color: '#15803d' }));
        c2.position.y = 1.35 * s; treeG.add(c2);
      }
      treeG.position.set(x, 0, z);
      scene.add(treeG);
    }

    // Boundary wall
    const wallMat = new THREE.MeshStandardMaterial({ color: '#64748b' });
    const hW = 12, hH = 7.5;
    for (const [sx, sz, ex, ez] of [[-hW, -hH, hW, -hH], [hW, -hH, hW, hH], [hW, hH, -hW, hH], [-hW, hH, -hW, -hH]]) {
      const dx = ex - sx, dz = ez - sz, len = Math.sqrt(dx * dx + dz * dz), ang = Math.atan2(dx, dz);
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, len), wallMat);
      w.position.set((sx + ex) / 2, 0.4, (sz + ez) / 2);
      w.rotation.y = ang; w.castShadow = true;
      scene.add(w);
    }

    // Gate
    const gateMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 0.5 });
    const gL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 0.2), gateMat);
    gL.position.set(-1.5, 0.7, -7.6); scene.add(gL);
    const gR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 0.2), gateMat);
    gR.position.set(1.5, 0.7, -7.6); scene.add(gR);
    const gB = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 0.15), new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 0.3 }));
    gB.position.set(0, 1.4, -7.6); scene.add(gB);

    // Street lamps
    for (let z = -5; z <= 5; z += 3) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.2, 6), new THREE.MeshStandardMaterial({ color: '#475569' }));
      pole.position.set(1.2, 0.6, z); pole.castShadow = true; scene.add(pole);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 4), new THREE.MeshStandardMaterial({ color: '#fef3c7', emissive: '#fef3c7', emissiveIntensity: 0.6 }));
      lamp.position.set(1.2, 1.2, z); scene.add(lamp);
    }

    // ─── Camera animation state ─────────────────────────
    const camTarget = new THREE.Vector3();
    const camDest = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    const lookDest = new THREE.Vector3();
    camera.getWorldPosition(camTarget);
    camDest.copy(camTarget);
    lookTarget.copy(controls.target);
    lookDest.copy(lookTarget);
    let isTransitioning = false;

    // ─── Raycaster ──────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredGroup: THREE.Group | null = null;
    const allBuildingGroups: THREE.Group[] = Array.from(buildingMeshes.values());

    function getIntersections(ev: MouseEvent): THREE.Group[] {
      if (!container) return [];
      mouse.x = (ev.clientX / container.clientWidth) * 2 - 1;
      mouse.y = -(ev.clientY / container.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allBuildingGroups, true);
      const groups = new Set<THREE.Group>();
      for (const intersect of intersects) {
        let obj: THREE.Object3D | null = intersect.object;
        while (obj) {
          if (obj instanceof THREE.Group && obj.userData.id) {
            groups.add(obj);
            break;
          }
          obj = obj.parent;
        }
      }
      return Array.from(groups);
    }

    function onMouseMove(ev: MouseEvent) {
      const groups = getIntersections(ev);
      const nh = groups.length > 0 ? groups[0] : null;
      if (hoveredGroup && hoveredGroup !== nh) setExteriorEmissive(hoveredGroup, false);
      if (nh && nh !== hoveredGroup) { setExteriorEmissive(nh, true); container!.style.cursor = 'pointer'; }
      else if (!nh && container) container.style.cursor = '';
      hoveredGroup = nh;
    }

    function onClick(ev: MouseEvent) {
      const groups = getIntersections(ev);
      if (groups.length > 0) {
        const b = groups[0].userData as BuildingData;
        container!.dispatchEvent(new CustomEvent('building-click', { detail: b, bubbles: true }));
      } else {
        // Click on ground → exit interior
        const id = focusedRef.current;
        if (id) exitRef.current();
      }
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    function setExteriorEmissive(group: THREE.Group, on: boolean) {
      const mats = exteriorMaterials.get(group.uuid);
      if (!mats) return;
      const b = group.userData as BuildingData;
      for (const mat of mats) {
        mat.color.set(on ? '#ffffff' : b.color);
      }
    }

    // ─── Focus/Unfocus logic ────────────────────────────
    let prevFocusedId: string | null = focusedBuildingId;

    function focusBuilding(id: string) {
      const g = buildingMeshes.get(id);
      if (!g) return;
      const b = g.userData as BuildingData;
      const pos = new THREE.Vector3(...b.position);
      const [w, h] = b.size;

      // Move camera closer to building
      const offset = new THREE.Vector3(w * 1.5, h * 0.6, w * 1.5);
      camDest.copy(pos).add(offset);
      lookDest.copy(pos).add(new THREE.Vector3(0, h * 0.3, 0));

      controls.autoRotate = false;
      controls.minDistance = 2;
      controls.maxDistance = w * 3;
      isTransitioning = true;

      // Fade exterior walls
      for (const [uuid, mats] of exteriorMaterials) {
        for (const mat of mats) {
          mat.transparent = true;
          mat.opacity = uuid === g.uuid ? 0.15 : 0.35;
          mat.needsUpdate = true;
        }
      }

      // Show interior
      const interior = interiorGroups.get(id);
      if (interior) interior.visible = true;

      // Hide labels on this building
      g.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Sprite) child.visible = false;
      });
    }

    function unfocusBuilding(oldId: string | null) {
      if (oldId) {
        const g = buildingMeshes.get(oldId);
        if (g) {
          g.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Sprite) child.visible = true;
          });
        }
        const interior = interiorGroups.get(oldId);
        if (interior) interior.visible = false;
      }

      // Restore exterior walls
      for (const mats of exteriorMaterials.values()) {
        for (const mat of mats) {
          mat.transparent = (mat as any)._originalTransparent ?? false;
          mat.opacity = (mat as any)._originalOpacity ?? 1;
          mat.needsUpdate = true;
        }
      }

      camDest.set(8, 14, 14);
      lookDest.copy(defaultTarget);
      controls.autoRotate = true;
      controls.minDistance = 8;
      controls.maxDistance = 40;
      isTransitioning = true;
    }

    // ─── Keyboard handler ───────────────────────────────
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && focusedRef.current) {
        exitRef.current();
      }
    }
    window.addEventListener('keydown', onKeyDown);

    // ─── Animation loop ─────────────────────────────────
    function animate() {
      requestAnimationFrame(animate);

      // Detect focus change from React prop (via ref)
      const currentFocusedId = focusedRef.current;
      if (currentFocusedId !== prevFocusedId) {
        if (prevFocusedId) unfocusBuilding(prevFocusedId);
        if (currentFocusedId) focusBuilding(currentFocusedId);
        prevFocusedId = currentFocusedId;
      }

      controls.update();

      // Smooth camera lerp — only during transitions
      if (isTransitioning) {
        camTarget.lerp(camDest, 0.08);
        camera.position.copy(camTarget);
        lookTarget.lerp(lookDest, 0.08);
        controls.target.copy(lookTarget);

        // End transition when close enough to destination
        if (camTarget.distanceToSquared(camDest) < 0.001 && lookTarget.distanceToSquared(lookDest) < 0.001) {
          camTarget.copy(camDest);
          lookTarget.copy(lookDest);
          camera.position.copy(camDest);
          controls.target.copy(lookDest);
          isTransitioning = false;
        }
      } else {
        // Sync camTarget/lookTarget to actual camera so next transition starts from the right place
        camera.getWorldPosition(camTarget);
        lookTarget.copy(controls.target);
      }

      const t = performance.now() * 0.001;

      // Ocean
      const posArray = oceanGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i + 2] = Math.sin(posArray[i] * 0.8 + t * 0.7) * Math.cos(posArray[i + 1] * 0.6 + t * 0.5) * 0.3;
      }
      oceanGeo.attributes.position.needsUpdate = true;
      ocean.position.y = -0.01 + Math.sin(t * 0.3) * 0.015;

      // Steam particles
      for (const p of steamParticles) {
        p.life += 0.016;
        const progress = p.life / p.maxLife;
        const th = (p.tower.userData as BuildingData).size[1];
        const tp = p.tower.position;
        p.mesh.position.y = tp.y + th + progress * 4;
        p.mesh.position.x = tp.x + (p.mesh.position.x - tp.x) * 1.01;
        p.mesh.position.z = tp.z + (p.mesh.position.z - tp.z) * 1.01;
        (p.mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.7 * (1 - progress));
        p.mesh.scale.setScalar(p.mesh.scale.x + 0.003);
        if (progress >= 1) {
          p.life = 0; p.maxLife = 2 + Math.random() * 3;
          p.mesh.position.set(tp.x + (Math.random() - 0.5) * 0.8, tp.y + th, tp.z + (Math.random() - 0.5) * 0.8);
          p.mesh.scale.setScalar(0.3 + Math.random() * 0.6);
          (p.mesh.material as THREE.MeshStandardMaterial).opacity = 0.7;
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // ─── Resize ─────────────────────────────────────────
    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    // ─── Cleanup ────────────────────────────────────────
    return () => {
      if (!container) return;
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep focusedRef in sync with React prop
  useEffect(() => {
    focusedRef.current = focusedBuildingId;
  }, [focusedBuildingId]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 text-xs space-y-1 z-10 pointer-events-none">
        <p className="text-slate-500 mb-1">🖱 Drag to rotate | Scroll to zoom | Right-drag to pan | Click buildings to enter | Click ground/Esc to exit</p>
        <div className="flex gap-3 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#94a3b8] inline-block" /> Reactor Zone</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#3b82f6] inline-block" /> Medical Center</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#10b981] inline-block" /> Science Center</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#86efac] inline-block" /> Agriculture</span>
        </div>
      </div>
    </div>
  );
}
