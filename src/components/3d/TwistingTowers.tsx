import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ── Types ──
export interface TowerParams {
  numTowers: number;
  height: number;
  twist: number;
  layers: number;
  baseSize: number;
  topSize: number;
  taperStart: number;
  spacing: number;
  arrayType: 'linear' | 'circular' | 'spiral' | 'grid';
  spiralTurns: number;
  verticalOffset: number;
  opacity: number;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  edgeLines: boolean;
  showSlabs: boolean;
  slabFreq: number;
  slabThick: number;
  showPlinth: boolean;
  showBracing: boolean;
  bracingFreq: number;
  showCols: boolean;
  colRadius: number;
  showGround: boolean;
  autoRotate: boolean;
  rotSpeed: number;
  baseColor: string;
  topColor: string;
  slabColor: string;
  plinthColor: string;
  bgColor: string;
  towerFaces: number[];
}

export const defaultTowerParams: TowerParams = {
  numTowers: 3,
  height: 350,
  twist: 2,
  layers: 30,
  baseSize: 50,
  topSize: 20,
  taperStart: 30,
  spacing: 130,
  arrayType: 'linear',
  spiralTurns: 1.5,
  verticalOffset: 30,
  opacity: 1,
  roughness: 0.25,
  metalness: 0.6,
  wireframe: false,
  edgeLines: true,
  showSlabs: true,
  slabFreq: 1,
  slabThick: 2,
  showPlinth: true,
  showBracing: false,
  bracingFreq: 3,
  showCols: false,
  colRadius: 2,
  showGround: true,
  autoRotate: true,
  rotSpeed: 5,
  baseColor: '#ff6b35',
  topColor: '#4ecdc4',
  slabColor: '#303040',
  plinthColor: '#222230',
  bgColor: '#080c14',
  towerFaces: [6, 8, 18],
};

// Reduced params for card preview
export const previewTowerParams: TowerParams = {
  ...defaultTowerParams,
  layers: 18,
  autoRotate: true,
  rotSpeed: 5,
};

// ── Helpers ──
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function hexToInt(hex: string) { return parseInt(hex.replace('#', ''), 16); }
function lerpColor(c1: number, c2: number, t: number) {
  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
  return ((Math.round(lerp(r1, r2, t)) << 16) | (Math.round(lerp(g1, g2, t)) << 8) | Math.round(lerp(b1, b2, t)));
}

interface LayerPt { y: number; sz: number; rot: number; t: number; }

function buildTowerData(P: TowerParams, numFaces: number) {
  const { height, twist, layers, baseSize, topSize, taperStart } = P;
  const taper = taperStart / 100;
  const pts: LayerPt[] = [];
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    const y = t * height;
    let sz: number;
    if (t < taper) sz = baseSize;
    else {
      const tp = (t - taper) / (1 - taper);
      sz = lerp(baseSize, topSize, tp);
    }
    const rot = t * twist * Math.PI;
    pts.push({ y, sz, rot, t });
  }
  return pts;
}

