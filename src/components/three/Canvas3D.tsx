"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const CAMARA_BASE: [number, number, number] = [16, 20, 22];

function hayWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Aleja la cámara en pantallas angostas (celular vertical) para que entre toda la escena. */
function AjustarCamara({ base }: { base: [number, number, number] }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const aspecto = size.width / Math.max(size.height, 1);
    const factor = Math.max(1, 1.25 / aspecto);
    camera.position.set(base[0] * factor, base[1] * factor, base[2] * factor);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, base, invalidate]);
  return null;
}

/**
 * Lienzo 3D base del sitio (ver skill animacion-3d).
 * - Solo cliente: impórtalo con next/dynamic y ssr:false.
 * - Si no hay WebGL, muestra `alternativa` (la información nunca depende solo del 3D).
 */
export function Canvas3D({
  children,
  alternativa,
  animando = false,
  etiqueta,
  camara = CAMARA_BASE,
}: {
  children: ReactNode;
  alternativa: ReactNode;
  animando?: boolean;
  etiqueta: string;
  camara?: [number, number, number];
}) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => setWebgl(hayWebGL()), []);

  if (webgl === false) {
    return <div className="rounded-2xl border border-borde bg-superficie-2 p-4 text-sm">{alternativa}</div>;
  }

  return (
    <div className="relative h-[min(62vh,520px)] min-h-72 w-full overflow-hidden rounded-2xl bg-[#bfe3f5] dark:bg-[#1b2b40]" role="img" aria-label={etiqueta} data-testid="canvas-3d">
      {webgl && (
        <Canvas
          shadows
          dpr={[1, 1.75]}
          frameloop={animando ? "always" : "demand"}
          camera={{ position: camara, fov: 40, near: 0.5, far: 200 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <AjustarCamara base={camara} />
          <Suspense fallback={null}>
            <hemisphereLight args={["#ffffff", "#7a8b6f", 0.9]} />
            <directionalLight position={[12, 24, 10]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} />
            {children}
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={14}
            maxDistance={90}
            maxPolarAngle={Math.PI / 2.4}
            target={[0, 0, 0]}
          />
        </Canvas>
      )}
    </div>
  );
}

export default Canvas3D;
