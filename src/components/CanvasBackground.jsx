import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Stars, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { techStack } from "../data/constants";

const TechSphere = ({ position }) => {
  const groupRef = useRef();

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

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.05) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {technicalArsenal.map((tech, i) => (
        <Billboard key={tech} position={points[i]}>
          <Text
            fontSize={0.3}
            color={i % 3 === 0 ? "#F97316" : "#cbd5e1"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            {tech}
          </Text>
        </Billboard>
      ))}
    </group>
  );
};

const DataNodes = () => {
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

  return nodes.map((node, i) => (
    <mesh
      key={i}
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

const CyberRings = () => {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.03;
      ringRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.05) * 0.1 + Math.PI / 2.5;
    }
  });

  return (
    <group ref={ringRef} position={[0, -1.5, -18]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[14, 0.12, 6, 120]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[18, 0.1, 4, 120]} />
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

const MiniSolarSystem = () => {
  const systemRef = useRef();
  const p1Ref = useRef();
  const p2Ref = useRef();
  const p3Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (systemRef.current) {
      systemRef.current.rotation.y = t * 0.04;
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
      <pointLight color="#fde68a" intensity={0.45} distance={8} decay={2} />

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

export const CanvasBackground = () => {
  return (
    <>
      <color attach="background" args={["#05070e"]} />

      <ambientLight intensity={0.22} />
      <directionalLight position={[10, 10, 5]} intensity={0.9} color="#06B6D4" />
      <directionalLight position={[-10, -10, -5]} intensity={0.42} color="#F97316" />
      <pointLight position={[-8, 2, -5]} intensity={0.2} color="#22d3ee" />

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <DataNodes />
      <CyberRings />
      <MiniSolarSystem />
      <TechSphere position={[9.5, -1.2, -6]} />
    </>
  );
};