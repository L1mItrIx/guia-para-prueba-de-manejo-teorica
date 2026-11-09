"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Maniobra } from "@/content/schema";
import { posicionEnRuta, type V2 } from "@/lib/rutas";
import { Etiqueta3D } from "./Etiqueta3D";

const FLECHA: Record<Maniobra, string> = { recto: "↑", derecha: "↱", izquierda: "↰" };
const DURACION = 3.2; // segundos para recorrer la ruta

/**
 * Carro procedural (≈ 4,4 × 1,8 × 1,5 m).
 * estado: "esperando" (en la línea de parada), "moviendo" (recorre la ruta) o "llego" (al final de la ruta).
 */
export type EstadoCarro = "esperando" | "moviendo" | "llego";

export function Carro3D({
  ruta,
  color,
  nombre,
  maniobra,
  emergencia = false,
  estado,
  resaltado,
  alTerminar,
  alElegir,
  mostrarEtiqueta,
}: {
  ruta: V2[];
  color: string;
  nombre: string;
  maniobra: Maniobra;
  emergencia?: boolean;
  estado: EstadoCarro;
  resaltado: boolean;
  alTerminar: () => void;
  alElegir?: () => void;
  mostrarEtiqueta: boolean;
}) {
  const grupo = useRef<THREE.Group>(null);
  const luzA = useRef<THREE.MeshStandardMaterial>(null);
  const luzB = useRef<THREE.MeshStandardMaterial>(null);
  const t = useRef(0);
  const avisado = useRef(false);
  const [hover, setHover] = useState(false);

  const inicio = useMemo(() => posicionEnRuta(ruta, 0), [ruta]);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => () => void (document.body.style.cursor = ""), []);

  // Con frameloop="demand", ubicar el carro y pedir un cuadro cuando cambia el estado.
  useEffect(() => {
    const g = grupo.current;
    if (estado === "moviendo") {
      t.current = 0; // cada recorrido empieza en la línea de parada
      avisado.current = false;
      return;
    }
    if (!g) return;
    t.current = estado === "llego" ? 1 : 0;
    const p = posicionEnRuta(ruta, t.current);
    g.position.set(p.x, 0, p.z);
    g.rotation.y = p.angulo;
    invalidate();
  }, [estado, ruta, invalidate]);

  useFrame((raiz, delta) => {
    const g = grupo.current;
    if (!g) return;
    if (estado === "llego") t.current = 1;
    else if (estado === "moviendo") t.current = Math.min(1, t.current + delta / DURACION);
    else t.current = 0;
    const p = posicionEnRuta(ruta, easeInOut(t.current));
    g.position.set(p.x, 0, p.z);
    g.rotation.y = p.angulo;
    if (estado === "moviendo" && t.current >= 1 && !avisado.current) {
      avisado.current = true;
      alTerminar();
    }
    if (estado === "esperando") avisado.current = false;
    if (emergencia && luzA.current && luzB.current) {
      const on = Math.floor(raiz.clock.elapsedTime * 4) % 2 === 0;
      luzA.current.emissiveIntensity = on ? 2.5 : 0.2;
      luzB.current.emissiveIntensity = on ? 0.2 : 2.5;
    }
  });

  const interactivo = !!alElegir;
  return (
    <group
      ref={grupo}
      position={[inicio.x, 0, inicio.z]}
      rotation-y={inicio.angulo}
      onClick={(e) => {
        if (!alElegir) return;
        e.stopPropagation();
        alElegir();
      }}
      onPointerOver={(e) => {
        if (!interactivo) return;
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
    >
      {/* Carrocería */}
      <mesh position-y={0.62} castShadow>
        <boxGeometry args={[1.8, 0.7, emergencia ? 5 : 4.4]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} emissive={resaltado || hover ? "#ffffff" : "#000000"} emissiveIntensity={resaltado || hover ? 0.18 : 0} />
      </mesh>
      {/* Cabina */}
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
      {/* Faros (al frente = -z local) */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.65, -(emergencia ? 2.51 : 2.21)]}>
          <boxGeometry args={[0.35, 0.18, 0.04]} />
          <meshStandardMaterial color="#fff6cc" emissive="#fff6cc" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* Llantas */}
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
      {mostrarEtiqueta && <Etiqueta3D texto={`${nombre} ${FLECHA[maniobra]}`} fondo={color} color={contraste(color)} />}
    </group>
  );
}

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function contraste(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.6 ? "#111" : "#fff";
}
