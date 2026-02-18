import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// ── Types ──
export interface OceanParams {
  particleCount: number;
  particleSize: number;
  boxSize: number;
  gravity: number;
  damping: number;
  bounce: number;
  wallFriction: number;
  waveHeight: number;
  waveSpeed: number;
  waveFreq: number;
  fillLevel: number;
  pressure: number;
  turbulence: number;
  repulsionStrength: number;
  blendMode: 'Additive' | 'Normal';
  backgroundColor: string;
  colorSurface: string;
  colorDeep: string;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
}

export const defaultOceanParams: OceanParams = {
  particleCount: 20000,
  particleSize: 0.25,
  boxSize: 12,
  gravity: 25.0,
  damping: 0.98,
  bounce: 0.2,
  wallFriction: 0.99,
  waveHeight: 1.5,
  waveSpeed: 1.5,
  waveFreq: 0.5,
  fillLevel: -2.0,
  pressure: 8.0,
  turbulence: 1.0,
  repulsionStrength: 6.0,
  blendMode: 'Additive',
  backgroundColor: '#010103',
  colorSurface: '#b3ffff',
  colorDeep: '#001133',
  bloomStrength: 1.5,
  bloomRadius: 0.6,
  bloomThreshold: 0.05,
};

export const previewOceanParams: OceanParams = {
  ...defaultOceanParams,
  particleCount: 8000,
};

// ── Density Grid ──
const GRID_RES = 16;
const GRID_SIZE = GRID_RES * GRID_RES * GRID_RES;

// ── Bloom Post-Processing ──
function BloomEffect({ params }: { params: OceanParams }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      params.bloomStrength,
      params.bloomRadius,
      params.bloomThreshold
    );
    composer.addPass(bloom);
    composerRef.current = composer;
    bloomPassRef.current = bloom;
    return () => { composer.dispose(); };
  }, [gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    if (bloomPassRef.current) {
      bloomPassRef.current.strength = params.bloomStrength;
      bloomPassRef.current.radius = params.bloomRadius;
      bloomPassRef.current.threshold = params.bloomThreshold;
    }
  }, [params.bloomStrength, params.bloomRadius, params.bloomThreshold]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}

