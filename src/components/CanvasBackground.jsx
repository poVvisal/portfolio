/* eslint-disable react-refresh/only-export-components */
import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Stars, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { techStack } from "../data/constants";

/*
Lerp strategy:
- Each scene keeps its own refs and eases opacity, scale, and position toward section targets every frame.
- CanvasBackground only swaps target values when activeSection changes, so transitions stay continuous instead of cutting.

Section mood map:
- hero: all scenes visible at full strength.
- about: stars dimmed, DataNodes softened, other scenes hidden.
- tech: TechSphere moves toward center, CyberRings brighten, other scenes are subdued.
- experience: MiniSolarSystem slides right-center, DataNodes pulse, other scenes are subdued.
- projects: CyberRings and DataNodes are fully lit, TechSphere hides, stars remain present.
- contact: all scenes fade to 20% and stars slow down.
*/

const lerpFrameFactor = (delta, speed = 6) => 1 - Math.exp(-delta * speed);

const clampIntensity = (value) => THREE.MathUtils.clamp(value, 0, 1);

const SECTION_MOODS = {
  hero: {
    stars: { intensity: 1, speed: 1, scale: 1 },
    dataNodes: { intensity: 1, pulse: false },
    cyberRings: { intensity: 1 },
    miniSolarSystem: { intensity: 1, position: [-20, 3.5, -13] },
    techSphere: { intensity: 1, position: [13, -2.5, -6] },
  },
  about: {
    stars: { intensity: 0.6, speed: 0.85, scale: 0.88 },
    dataNodes: { intensity: 0.3, pulse: false },
    cyberRings: { intensity: 0, hidden: true },
    miniSolarSystem: { intensity: 0, hidden: true },
    techSphere: { intensity: 0, hidden: true },
  },
  tech: {
    stars: { intensity: 0.55, speed: 0.75, scale: 0.8 },
    dataNodes: { intensity: 0.25, pulse: false },
    cyberRings: { intensity: 0.85 },
    miniSolarSystem: { intensity: 0.2, position: [-14, 3.1, -13] },
    techSphere: { intensity: 1, position: [4.2, -1.6, -6] },
  },
  experience: {
    stars: { intensity: 0.5, speed: 0.7, scale: 0.78 },
    dataNodes: { intensity: 0.55, pulse: true },
    cyberRings: { intensity: 0.25 },
    miniSolarSystem: { intensity: 1, position: [-4.2, 2.75, -13] },
    techSphere: { intensity: 0.25, position: [11.2, -2.2, -6] },
  },
  projects: {
    stars: { intensity: 1, speed: 0.95, scale: 1 },
    dataNodes: { intensity: 1, pulse: false },
    cyberRings: { intensity: 1 },
    miniSolarSystem: { intensity: 0.2, position: [-12, 3.2, -13] },
    techSphere: { intensity: 0, hidden: true },
  },
  contact: {
    stars: { intensity: 0.2, speed: 0.2, scale: 0.55 },
    dataNodes: { intensity: 0.2, pulse: false },
    cyberRings: { intensity: 0.2 },
    miniSolarSystem: { intensity: 0.2, position: [-16, 3.2, -13] },
    techSphere: { intensity: 0.2, position: [9.5, -2.2, -6] },
  },
};

export const useSceneTransition = (activeSection = "hero") =>
  useMemo(() => SECTION_MOODS[activeSection] ?? SECTION_MOODS.hero, [activeSection]);

const StarsField = ({ intensity, speed, scale = 1 }) => {
  const groupRef = useRef();
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const currentScaleRef = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const smoothing = lerpFrameFactor(delta, 6);
    const starPresence = clampIntensity((clampIntensity(intensity) + clampIntensity(scale)) / 2);
    const targetScale = 0.35 + starPresence * 0.65;
    targetScaleRef.current.setScalar(targetScale);
    currentScaleRef.current.lerp(targetScaleRef.current, smoothing);
    groupRef.current.scale.copy(currentScaleRef.current);
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={speed}
      />
    </group>
  );
};