function buildFacadeGeometry(numFaces: number, pts: LayerPt[], baseColor: number, topColor: number) {
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  let vi = 0;

  for (let i = 0; i < pts.length - 1; i++) {
    const lo = pts[i], hi = pts[i + 1];
    for (let f = 0; f < numFaces; f++) {
      const a1 = (f / numFaces) * Math.PI * 2 + lo.rot;
      const a2 = ((f + 1) / numFaces) * Math.PI * 2 + lo.rot;
      const a1h = (f / numFaces) * Math.PI * 2 + hi.rot;
      const a2h = ((f + 1) / numFaces) * Math.PI * 2 + hi.rot;

      const BL = [Math.cos(a1) * lo.sz, lo.y, Math.sin(a1) * lo.sz];
      const BR = [Math.cos(a2) * lo.sz, lo.y, Math.sin(a2) * lo.sz];
      const TL = [Math.cos(a1h) * hi.sz, hi.y, Math.sin(a1h) * hi.sz];
      const TR = [Math.cos(a2h) * hi.sz, hi.y, Math.sin(a2h) * hi.sz];

      const cx = (BL[0] + BR[0] + TL[0] + TR[0]) * 0.25;
      const cz = (BL[2] + BR[2] + TL[2] + TR[2]) * 0.25;
      const nl = Math.sqrt(cx * cx + cz * cz) || 1;
      const nx = cx / nl, nz = cz / nl;

      const c0 = lerpColor(baseColor, topColor, lo.t);
      const c1c = lerpColor(baseColor, topColor, hi.t);
      const cr0 = new THREE.Color(c0), cr1 = new THREE.Color(c1c);

      for (const [p, cr] of [[BL, cr0], [BR, cr0], [TR, cr1], [TL, cr1]] as [number[], THREE.Color][]) {
        positions.push(...p);
        normals.push(nx, 0, nz);
        colors.push(cr.r, cr.g, cr.b);
      }
      indices.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3);
      vi += 4;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildSlabGeometries(numFaces: number, pts: LayerPt[], freq: number, thick: number) {
  const geos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < pts.length; i += freq) {
    const pt = pts[i];
    const positions: number[] = [];
    const indices: number[] = [];
    let vi = 0;
    for (let f = 0; f < numFaces; f++) {
      const a1 = (f / numFaces) * Math.PI * 2 + pt.rot;
      const a2 = ((f + 1) / numFaces) * Math.PI * 2 + pt.rot;
      const r = pt.sz + 1;
      positions.push(0, pt.y + thick, 0, Math.cos(a1) * r, pt.y + thick, Math.sin(a1) * r, Math.cos(a2) * r, pt.y + thick, Math.sin(a2) * r);
      indices.push(vi, vi + 1, vi + 2); vi += 3;
      positions.push(
        Math.cos(a1) * r, pt.y + thick, Math.sin(a1) * r,
        Math.cos(a2) * r, pt.y + thick, Math.sin(a2) * r,
        Math.cos(a2) * r, pt.y, Math.sin(a2) * r,
        Math.cos(a1) * r, pt.y, Math.sin(a1) * r
      );
      indices.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3); vi += 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    geos.push(geo);
  }
  return geos;
}

function buildPlinthGeometry(numFaces: number, pts: LayerPt[]) {
  const base = pts[0];
  const r = base.sz * 1.25;
  const h = 20;
  const positions: number[] = [];
  const indices: number[] = [];
  let vi = 0;
  for (let f = 0; f < numFaces; f++) {
    const a1 = (f / numFaces) * Math.PI * 2;
    const a2 = ((f + 1) / numFaces) * Math.PI * 2;
    positions.push(0, 0, 0, Math.cos(a1) * r, 0, Math.sin(a1) * r, Math.cos(a2) * r, 0, Math.sin(a2) * r);
    indices.push(vi, vi + 1, vi + 2); vi += 3;
    positions.push(
      Math.cos(a1) * r, 0, Math.sin(a1) * r,
      Math.cos(a2) * r, 0, Math.sin(a2) * r,
      Math.cos(a2) * r, -h, Math.sin(a2) * r,
      Math.cos(a1) * r, -h, Math.sin(a1) * r
    );
    indices.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3); vi += 4;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildEdgesGeometry(numFaces: number, pts: LayerPt[]) {
  const verts: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const lo = pts[i], hi = pts[i + 1];
    for (let f = 0; f < numFaces; f++) {
      const a1 = (f / numFaces) * Math.PI * 2 + lo.rot;
      const a1h = (f / numFaces) * Math.PI * 2 + hi.rot;
      verts.push(Math.cos(a1) * lo.sz, lo.y, Math.sin(a1) * lo.sz);
      verts.push(Math.cos(a1h) * hi.sz, hi.y, Math.sin(a1h) * hi.sz);
      if (i === 0 || i % 3 === 0) {
        const a2 = ((f + 1) / numFaces) * Math.PI * 2 + lo.rot;
        verts.push(Math.cos(a1) * lo.sz, lo.y, Math.sin(a1) * lo.sz);
        verts.push(Math.cos(a2) * lo.sz, lo.y, Math.sin(a2) * lo.sz);
      }
    }
  }
  const top = pts[pts.length - 1];
  for (let f = 0; f < numFaces; f++) {
    const a1 = (f / numFaces) * Math.PI * 2 + top.rot;
    const a2 = ((f + 1) / numFaces) * Math.PI * 2 + top.rot;
    verts.push(Math.cos(a1) * top.sz, top.y, Math.sin(a1) * top.sz);
    verts.push(Math.cos(a2) * top.sz, top.y, Math.sin(a2) * top.sz);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

function buildBracingGeometry(numFaces: number, pts: LayerPt[], freq: number) {
  const verts: number[] = [];
  for (let i = 0; i < pts.length - freq; i += freq) {
    const lo = pts[i], hi = pts[i + freq] || pts[pts.length - 1];
    for (let f = 0; f < numFaces; f++) {
      const a1 = (f / numFaces) * Math.PI * 2 + lo.rot;
      const a2 = ((f + 1) / numFaces) * Math.PI * 2 + lo.rot;
      const a1h = (f / numFaces) * Math.PI * 2 + hi.rot;
      const a2h = ((f + 1) / numFaces) * Math.PI * 2 + hi.rot;
      verts.push(Math.cos(a1) * lo.sz, lo.y, Math.sin(a1) * lo.sz, Math.cos(a2h) * hi.sz, hi.y, Math.sin(a2h) * hi.sz);
      verts.push(Math.cos(a2) * lo.sz, lo.y, Math.sin(a2) * lo.sz, Math.cos(a1h) * hi.sz, hi.y, Math.sin(a1h) * hi.sz);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

// ── Tower positions ──
function getTowerPositions(P: TowerParams) {
  const n = P.numTowers;
  const s = P.spacing;
  const positions: { x: number; z: number; y: number }[] = [];
  if (P.arrayType === 'linear') {
    for (let i = 0; i < n; i++) positions.push({ x: (i - (n - 1) / 2) * s, z: 0, y: 0 });
  } else if (P.arrayType === 'circular') {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      positions.push({ x: Math.cos(a) * s, z: Math.sin(a) * s, y: 0 });
    }
  } else if (P.arrayType === 'spiral') {
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0;
      const a = t * P.spiralTurns * Math.PI * 2;
      const r = 60 + t * s;
      positions.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, y: t * P.verticalOffset });
    }
  } else if (P.arrayType === 'grid') {
    const cols = Math.ceil(Math.sqrt(n));
    for (let i = 0; i < n; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      positions.push({ x: (col - (cols - 1) / 2) * s, z: (row - (Math.ceil(n / cols) - 1) / 2) * s, y: 0 });
    }
  }
  return positions;
}

// ── Scene Component ──
function TowerScene({ params }: { params: TowerParams }) {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const { scene } = useThree();

  const baseColorInt = useMemo(() => hexToInt(params.baseColor), [params.baseColor]);
  const topColorInt = useMemo(() => hexToInt(params.topColor), [params.topColor]);

  // Set background
  useEffect(() => {
    scene.background = new THREE.Color(hexToInt(params.bgColor));
  }, [params.bgColor, scene]);

  // Build all tower meshes
  const towerData = useMemo(() => {
    const faces = [...params.towerFaces];
    while (faces.length < params.numTowers) faces.push(6);
    faces.length = params.numTowers;

    const positions = getTowerPositions(params);
    return positions.map((pos, idx) => {
      const numFaces = faces[idx] || 6;
      const pts = buildTowerData(params, numFaces);
      const facadeGeo = buildFacadeGeometry(numFaces, pts, baseColorInt, topColorInt);
      const edgeGeo = params.edgeLines ? buildEdgesGeometry(numFaces, pts) : null;
      const slabGeos = params.showSlabs ? buildSlabGeometries(numFaces, pts, params.slabFreq, params.slabThick) : [];
      const plinthGeo = params.showPlinth ? buildPlinthGeometry(numFaces, pts) : null;
      const bracingGeo = params.showBracing ? buildBracingGeometry(numFaces, pts, params.bracingFreq) : null;
      return { pos, facadeGeo, edgeGeo, slabGeos, plinthGeo, bracingGeo };
    });
  }, [params, baseColorInt, topColorInt]);

  // Auto rotate
  useFrame((_, delta) => {
    if (params.autoRotate && controlsRef.current) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = params.rotSpeed * 0.3;
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-300, 500, 300]}
        intensity={1.4}
        color={0xfff8e7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={2000}
        shadow-camera-left={-600}
        shadow-camera-right={600}
        shadow-camera-top={600}
        shadow-camera-bottom={-600}
      />
      <directionalLight position={[300, 200, -200]} intensity={0.5} color={0x4fc3f7} />
      <directionalLight position={[0, -300, -400]} intensity={0.3} color={0xff8a65} />
      <hemisphereLight args={[0x223355, 0x442211, 0.4]} />

      <group ref={groupRef}>
        {towerData.map((tower, i) => (
          <group key={i} position={[tower.pos.x, tower.pos.y, tower.pos.z]}>
            {/* Facade */}
            <mesh geometry={tower.facadeGeo} castShadow receiveShadow>
              <meshStandardMaterial
                vertexColors
                roughness={params.roughness}
                metalness={params.metalness}
                transparent={params.opacity < 1}
                opacity={params.opacity}
                side={THREE.DoubleSide}
                wireframe={params.wireframe}
              />
            </mesh>

            {/* Edge lines */}
            {tower.edgeGeo && (
              <lineSegments geometry={tower.edgeGeo}>
                <lineBasicMaterial color={0x000000} opacity={0.3} transparent />
              </lineSegments>
            )}

            {/* Slabs */}
            {tower.slabGeos.map((geo, si) => (
              <mesh key={si} geometry={geo} castShadow>
                <meshStandardMaterial color={hexToInt(params.slabColor)} roughness={0.7} metalness={0.1} />
              </mesh>
            ))}

            {/* Plinth */}
            {tower.plinthGeo && (
              <mesh geometry={tower.plinthGeo} castShadow>
                <meshStandardMaterial color={hexToInt(params.plinthColor)} roughness={0.8} metalness={0.1} />
              </mesh>
            )}

            {/* Bracing */}
            {tower.bracingGeo && (
              <lineSegments geometry={tower.bracingGeo}>
                <lineBasicMaterial color={0x889999} opacity={0.6} transparent />
              </lineSegments>
            )}
          </group>
        ))}
      </group>

      {/* Ground */}
      {params.showGround && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2000, 2000]} />
          <meshStandardMaterial color={0x0d0f1a} roughness={0.9} metalness={0.1} />
        </mesh>
      )}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.02}
        target={[0, 150, 0]}
      />
    </>
  );
}

// ── Main Export ──
interface Props {
  className?: string;
  params?: TowerParams;
  interactive?: boolean;
}

export default function TwistingTowers({ className, params = defaultTowerParams, interactive = true }: Props) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', pointerEvents: interactive ? 'auto' : 'none' }}>
      <Canvas
        camera={{ position: [600, 200, 600], fov: 45, near: 0.5, far: 8000 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <TowerScene params={params} />
      </Canvas>
    </div>
  );
}
