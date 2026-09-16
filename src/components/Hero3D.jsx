import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";

function CrystalCore() {
  const groupRef = useRef();
  const innerRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.18;
    if (innerRef.current) innerRef.current.rotation.x -= delta * 0.3;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshPhysicalMaterial
            color="#2457d6"
            emissive="#1c3a8f"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.1}
            flatShading
          />
        </mesh>
        <mesh ref={innerRef} scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#7c5cff"
            emissive="#7c5cff"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.6}
            wireframe
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Hero3D() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handler = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return <div className="hero-3d-fallback" aria-hidden="true" />;
  }

  return (
    <Canvas className="hero-3d-canvas" camera={{ position: [0, 0, 4.8], fov: 42 }} dpr={[1, 1.5]} aria-hidden="true">
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1.6} color="#5b8dff" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#7c5cff" />
      <pointLight position={[0, -3, -3]} intensity={0.5} color="#ff6bd6" />
      <Suspense fallback={null}>
        <CrystalCore />
        <Sparkles count={80} scale={5} size={2.5} speed={0.35} color="#8fb4ff" />
      </Suspense>
    </Canvas>
  );
}