const TechSphere = ({ intensity = 1, position = [13, -2.5, -6] }) => {
  const groupRef = useRef();
  const targetPositionRef = useRef(new THREE.Vector3(...position));
  const currentPositionRef = useRef(new THREE.Vector3(...position));
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const currentScaleRef = useRef(new THREE.Vector3(1, 1, 1));

  const technicalArsenal = useMemo(() => {
    const items = techStack.flatMap((category) =>
      category.items.map((tool) => tool.name)
    );
    return Array.from(new Set(items));
  }, []);

  const points = useMemo(() => {
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    const sphereRadius = 2.65;

    for (let i = 0; i < technicalArsenal.length; i++) {
      const y = 1 - (i / (technicalArsenal.length - 1)) * 2;
      const pointRadius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * pointRadius,
          y,
          Math.sin(theta) * pointRadius
        ).multiplyScalar(sphereRadius)
      );
    }

    return pts;
  }, [technicalArsenal]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) {
      return;
    }

    const smoothing = lerpFrameFactor(delta, 5.5);
    const visibleIntensity = clampIntensity(intensity);
    const targetScale = visibleIntensity <= 0.001 ? 0.02 : 0.35 + visibleIntensity * 0.65;

    targetPositionRef.current.set(...position);
    targetScaleRef.current.setScalar(targetScale);

    currentPositionRef.current.lerp(targetPositionRef.current, smoothing);
    currentScaleRef.current.lerp(targetScaleRef.current, smoothing);

    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.2;
    groupRef.current.position.copy(currentPositionRef.current);
    groupRef.current.scale.copy(currentScaleRef.current);
  });

  const visibleIntensity = clampIntensity(intensity);

  return (
    <group ref={groupRef} position={[13, -2.5, -6]}>
      {technicalArsenal.map((tech, i) => (
        <Billboard key={tech} position={points[i]}>
          <Text
            fontSize={0.18}
            color={i % 3 === 0 ? "#F97316" : "#cbd5e1"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
            fillOpacity={visibleIntensity}
            outlineOpacity={visibleIntensity}
          >
            {tech}
          </Text>
        </Billboard>
      ))}
    </group>
  );
};

const DataNodes = ({ intensity = 1, pulse = false }) => {
  const nodes = useMemo(
    () => [
      { pos: [-8, 6, -12], color: "#F97316", scale: 0.8 },
      { pos: [8, 5, -10], color: "#06B6D4", scale: 1 },
      { pos: [-6, -5, -8], color: "#cbd5e1", scale: 0.6 },
      { pos: [7, -4, -12], color: "#3b82f6", scale: 0.9 },
      { pos: [0, 8, -15], color: "#10b981", scale: 1.2 },
    ],
    []
  );

  const meshRefs = useRef([]);
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const currentScaleRef = useRef(new THREE.Vector3(1, 1, 1));

  useFrame(({ clock }, delta) => {
    const smoothing = lerpFrameFactor(delta, 7);
    const baseIntensity = clampIntensity(intensity);
    const pulseMix = pulse ? 0.86 + Math.sin(clock.getElapsedTime() * 4.5) * 0.14 : 1;

    meshRefs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const node = nodes[index];
      const targetOpacity = 0.55 * baseIntensity * pulseMix;
      const targetScale = node.scale * (baseIntensity <= 0.001 ? 0.02 : 0.3 + baseIntensity * 0.7) * pulseMix;

      targetScaleRef.current.setScalar(targetScale);
      currentScaleRef.current.lerp(targetScaleRef.current, smoothing);
      mesh.scale.copy(currentScaleRef.current);

      if (mesh.material) {
        mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity ?? 0, targetOpacity, smoothing);
        mesh.material.transparent = true;
      }
    });
  });

  return nodes.map((node, i) => (
    <mesh
      key={i}
      ref={(mesh) => {
        meshRefs.current[i] = mesh;
      }}
      position={node.pos}
      scale={[node.scale, node.scale, node.scale]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={node.color}
        wireframe
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </mesh>
  ));
};

