"use client";

import { BORDE_CRUCE, CARRIL, LARGO_CALLE, LINEA_PARADA } from "@/lib/rutas";
import type { Direccion } from "@/content/schema";
import { DIST_PASO_PEATONAL } from "./Peaton3D";

const ANCHO = CARRIL * 2;
const LARGO = LARGO_CALLE * 2 + 10;

/** Cruce de dos calles de doble sentido. Norte = -z. */
const ASFALTO = "#3d4048";
const ASFALTO_SECUNDARIA = "#5f6370";
const BRAZO: Record<Direccion, { pos: [number, number]; rot: number }> = {
  norte: { pos: [0, -(BORDE_CRUCE + LARGO_CALLE / 2)], rot: 0 },
  sur: { pos: [0, BORDE_CRUCE + LARGO_CALLE / 2], rot: 0 },
  este: { pos: [BORDE_CRUCE + LARGO_CALLE / 2, 0], rot: Math.PI / 2 },
  oeste: { pos: [-(BORDE_CRUCE + LARGO_CALLE / 2), 0], rot: Math.PI / 2 },
};

/** Franjas de un paso peatonal (cebra) sobre el brazo `d`. */
function PasoPeatonal({ d }: { d: Direccion }) {
  const franjas = 7;
  const vertical = d === "norte" || d === "sur";
  const signo = d === "sur" || d === "este" ? 1 : -1;
  return (
    <group>
      {Array.from({ length: franjas }, (_, k) => {
        const off = -CARRIL + 0.5 + (k * (2 * CARRIL - 1)) / (franjas - 1);
        const x = vertical ? off : signo * DIST_PASO_PEATONAL;
        const z = vertical ? signo * DIST_PASO_PEATONAL : off;
        return (
          <mesh key={k} rotation-x={-Math.PI / 2} position={[x, 0.013, z]}>
            <planeGeometry args={vertical ? [0.5, 1.5] : [1.5, 0.5]} />
            <meshBasicMaterial color="#f4f4f4" />
          </mesh>
        );
      })}
    </group>
  );
}

export function Interseccion({
  lineasParada = [],
  tipoVia = {},
  pasosPeatonales = [],
}: {
  lineasParada?: Direccion[];
  tipoVia?: Partial<Record<Direccion, "primaria" | "secundaria">>;
  pasosPeatonales?: Direccion[];
}) {
  return (
    <group>
      {/* Zacate */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[LARGO, LARGO]} />
        <meshStandardMaterial color="#7fb069" />
      </mesh>
      {/* Calles: cuadro central + cuatro brazos (las vías secundarias, más claras) */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[ANCHO, ANCHO]} />
        <meshStandardMaterial color={ASFALTO} />
      </mesh>
      {(Object.keys(BRAZO) as Direccion[]).map((d) => (
        <mesh key={d} rotation={[-Math.PI / 2, 0, BRAZO[d].rot]} position={[BRAZO[d].pos[0], 0.001, BRAZO[d].pos[1]]} receiveShadow>
          <planeGeometry args={[ANCHO, LARGO_CALLE]} />
          <meshStandardMaterial color={tipoVia[d] === "secundaria" ? ASFALTO_SECUNDARIA : ASFALTO} />
        </mesh>
      ))}
      {pasosPeatonales.map((d) => (
        <PasoPeatonal key={d} d={d} />
      ))}
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
