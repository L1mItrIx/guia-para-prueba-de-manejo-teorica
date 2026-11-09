"use client";

import { BORDE_CRUCE, CARRIL, LARGO_CALLE, LINEA_PARADA } from "@/lib/rutas";
import type { Direccion } from "@/content/schema";

const ANCHO = CARRIL * 2;
const LARGO = LARGO_CALLE * 2 + 10;

/** Cruce de dos calles de doble sentido. Norte = -z. */
export function Interseccion({ lineasParada = [] }: { lineasParada?: Direccion[] }) {
  return (
    <group>
      {/* Zacate */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[LARGO, LARGO]} />
        <meshStandardMaterial color="#7fb069" />
      </mesh>
      {/* Calles */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[ANCHO, LARGO]} />
        <meshStandardMaterial color="#3d4048" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.001} receiveShadow>
        <planeGeometry args={[LARGO, ANCHO]} />
        <meshStandardMaterial color="#3d4048" />
      </mesh>
      {/* Aceras en las esquinas */}
      {[
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ].map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[sx * (BORDE_CRUCE + 1), 0.08, sz * (BORDE_CRUCE + 1)]} receiveShadow>
          <boxGeometry args={[2, 0.16, 2]} />
          <meshStandardMaterial color="#c9c4b8" />
        </mesh>
      ))}
      {/* Líneas centrales amarillas (fuera del cruce) */}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, s * (BORDE_CRUCE + LARGO_CALLE / 2)]}>
            <planeGeometry args={[0.15, LARGO_CALLE]} />
            <meshBasicMaterial color="#f2c230" />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[s * (BORDE_CRUCE + LARGO_CALLE / 2), 0.01, 0]}>
            <planeGeometry args={[LARGO_CALLE, 0.15]} />
            <meshBasicMaterial color="#f2c230" />
          </mesh>
        </group>
      ))}
      {/* Líneas de parada blancas en los accesos con control */}
      {lineasParada.map((d) => {
        const ancho = CARRIL;
        const pos: Record<Direccion, [number, number, number, number]> = {
          sur: [CARRIL / 2, 0.012, LINEA_PARADA, 0],
          norte: [-CARRIL / 2, 0.012, -LINEA_PARADA, 0],
          este: [LINEA_PARADA, 0.012, -CARRIL / 2, Math.PI / 2],
          oeste: [-LINEA_PARADA, 0.012, CARRIL / 2, Math.PI / 2],
        };
        const [x, y, z, rot] = pos[d];
        return (
          <mesh key={d} rotation={[-Math.PI / 2, 0, rot]} position={[x, y, z]}>
            <planeGeometry args={[ancho, 0.45]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
}