const CyberRings = ({ intensity = 1 }) => {
  const ringRef = useRef();
  const ringMeshesRef = useRef([]);
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const currentScaleRef = useRef(new THREE.Vector3(1, 1, 1));

  useFrame(({ clock }, delta) => {
    if (!ringRef.current) {
      return;
    }

    ringRef.current.rotation.z = clock.getElapsedTime() * 0.03;
    ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1 + Math.PI / 2.5;

    const smoothing = lerpFrameFactor(delta, 6);
    const visibleIntensity = clampIntensity(intensity);
    const targetScale = visibleIntensity <= 0.001 ? 0.02 : 0.4 + visibleIntensity * 0.6;

    targetScaleRef.current.setScalar(targetScale);
    currentScaleRef.current.lerp(targetScaleRef.current, smoothing);
    ringRef.current.scale.copy(currentScaleRef.current);

    ringMeshesRef.current.forEach((mesh, index) => {
      if (!mesh || !mesh.material) {
        return;
      }

      const baseOpacity = index === 0 ? 0.16 : 0.18;
      const targetOpacity = baseOpacity * (0.35 + visibleIntensity * 1.15);
      mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity ?? 0, targetOpacity, smoothing);
      mesh.material.transparent = true;
    });
  });

  return (
    <group ref={ringRef} position={[0, -1.5, -18]}>
      <mesh
        ref={(mesh) => {
          ringMeshesRef.current[0] = mesh;
        }}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[10.5, 0.12, 6, 120]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={(mesh) => {
          ringMeshesRef.current[1] = mesh;
        }}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[13.5, 0.1, 4, 120]} />
        <meshBasicMaterial
          color="#F97316"
          wireframe
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const MiniSolarSystem = ({ intensity = 1, position = [-20, 3.5, -13] }) => {
  const systemRef = useRef();
  const p1Ref = useRef();
  const p2Ref = useRef();
  const p3Ref = useRef();
  const targetPositionRef = useRef(new THREE.Vector3(...position));
  const currentPositionRef = useRef(new THREE.Vector3(...position));
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const currentScaleRef = useRef(new THREE.Vector3(1, 1, 1));

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (systemRef.current) {
      systemRef.current.rotation.y = t * 0.04;

      const smoothing = lerpFrameFactor(delta, 6);
      const visibleIntensity = clampIntensity(intensity);
      const targetScale = visibleIntensity <= 0.001 ? 0.02 : 0.3 + visibleIntensity * 0.7;

      targetPositionRef.current.set(...position);
      targetScaleRef.current.setScalar(targetScale);

      currentPositionRef.current.lerp(targetPositionRef.current, smoothing);
      currentScaleRef.current.lerp(targetScaleRef.current, smoothing);

      systemRef.current.position.copy(currentPositionRef.current);
      systemRef.current.scale.copy(currentScaleRef.current);
    }

    if (p1Ref.current) {
      p1Ref.current.position.x = Math.cos(t * 0.9) * 1.1;
      p1Ref.current.position.z = Math.sin(t * 0.9) * 1.1;
      p1Ref.current.position.y = Math.sin(t * 1.1) * 0.15;
    }

    if (p2Ref.current) {
      p2Ref.current.position.x = Math.cos(t * 0.55 + 1.2) * 1.9;
      p2Ref.current.position.z = Math.sin(t * 0.55 + 1.2) * 1.9;
      p2Ref.current.position.y = Math.cos(t * 0.7) * 0.25;
    }

    if (p3Ref.current) {
      p3Ref.current.position.x = Math.cos(t * 0.3 + 2.4) * 2.7;
      p3Ref.current.position.z = Math.sin(t * 0.3 + 2.4) * 2.7;
      p3Ref.current.position.y = Math.sin(t * 0.45) * 0.3;
    }
  });

  return (
    <group ref={systemRef} position={[-20, 3.5, -13]}>
      <pointLight color="#fde68a" intensity={0.45 * clampIntensity(intensity)} distance={8} decay={2} />

      <mesh>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshBasicMaterial color="#fde68a" toneMapped={false} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.012, 4, 60]} />
        <meshBasicMaterial
          color="#fdab43"
          transparent
          opacity={0.1}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.012, 4, 60]} />
        <meshBasicMaterial
          color="#fdab43"
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.7, 0.012, 4, 60]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.06}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={p1Ref}>
        <sphereGeometry args={[0.085, 8, 8]} />
        <meshBasicMaterial color="#fb923c" toneMapped={false} />
      </mesh>

      <mesh ref={p2Ref}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>

      <mesh ref={p3Ref}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#94a3b8" toneMapped={false} />
      </mesh>
    </group>
  );
};

const CanvasBackgroundView = ({ activeSection = "hero" }) => {
  const scene = useSceneTransition(activeSection);

  return (
    <>
      <color attach="background" args={["#05070e"]} />

      <ambientLight intensity={0.22} />
      <directionalLight position={[10, 10, 5]} intensity={0.9} color="#06B6D4" />
      <directionalLight position={[-10, -10, -5]} intensity={0.42} color="#F97316" />
      <pointLight position={[-8, 2, -5]} intensity={0.2} color="#22d3ee" />

      <StarsField
        intensity={scene.stars.intensity}
        speed={scene.stars.speed}
        scale={scene.stars.scale}
      />

      <DataNodes intensity={scene.dataNodes.intensity} pulse={scene.dataNodes.pulse} />
      <CyberRings intensity={scene.cyberRings.intensity} />
      <MiniSolarSystem
        intensity={scene.miniSolarSystem.intensity}
        position={scene.miniSolarSystem.position}
      />
      <TechSphere
        intensity={scene.techSphere.intensity}
        position={scene.techSphere.position}
      />
    </>
  );
};

export const CanvasBackground = memo(CanvasBackgroundView, (previousProps, nextProps) => {
  return previousProps.activeSection === nextProps.activeSection;
});