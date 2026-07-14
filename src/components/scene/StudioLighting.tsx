"use client";

import { Environment, Lightformer, ContactShadows } from "@react-three/drei";

/**
 * Warm studio lighting rig: a soft key light with realistic shadow falloff,
 * a gentle rim to separate the machine from the backdrop, and Lightformer
 * panels feeding a matching HDRI reflection so metal/glass surfaces pick up
 * believable warm highlights instead of flat PBR.
 */
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#fff4e2" />

      {/* Key light - soft warm, casts the primary shadow */}
      <directionalLight
        position={[3.2, 6, 3.5]}
        intensity={1.4}
        color="#fff1dd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Fill light - cool-neutral, low intensity, no shadow */}
      <directionalLight position={[-4, 3, 2]} intensity={0.35} color="#eef1f6" />

      {/* Rim light from behind to separate machine silhouette from wall */}
      <pointLight position={[0, 3.2, -3.5]} intensity={8} color="#ffd8a0" distance={9} decay={2} />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={12}
        blur={2.4}
        far={4}
        resolution={256}
        color="#2a2015"
      />

      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#fff6e8"
          position={[0, 5, 2]}
          scale={[6, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#e8f0ff"
          position={[-5, 2, 1]}
          scale={[3, 4, 1]}
          rotation-y={Math.PI / 2.4}
        />
        <Lightformer
          form="ring"
          intensity={1.1}
          color="#ffdca8"
          position={[0, 1.5, -4]}
          scale={4}
        />
      </Environment>
    </>
  );
}