// ── Ocean Scene ──
function OceanScene({ params, interactive }: { params: OceanParams; interactive: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const containerRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  const mouseRef = useRef(new THREE.Vector2());
  const tiltTargetRef = useRef(new THREE.Vector2());
  const tiltCurrentRef = useRef(new THREE.Vector2());
  const clockRef = useRef(new THREE.Clock());

  // Particle data refs
  const velocitiesRef = useRef<Float32Array | null>(null);
  const randomsRef = useRef<Float32Array | null>(null);
  const densityGridRef = useRef(new Int16Array(GRID_SIZE));
  const prevParticleCountRef = useRef(0);

  // Color scratch
  const colorSurfaceRef = useRef(new THREE.Color(params.colorSurface));
  const colorDeepRef = useRef(new THREE.Color(params.colorDeep));
  const tempColorRef = useRef(new THREE.Color());

  // Update colors on param change
  useEffect(() => {
    colorSurfaceRef.current.set(params.colorSurface);
    colorDeepRef.current.set(params.colorDeep);
  }, [params.colorSurface, params.colorDeep]);

  // Background & fog
  useEffect(() => {
    scene.background = new THREE.Color(params.backgroundColor);
    scene.fog = new THREE.FogExp2(params.backgroundColor, 0.03);
  }, [params.backgroundColor, scene]);

  // Init particles
  const initParticles = useCallback((count: number, boxSize: number) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const spawnSize = boxSize * 0.9;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spawnSize;
      positions[i3 + 1] = (Math.random() * 0.5 - 0.5) * spawnSize;
      positions[i3 + 2] = (Math.random() - 0.5) * spawnSize;
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
      colors[i3] = 0; colors[i3 + 1] = 0.5; colors[i3 + 2] = 1.0;
      randoms[i] = 0.5 + Math.random();
    }
    velocitiesRef.current = velocities;
    randomsRef.current = randoms;
    return { positions, colors };
  }, []);

  const { positions: initPositions, colors: initColors } = useMemo(
    () => initParticles(params.particleCount, params.boxSize),
    [params.particleCount, params.boxSize, initParticles]
  );

  // Particle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Container geometry
  const { containerEdges, innerGeo, outerEdges, boxSize } = useMemo(() => {
    const s = params.boxSize;
    const geo = new THREE.BoxGeometry(s, s, s);
    const edges = new THREE.EdgesGeometry(geo);
    const innerS = s * 0.96;
    const inner = new THREE.BoxGeometry(innerS, innerS, innerS);
    const outerS = s * 1.05;
    const outerGeo = new THREE.BoxGeometry(outerS, outerS, outerS);
    const outer = new THREE.EdgesGeometry(outerGeo);
    return { containerEdges: edges, innerGeo: inner, outerEdges: outer, boxSize: s };
  }, [params.boxSize]);

  // Mouse tracking
  useEffect(() => {
    if (!interactive) return;
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
  }, [interactive]);

  // Physics frame
  useFrame(() => {
    if (!pointsRef.current || !velocitiesRef.current || !randomsRef.current) return;
    const dt = Math.min(clockRef.current.getDelta(), 0.05);
    const time = clockRef.current.getElapsedTime();

    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colArr = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const vel = velocitiesRef.current;
    const rnd = randomsRef.current;
    const grid = densityGridRef.current;

    // Tilt
    tiltTargetRef.current.x = mouseRef.current.y * 0.6;
    tiltTargetRef.current.y = mouseRef.current.x * 0.6;
    tiltCurrentRef.current.x += (tiltTargetRef.current.x - tiltCurrentRef.current.x) * 0.05;
    tiltCurrentRef.current.y += (tiltTargetRef.current.y - tiltCurrentRef.current.y) * 0.05;

    if (containerRef.current) {
      containerRef.current.rotation.x = tiltCurrentRef.current.x;
      containerRef.current.rotation.z = -tiltCurrentRef.current.y;
    }

    const physicsBound = (params.boxSize * 0.96) / 2;
    const gridSizeHalf = params.boxSize / 2;

    const gravVec = new THREE.Vector3(0, -1, 0).normalize();
    gravVec.applyEuler(new THREE.Euler(-tiltCurrentRef.current.x, 0, tiltCurrentRef.current.y));
    const surfNorm = gravVec.clone().negate();

    const gx = gravVec.x * params.gravity;
    const gy = gravVec.y * params.gravity;
    const gz = gravVec.z * params.gravity;

    // Pass 1: Density binning
    grid.fill(0);
    const gridScale = GRID_RES / params.boxSize;
    const pc = params.particleCount;

    for (let i = 0; i < pc; i++) {
      const i3 = i * 3;
      let gxi = Math.floor((posArr[i3] + gridSizeHalf) * gridScale);
      let gyi = Math.floor((posArr[i3 + 1] + gridSizeHalf) * gridScale);
      let gzi = Math.floor((posArr[i3 + 2] + gridSizeHalf) * gridScale);
      if (gxi < 0) gxi = 0; else if (gxi >= GRID_RES) gxi = GRID_RES - 1;
      if (gyi < 0) gyi = 0; else if (gyi >= GRID_RES) gyi = GRID_RES - 1;
      if (gzi < 0) gzi = 0; else if (gzi >= GRID_RES) gzi = GRID_RES - 1;
      grid[gxi + gyi * GRID_RES + gzi * GRID_RES * GRID_RES]++;
    }

    const _cSurf = colorSurfaceRef.current;
    const _cDeep = colorDeepRef.current;
    const _tmp = tempColorRef.current;

    // Pass 2: Integration
    for (let i = 0; i < pc; i++) {
      const i3 = i * 3;
      let x = posArr[i3], y = posArr[i3 + 1], z = posArr[i3 + 2];
      let vx = vel[i3], vy = vel[i3 + 1], vz = vel[i3 + 2];
      const r = rnd[i];

      // Gravity
      vx += gx * dt; vy += gy * dt; vz += gz * dt;

      // Density pressure
      let gxi = Math.floor((x + gridSizeHalf) * gridScale);
      let gyi = Math.floor((y + gridSizeHalf) * gridScale);
      let gzi = Math.floor((z + gridSizeHalf) * gridScale);
      if (gxi < 0) gxi = 0; if (gxi >= GRID_RES) gxi = GRID_RES - 1;
      if (gyi < 0) gyi = 0; if (gyi >= GRID_RES) gyi = GRID_RES - 1;
      if (gzi < 0) gzi = 0; if (gzi >= GRID_RES) gzi = GRID_RES - 1;
      const cIdx = gxi + gyi * GRID_RES + gzi * GRID_RES * GRID_RES;
      const density = grid[cIdx];

      if (density > 5) {
        const left = gxi > 0 ? grid[cIdx - 1] : 999;
        const right = gxi < GRID_RES - 1 ? grid[cIdx + 1] : 999;
        const down = gyi > 0 ? grid[cIdx - GRID_RES] : 999;
        const up = gyi < GRID_RES - 1 ? grid[cIdx + GRID_RES] : 999;
        const back = gzi > 0 ? grid[cIdx - GRID_RES * GRID_RES] : 999;
        const fwd = gzi < GRID_RES - 1 ? grid[cIdx + GRID_RES * GRID_RES] : 999;

        if (left < density) vx -= params.repulsionStrength * dt;
        if (right < density) vx += params.repulsionStrength * dt;
        if (down < density) vy -= params.repulsionStrength * dt;
        if (up < density) vy += params.repulsionStrength * dt;
        if (back < density) vz -= params.repulsionStrength * dt;
        if (fwd < density) vz += params.repulsionStrength * dt;

        vx += (Math.random() - 0.5) * dt * 2;
        vy += (Math.random() - 0.5) * dt * 2;
        vz += (Math.random() - 0.5) * dt * 2;
      }

      // Surface / buoyancy
      const myHeight = x * surfNorm.x + y * surfNorm.y + z * surfNorm.z;
      const waveY = Math.sin(x * params.waveFreq + time * params.waveSpeed + r * 1.5) *
        Math.cos(z * params.waveFreq + time * params.waveSpeed * 0.7);
      const dynamicSurface = params.fillLevel + waveY * params.waveHeight;

      if (myHeight < dynamicSurface) {
        const depth = dynamicSurface - myHeight;
        const buoy = depth * params.pressure * 2;
        vx += surfNorm.x * buoy * dt;
        vy += surfNorm.y * buoy * dt;
        vz += surfNorm.z * buoy * dt;
        vx *= 0.97; vy *= 0.97; vz *= 0.97;
      }

      // Turbulence
      const turb = params.turbulence * 0.5;
      if (turb > 0) {
        vx += Math.sin(y * 2 + time * 1.5 + r) * 0.02 * turb * r;
        vy += Math.cos(z * 2 + time * 1.5 + r) * 0.02 * turb * r;
        vz += Math.sin(x * 2 + time * 1.5 + r) * 0.02 * turb * r;
      }

      // Integrate
      x += vx * dt; y += vy * dt; z += vz * dt;

      // Collision
      const b = params.bounce;
      const fric = params.wallFriction;
      if (x < -physicsBound) { x = -physicsBound; vx *= -b; vy *= fric; vz *= fric; }
      else if (x > physicsBound) { x = physicsBound; vx *= -b; vy *= fric; vz *= fric; }
      if (y < -physicsBound) { y = -physicsBound; vy *= -b; vx *= fric; vz *= fric; }
      else if (y > physicsBound) { y = physicsBound; vy *= -b; vx *= fric; vz *= fric; }
      if (z < -physicsBound) { z = -physicsBound; vz *= -b; vx *= fric; vy *= fric; }
      else if (z > physicsBound) { z = physicsBound; vz *= -b; vx *= fric; vy *= fric; }

      // Damping
      const d = params.damping - (1.5 - r) * 0.005;
      vx *= d; vy *= d; vz *= d;

      // Color
      let cr = (myHeight - (dynamicSurface - 8)) / 8;
      cr += (Math.abs(vx) + Math.abs(vy) + Math.abs(vz)) * 0.1;
      cr = Math.max(0, Math.min(1, cr));
      _tmp.lerpColors(_cDeep, _cSurf, cr);

      colArr[i3] = _tmp.r; colArr[i3 + 1] = _tmp.g; colArr[i3 + 2] = _tmp.b;
      posArr[i3] = x; posArr[i3 + 1] = y; posArr[i3 + 2] = z;
      vel[i3] = vx; vel[i3 + 1] = vy; vel[i3 + 2] = vz;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  // Update material blend mode
  useEffect(() => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.blending = params.blendMode === 'Additive' ? THREE.AdditiveBlending : THREE.NormalBlending;
    mat.opacity = params.blendMode === 'Additive' ? 0.8 : 0.9;
    mat.needsUpdate = true;
  }, [params.blendMode]);

  // Update particle size
  useEffect(() => {
    if (!pointsRef.current) return;
    (pointsRef.current.material as THREE.PointsMaterial).size = params.particleSize;
  }, [params.particleSize]);

  return (
    <>
      <BloomEffect params={params} />

      <group ref={containerRef}>
        {/* Wireframe container */}
        <lineSegments geometry={containerEdges}>
          <lineBasicMaterial color={0x00aaff} opacity={0.5} transparent />
        </lineSegments>

        {/* Inner glass */}
        <mesh geometry={innerGeo}>
          <meshBasicMaterial color={0x001122} transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Outer accents */}
        <lineSegments geometry={outerEdges}>
          <lineBasicMaterial color={0xff00aa} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </lineSegments>

        {/* Particles */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[initPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[initColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={params.particleSize}
            map={particleTexture}
            vertexColors
            blending={params.blendMode === 'Additive' ? THREE.AdditiveBlending : THREE.NormalBlending}
            depthWrite={false}
            transparent
            opacity={0.8}
          />
        </points>
      </group>

      {/* Grid floor */}
      <gridHelper args={[60, 60, 0x0044aa, 0x050510]} position={[0, -10, 0]} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxDistance={40}
        enabled={interactive}
      />
    </>
  );
}

// ── Main Export ──
interface Props {
  className?: string;
  params?: OceanParams;
  interactive?: boolean;
}

export default function HolographicOcean({ className, params = defaultOceanParams, interactive = true }: Props) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', pointerEvents: interactive ? 'auto' : 'none' }}>
      <Canvas
        camera={{ position: [0, 4, 22], fov: 55, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          toneMapping: THREE.ReinhardToneMapping,
          toneMappingExposure: 1.0,
        }}
        frameloop="always"
      >
        <OceanScene params={params} interactive={interactive} />
      </Canvas>
    </div>
  );
}
