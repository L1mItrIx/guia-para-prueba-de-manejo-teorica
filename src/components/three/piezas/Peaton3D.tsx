"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Direccion } from "@/content/schema";
import { BORDE_CRUCE, CARRIL, derechaDe, type V2 } from "@/lib/rutas";

/** Centro del paso peatonal del brazo `d` (entre el cuadro del cruce y la línea de parada). */
export const DIST_PASO_PEATONAL = BORDE_CRUCE + 0.8;
const MEDIO_ANCHO = CARRIL + 1.1;

const AFUERA: Record<Direccion, V2> = { norte: { x: 0, z: -1 }, sur: { x: 0, z: 1 }, este: { x: 1, z: 0 }, oeste: { x: -1, z: 0 } };

/** Extremos del paso peatonal: [inicio, fin] según el sentido (visto desde quien llega por ese brazo). */
export function extremosPaso(d: Direccion, sentido: "a-la-derecha" | "a-la-izquierda"): [V2, V2] {
  const u = AFUERA[d];
  const c = { x: u.x * DIST_PASO_PEATONAL, z: u.z * DIST_PASO_PEATONAL };
  const derechaConductor = derechaDe({ x: -u.x, z: -u.z });
  const a = { x: c.x - derechaConductor.x * MEDIO_ANCHO, z: c.z - derechaConductor.z * MEDIO_ANCHO };
  const b = { x: c.x + derechaConductor.x * MEDIO_ANCHO, z: c.z + derechaConductor.z * MEDIO_ANCHO };
  return sentido === "a-la-derecha" ? [a, b] : [b, a];
}

export function Peaton3D({ paso, sentido, color, obtenerAvance }: { paso: Direccion; sentido: "a-la-derecha" | "a-la-izquierda"; color: string; obtenerAvance: () => number }) {
  const grupo = useRef<THREE.Group>(null);
  const [a, b] = extremosPaso(paso, sentido);
  const angulo = Math.atan2(-(b.x - a.x), -(b.z - a.z));
  useFrame(() => {
    const g = grupo.current;
    if (!g) return;
    const f = obtenerAvance();
    g.position.set(a.x + (b.x - a.x) * f, f > 0 && f < 1 ? Math.abs(Math.sin(f * 40)) * 0.06 : 0, a.z + (b.z - a.z) * f);
  });
  return (
    <group ref={grupo} position={[a.x, 0, a.z]} rotation-y={angulo}>
      <mesh position-y={0.85} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 1.1, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position-y={1.62} castShadow>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color="#e0b48a" />
      </mesh>
      <mesh position-y={0.15}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial color="#2b2b33" />
      </mesh>
    </group>
  );
}
