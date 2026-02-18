import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface PavilionParams {
  brickCountX: number;
  brickCountY: number;
  spacing: number;
  brickWidth: number;
  brickHeight: number;
  brickDepth: number;
  brickThickness: number;
  cavityWidth: number;
  voidSpread: number;
  voidTaper: number;
  voidOffset: number;
  timeOfDay: number;
  ambientLight: number;
  bgColor: string;
  animate: boolean;
  speed: number;
}

export const defaultParams: PavilionParams = {
  brickCountX: 60,
  brickCountY: 35,
  spacing: 0.02,
  brickWidth: 0.8,
  brickHeight: 0.5,
  brickDepth: 0.5,
  brickThickness: 0.04,
  cavityWidth: 12,
  voidSpread: 8.0,
  voidTaper: 2.5,
  voidOffset: 0.0,
  timeOfDay: 14.0,
  ambientLight: 0.4,
  bgColor: '#87ceeb',
  animate: true,
  speed: 1,
};

function createHollowBrickGeometry(w: number, h: number, d: number, t: number) {
  const geos: THREE.BoxGeometry[] = [];
  const top = new THREE.BoxGeometry(w, t, d); top.translate(0, h / 2 - t / 2, 0); geos.push(top);
  const bot = new THREE.BoxGeometry(w, t, d); bot.translate(0, -h / 2 + t / 2, 0); geos.push(bot);
  const lft = new THREE.BoxGeometry(t, h - 2 * t, d); lft.translate(-w / 2 + t / 2, 0, 0); geos.push(lft);
  const rgt = new THREE.BoxGeometry(t, h - 2 * t, d); rgt.translate(w / 2 - t / 2, 0, 0); geos.push(rgt);
  return mergeGeometries(geos);
}

function Pavilion({ params }: { params: PavilionParams }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.HemisphereLight>(null);
  const timeRef = useRef(params.timeOfDay);
  const { scene } = useThree();

  const { brickGeometry, totalInstances } = useMemo(() => {
    const geo = createHollowBrickGeometry(params.brickWidth, params.brickHeight, params.brickDepth, params.brickThickness);
    return { brickGeometry: geo, totalInstances: params.brickCountX * params.brickCountY * 2 };
  }, [params.brickWidth, params.brickHeight, params.brickDepth, params.brickThickness, params.brickCountX, params.brickCountY]);

  const buildInstances = useCallback(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let y = 0; y < params.brickCountY; y++) {
      const ny = y / params.brickCountY;
      const unzip = Math.pow(Math.max(0, 1 - ny), params.voidTaper);
      for (let x = 0; x < params.brickCountX; x++) {
        const cx = x - params.brickCountX / 2;
        const posX = cx * (params.brickWidth + params.spacing);
        const relX = posX - params.voidOffset;
        const rowOff = (y % 2) * (params.brickWidth / 2);
        const posY = y * (params.brickHeight + params.spacing);
        const gauss = Math.exp(-Math.pow(relX / params.voidSpread, 2));
        const aperture = params.cavityWidth * unzip * gauss;
        const slope = aperture * (-2 * relX / (params.voidSpread ** 2)) * 0.5;
        const angle = Math.atan(slope);

        dummy.position.set(posX + rowOff, posY, aperture / 2);
        dummy.rotation.set(0, angle, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
        if (idx < totalInstances) meshRef.current.setMatrixAt(idx++, dummy.matrix);

        dummy.position.set(posX + rowOff, posY, -aperture / 2);
        dummy.rotation.set(0, -angle, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
        if (idx < totalInstances) meshRef.current.setMatrixAt(idx++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [params, totalInstances]);

  useEffect(() => { buildInstances(); }, [buildInstances]);

  useEffect(() => { timeRef.current = params.timeOfDay; }, [params.timeOfDay]);

  useFrame((_, delta) => {
    if (params.animate) {
      timeRef.current += delta * params.speed * 0.5;
      if (timeRef.current > 20) timeRef.current = 6;
    }

    if (!sunRef.current || !ambientRef.current) return;
    const t = timeRef.current;
    const hourAngle = (t - 12) * (Math.PI / 12);
    const maxElev = THREE.MathUtils.degToRad(52);
    const elev = Math.cos(hourAngle) * maxElev;
    const az = Math.sin(hourAngle);
    const d = 80;

    sunRef.current.position.set(
      Math.sin(az) * Math.cos(elev) * d,
      Math.sin(elev) * d,
      Math.cos(az) * Math.cos(elev) * d
    );

    if (sunRef.current.position.y < 0) {
      sunRef.current.intensity = 0;
    } else {
      const hf = Math.max(0, Math.min(1, sunRef.current.position.y / 10));
      sunRef.current.intensity = hf * 2.5;
      ambientRef.current.intensity = params.ambientLight;
      sunRef.current.color.lerpColors(new THREE.Color(0xffaa00), new THREE.Color(0xfffaed), hf);
    }

    const bgColor = new THREE.Color(params.bgColor);
    scene.background = bgColor;
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color = bgColor;
      scene.fog.density = 0.02;
    }
  });

  return (
    <>
      <hemisphereLight ref={ambientRef} args={[0xffffff, 0x444444, 0.4]} />
      <directionalLight
        ref={sunRef}
        args={[0xfffaed, 2.5]}
        position={[50, 50, 20]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={150}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <instancedMesh ref={meshRef} args={[brickGeometry, undefined, totalInstances]} castShadow receiveShadow>
        <meshStandardMaterial color={0xffffff} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
      </instancedMesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color={0x222222} roughness={0.8} metalness={0} />
      </mesh>
    </>
  );
}

interface Props {
  className?: string;
  params?: PavilionParams;
  interactive?: boolean;
}

export default function ParametricPavilion({ className, params = defaultParams, interactive = true }: Props) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 5, 35], fov: 45, near: 0.1, far: 200 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x87ceeb);
          scene.fog = new THREE.FogExp2(0x87ceeb, 0.02);
        }}
      >
        <Pavilion params={params} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.02}
          target={[0, 6, 0]}
          enabled={interactive}
        />
      </Canvas>
    </div>
  );
}
