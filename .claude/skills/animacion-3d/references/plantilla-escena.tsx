"use client";
/**
 * PLANTILLA de escena 3D interactiva (copiar a src/components/three/escenas/<Nombre>.tsx).
 * Ciclo: pregunta → el usuario elige → se anima lo correcto → se explica el porqué (con fuente).
 * Ejemplo completo y real: src/components/three/escenas/EscenaInterseccion.tsx
 *
 * Y un cargador solo-cliente (src/components/three/escenas/Cargar<Nombre>.tsx):
 *   const Escena = dynamic(() => import("./<Nombre>"), { ssr: false, loading: () => <Esqueleto/> });
 */
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { Canvas3D } from "@/components/three/Canvas3D";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Fase = "elegir" | "animando" | "terminado";

function ObjetoAnimado({ fase, alTerminar }: { fase: Fase; alTerminar: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current || fase !== "animando") return;
    t.current = Math.min(1, t.current + delta / 2); // 2 s, independiente de los fps
    ref.current.position.x = -5 + 10 * t.current;
    if (t.current >= 1) alTerminar();
  });
  return (
    <mesh ref={ref} position={[fase === "terminado" ? 5 : -5, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2f6fdb" />
    </mesh>
  );
}

export default function PlantillaEscena() {
  const reducir = useReducedMotion();
  const [fase, setFase] = useState<Fase>("elegir");
  const empezar = () => setFase(reducir ? "terminado" : "animando");

  return (
    <div className="space-y-3">
      <Canvas3D
        animando={fase === "animando"}
        etiqueta="Descripción completa de lo que muestra la escena, para lectores de pantalla"
        alternativa={<p>Texto que explica la misma situación cuando no hay WebGL.</p>}
      >
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#7fb069" />
        </mesh>
        <ObjetoAnimado fase={fase} alTerminar={() => setFase("terminado")} />
      </Canvas3D>
      {/* Toda acción del canvas tiene su botón HTML equivalente */}
      <button type="button" onClick={empezar} disabled={fase !== "elegir"}>
        Responder
      </button>
      {fase === "terminado" && <p role="status">Explicación + fuente (desde content/, nunca escrita aquí)</p>}
    </div>
  );
}
