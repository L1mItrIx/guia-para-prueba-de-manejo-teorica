"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Maniobra } from "@/content/schema";
import type { Recorrido } from "@/lib/rutas";
import { Etiqueta3D } from "./Etiqueta3D";

const FLECHA: Record<Maniobra, string> = { recto: "↑", derecha: "↱", izquierda: "↰" };

/**
 * Carro procedural (≈ 4,4 × 1,8 × 1,5 m). Su posición sale de la línea de tiempo:
 * `obtenerS()` devuelve los metros recorridos sobre `recorrido` en el instante actual.
 */
export function Carro3D({
  recorrido,
  obtenerS,
  estaMoviendo,
  animando,
  color,
  nombre,
  maniobra,
  emergencia = false,
  etiqueta = true,
}: {
  recorrido: Recorrido;
  obtenerS: () => number;
  estaMoviendo: () => boolean;
  animando: boolean;
  color: string;
  nombre: string;
  maniobra?: Maniobra;
  emergencia?: boolean;
  etiqueta?: boolean;
}) {
  const grupo = useRef<THREE.Group>(null);
  const carroceria = useRef<THREE.MeshStandardMaterial>(null);
  const luzA = useRef<THREE.MeshStandardMaterial>(null);
  const luzB = useRef<THREE.MeshStandardMaterial>(null);
  const inicial = recorrido.en(obtenerS());

  useFrame((raiz) => {
    const g = grupo.current;
    if (!g) return;
    const p = recorrido.en(obtenerS());
    g.position.set(p.x, 0, p.z);
    g.rotation.y = p.angulo;
    if (carroceria.current) carroceria.current.emissiveIntensity = animando && estaMoviendo() ? 0.16 : 0;
    if (emergencia && luzA.current && luzB.current) {
      const on = !animando || Math.floor(raiz.clock.elapsedTime * 4) % 2 === 0;
      luzA.current.emissiveIntensity = on ? 2.5 : 0.2;
      luzB.current.emissiveIntensity = on ? 0.2 : 2.5;
    }
  });

  const largo = emergencia ? 5 : 4.4;
  return (
    <group ref={grupo} position={[inicial.x, 0, inicial.z]} rotation-y={inicial.angulo}>
      <mesh position-y={0.62} castShadow>
        <boxGeometry args={[1.8, 0.7, largo]} />
        <meshStandardMaterial ref={carroceria} color={color} roughness={0.45} metalness={0.2} emissive="#ffffff" emissiveIntensity={0} />
      </mesh>
      <mesh position={[0, 1.22, emergencia ? -0.6 : 0.25]} castShadow>
        <boxGeometry args={[1.62, emergencia ? 0.9 : 0.6, emergencia ? 3.2 : 2.2]} />
        <meshStandardMaterial color={emergencia ? "#f4f4f4" : "#2a3242"} roughness={0.2} metalness={0.5} />
      </mesh>
      {emergencia && (
        <>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.82, 0.18, 5.02]} />
            <meshStandardMaterial color="#c8102e" />
          </mesh>
          <mesh position={[-0.4, 1.78, -1.6]}>
            <boxGeometry args={[0.6, 0.18, 0.3]} />
            <meshStandardMaterial ref={luzA} color="#ff2a2a" emissive="#ff2a2a" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.4, 1.78, -1.6]}>
            <boxGeometry args={[0.6, 0.18, 0.3]} />
            <meshStandardMaterial ref={luzB} color="#2a6bff" emissive="#2a6bff" emissiveIntensity={0.2} />
          </mesh>
        </>
      )}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.65, -(largo / 2 + 0.01)]}>
          <boxGeometry args={[0.35, 0.18, 0.04]} />
          <meshStandardMaterial color="#fff6cc" emissive="#fff6cc" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {[
        [-0.92, 1.4],
        [0.92, 1.4],
        [-0.92, -1.4],
        [0.92, -1.4],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.36, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.28, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {etiqueta && (
        <Etiqueta3D texto={`${nombre.replace(/^Carro /, "")}${maniobra ? ` ${FLECHA[maniobra]}` : ""}`} fondo={color} color={contraste(color)} />
      )}
    </group>
  );
}

function contraste(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.6 ? "#111" : "#fff";
}
