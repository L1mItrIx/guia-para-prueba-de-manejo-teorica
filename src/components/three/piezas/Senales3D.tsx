"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Control, Direccion } from "@/content/schema";
import { BORDE_CRUCE, CARRIL } from "@/lib/rutas";

/** Textura con texto dibujado en un canvas (sin descargar fuentes). */
function useTexturaTexto(texto: string, fondo: string, color: string, forma: "octagono" | "triangulo") {
  const textura = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.clearRect(0, 0, 256, 256);
    if (forma === "octagono") {
      g.fillStyle = "#ffffff";
      dibujarOctagono(g, 128, 128, 126);
      g.fillStyle = fondo;
      dibujarOctagono(g, 128, 128, 116);
      g.fillStyle = color;
      g.font = "bold 78px Arial, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(texto, 128, 134);
    } else {
      g.fillStyle = "#c8102e";
      triangulo(g, 4, 20, 252, 20, 128, 240);
      g.fillStyle = "#ffffff";
      triangulo(g, 44, 46, 212, 46, 128, 190);
      g.fillStyle = "#c8102e";
      g.font = "bold 36px Arial, sans-serif";
      g.textAlign = "center";
      g.fillText(texto, 128, 98);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [texto, fondo, color, forma]);
  useEffect(() => () => textura?.dispose(), [textura]);
  return textura;
}

function dibujarOctagono(g: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    g.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  g.closePath();
  g.fill();
}

function triangulo(g: CanvasRenderingContext2D, ...p: number[]) {
  g.beginPath();
  g.moveTo(p[0], p[1]);
  g.lineTo(p[2], p[3]);
  g.lineTo(p[4], p[5]);
  g.closePath();
  g.fill();
}

const ROT: Record<Direccion, number> = { sur: 0, norte: Math.PI, este: Math.PI / 2, oeste: -Math.PI / 2 };
/** Esquina derecha del acceso (donde se coloca la señal, del lado de la acera). */
function posicionPoste(d: Direccion): [number, number, number] {
  const o = BORDE_CRUCE + 1.2;
  const lado = CARRIL + 0.9;
  switch (d) {
    case "sur":
      return [lado, 0, o + 0.6];
    case "norte":
      return [-lado, 0, -o - 0.6];
    case "este":
      return [o + 0.6, 0, -lado];
    case "oeste":
      return [-o - 0.6, 0, lado];
  }
}

function Poste({ altura = 2.6 }: { altura?: number }) {
  return (
    <mesh position-y={altura / 2} castShadow>
      <cylinderGeometry args={[0.06, 0.06, altura, 8]} />
      <meshStandardMaterial color="#8a8f99" metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

function PlacaTexto({ tipo }: { tipo: "alto" | "ceda" }) {
  const tex = useTexturaTexto(tipo === "alto" ? "ALTO" : "CEDA", "#c8102e", "#ffffff", tipo === "alto" ? "octagono" : "triangulo");
  if (!tex) return null;
  return (
    <mesh position-y={2.75} castShadow>
      <planeGeometry args={[1.1, 1.1]} />
      <meshStandardMaterial map={tex} transparent alphaTest={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Semaforo({ luz }: { luz: "rojo" | "verde" }) {
  const colores = [
    ["#e53935", luz === "rojo"],
    ["#fdd835", false],
    ["#43a047", luz === "verde"],
  ] as const;
  return (
    <group>
      <Poste altura={3.2} />
      <mesh position-y={3.6} castShadow>
        <boxGeometry args={[0.5, 1.3, 0.35]} />
        <meshStandardMaterial color="#1d1f24" />
      </mesh>
      {colores.map(([c, encendida], k) => (
        <mesh key={c} position={[0, 4.0 - k * 0.4, 0.18]}>
          <sphereGeometry args={[0.14, 16, 12]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={encendida ? 2.2 : 0} opacity={encendida ? 1 : 0.3} transparent />
        </mesh>
      ))}
    </group>
  );
}

/** Coloca la señal o semáforo de cada acceso, mirando al conductor que llega. */
export function Senales3D({ controles }: { controles: Partial<Record<Direccion, Control>> }) {
  return (
    <group>
      {(Object.entries(controles) as [Direccion, Control][]).map(([d, c]) => {
        if (c === "ninguno") return null;
        return (
          <group key={d} position={posicionPoste(d)} rotation-y={ROT[d]}>
            {c === "alto" && (
              <>
                <Poste />
                <PlacaTexto tipo="alto" />
              </>
            )}
            {c === "ceda" && (
              <>
                <Poste />
                <PlacaTexto tipo="ceda" />
              </>
            )}
            {c === "semaforo-rojo" && <Semaforo luz="rojo" />}
            {c === "semaforo-verde" && <Semaforo luz="verde" />}
          </group>
        );
      })}
    </group>
  );
}
