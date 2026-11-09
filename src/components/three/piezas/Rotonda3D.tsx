"use client";

import type { Direccion } from "@/content/schema";
import { CARRIL, derechaDe } from "@/lib/rutas";
import { ANGULO_BRAZO, LARGO_BRAZO, punto, R_BORDE, R_CEDA, R_ISLA } from "@/lib/rutas-rotonda";
import { SenalFija, ROTACION_ACCESO } from "./Senales3D";

const ASFALTO = "#3d4048";
const BRAZOS: Direccion[] = ["norte", "sur", "este", "oeste"];

/** Rotonda de dos carriles con cuatro brazos de doble sentido y CEDA en cada entrada. */
export function Rotonda3D() {
  const divisiones = 28;
  const rDivision = (R_ISLA + R_BORDE) / 2;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[110, 110]} />
        <meshStandardMaterial color="#7fb069" />
      </mesh>
      {/* Anillo */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <ringGeometry args={[R_ISLA, R_BORDE, 72]} />
        <meshStandardMaterial color={ASFALTO} />
      </mesh>
      {/* Isla central con bordillo */}
      <mesh position-y={0.15} receiveShadow>
        <cylinderGeometry args={[R_ISLA, R_ISLA, 0.3, 48]} />
        <meshStandardMaterial color="#6aa35a" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.31}>
        <ringGeometry args={[R_ISLA - 0.35, R_ISLA, 48]} />
        <meshStandardMaterial color="#e6e1d6" />
      </mesh>
      {/* Línea discontinua entre carriles */}
      {Array.from({ length: divisiones }, (_, k) => {
        const th = (k / divisiones) * Math.PI * 2;
        const p = punto(th, rDivision);
        return (
          <mesh key={k} rotation={[-Math.PI / 2, 0, th]} position={[p.x, 0.012, p.z]}>
            <planeGeometry args={[0.14, 1.1]} />
            <meshBasicMaterial color="#f4f4f4" />
          </mesh>
        );
      })}
      {BRAZOS.map((d) => {
        const th = ANGULO_BRAZO[d];
        const centro = punto(th, R_BORDE - 1 + LARGO_BRAZO / 2);
        const u = punto(th, 1);
        const derecha = derechaDe({ x: -u.x, z: -u.z });
        const ceda = { x: u.x * R_CEDA + derecha.x * (CARRIL / 2), z: u.z * R_CEDA + derecha.z * (CARRIL / 2) };
        const poste = { x: u.x * (R_CEDA + 0.6) + derecha.x * (CARRIL + 0.9), z: u.z * (R_CEDA + 0.6) + derecha.z * (CARRIL + 0.9) };
        return (
          <group key={d}>
            <mesh rotation={[-Math.PI / 2, 0, th + Math.PI / 2]} position={[centro.x, 0.001, centro.z]} receiveShadow>
              <planeGeometry args={[CARRIL * 2, LARGO_BRAZO]} />
              <meshStandardMaterial color={ASFALTO} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, th + Math.PI / 2]} position={[punto(th, R_CEDA + LARGO_BRAZO / 2).x, 0.012, punto(th, R_CEDA + LARGO_BRAZO / 2).z]}>
              <planeGeometry args={[0.15, LARGO_BRAZO - 2]} />
              <meshBasicMaterial color="#f2c230" />
            </mesh>
            {/* Línea de CEDA (discontinua) en el carril de entrada */}
            {[-1.2, 0, 1.2].map((o) => (
              <mesh key={o} rotation={[-Math.PI / 2, 0, th]} position={[ceda.x + derecha.x * o, 0.013, ceda.z + derecha.z * o]}>
                <planeGeometry args={[0.35, 0.8]} />
                <meshBasicMaterial color="#f4f4f4" />
              </mesh>
            ))}
            <group position={[poste.x, 0, poste.z]} rotation-y={ROTACION_ACCESO[d]}>
              <SenalFija tipo="ceda" />
            </group>
          </group>
        );
      })}
    </group>
  );
}
