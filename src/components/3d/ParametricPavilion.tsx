import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const params = {
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
};

function createHollowBrickGeometry(width: number, height: number, depth: number, thickness: number) {
  const geometries: THREE.BoxGeometry[] = [];

  const top = new THREE.BoxGeometry(width, thickness, depth);
  top.translate(0, height / 2 - thickness / 2, 0);
  geometries.push(top);

  const bottom = new THREE.BoxGeometry(width, thickness, depth);
  bottom.translate(0, -height / 2 + thickness / 2, 0);
  geometries.push(bottom);

  const left = new THREE.BoxGeometry(thickness, height - 2 * thickness, depth);
  left.translate(-width / 2 + thickness / 2, 0, 0);
  geometries.push(left);

  const right = new THREE.BoxGeometry(thickness, height - 2 * thickness, depth);
  right.translate(width / 2 - thickness / 2, 0, 0);
  geometries.push(right);

  return mergeGeometries(geometries);
}

function Pavilion() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const timeRef = useRef(14.0);

  const { brickGeometry, totalInstances } = useMemo(() => {
    const geo = createHollowBrickGeometry(
      params.brickWidth,
      params.brickHeight,
      params.brickDepth,
      params.brickThickness
    );
    const total = params.brickCountX * params.brickCountY * 2;
    return { brickGeometry: geo, totalInstances: total };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    let idx = 0;

    for (let y = 0; y < params.brickCountY; y++) {
      const ny = y / params.brickCountY;
      const unzipFactor = Math.pow(Math.max(0, 1 - ny), params.voidTaper);

      for (let x = 0; x < params.brickCountX; x++) {
        const cx = x - params.brickCountX / 2;
        const posX = cx * (params.brickWidth + params.spacing);
        const relativeX = posX - params.voidOffset;
        const rowOffsetX = (y % 2) * (params.brickWidth / 2);
        const posY = y * (params.brickHeight + params.spacing);

        const gaussian = Math.exp(-Math.pow(relativeX / params.voidSpread, 2));
        const aperture = params.cavityWidth * unzipFactor * gaussian;

        const slopeFactor = -2 * relativeX / (params.voidSpread * params.voidSpread);
        const slope = aperture * slopeFactor * 0.5;
        const angle = Math.atan(slope);

        // Front
        dummy.position.set(posX + rowOffsetX, posY, aperture / 2);
        dummy.rotation.set(0, angle, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx++, dummy.matrix);

        // Back
        dummy.position.set(posX + rowOffsetX, posY, -aperture / 2);
        dummy.rotation.set(0, -angle, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx++, dummy.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  const { scene } = useThree();

  useFrame(() => {
    timeRef.current += 0.01;
    if (timeRef.current > 20) timeRef.current = 6;

    if (!sunRef.current) return;

    const hourAngle = (timeRef.current - 12) * (Math.PI / 12);
    const maxElevation = THREE.MathUtils.degToRad(30 + 0.5 * 45);
    const elevation = Math.cos(hourAngle) * maxElevation;
    const azimuth = Math.sin(hourAngle);
    const sunDist = 80;

    sunRef.current.position.x = Math.sin(azimuth) * Math.cos(elevation) * sunDist;
    sunRef.current.position.y = Math.sin(elevation) * sunDist;
    sunRef.current.position.z = Math.cos(azimuth) * Math.cos(elevation) * sunDist;

    if (sunRef.current.position.y < 0) {
      sunRef.current.intensity = 0;
    } else {
      const horizonFactor = Math.max(0, Math.min(1, sunRef.current.position.y / 10));
      sunRef.current.intensity = horizonFactor * 2.5;

      const sunColor = new THREE.Color(0xfffaed);
      const sunsetColor = new THREE.Color(0xffaa00);
      sunRef.current.color.lerpColors(sunsetColor, sunColor, horizonFactor);
    }

    const clearSky = new THREE.Color(0x87ceeb);
    const nightSky = new THREE.Color(0x050510);
    const skyColor = sunRef.current.position.y < 0 ? nightSky : clearSky;
    scene.background = skyColor;
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color = skyColor;
    }
  });

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x444444, 0.4]} />
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

      <instancedMesh
        ref={meshRef}
        args={[brickGeometry, undefined, totalInstances]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={0xffffff}
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color={0x222222} roughness={0.8} metalness={0} />
      </mesh>
    </>
  );
}

interface ParametricPavilionProps {
  className?: string;
}

export default function ParametricPavilion({ className }: ParametricPavilionProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 5, 35], fov: 45, near: 0.1, far: 200 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x87ceeb);
          scene.fog = new THREE.FogExp2(0x87ceeb, 0.02);
        }}
      >
        <Pavilion />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.02}
          target={[0, 6, 0]}
        />
      </Canvas>
    </div>
  );
}
