"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Etiqueta tipo "pastilla" que siempre mira a la cámara (sprite con textura de canvas). */
export function Etiqueta3D({ texto, fondo, color, altura = 2.9 }: { texto: string; fondo: string; color: string; altura?: number }) {
  const { textura, aspecto } = useMemo(() => {
    const escala = 2;
    const c = document.createElement("canvas");
    const g = c.getContext("2d")!;
    const fuente = `bold ${28 * escala}px Arial, sans-serif`;
    g.font = fuente;
    const ancho = Math.ceil(g.measureText(texto).width) + 36 * escala;
    const alto = 48 * escala;
    c.width = ancho;
    c.height = alto;
    const r = alto / 2;
    g.beginPath();
    g.roundRect(3, 3, ancho - 6, alto - 6, r - 3);
    g.fillStyle = fondo;
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = "#ffffff";
    g.stroke();
    g.font = fuente;
    g.fillStyle = color;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(texto, ancho / 2, alto / 2 + 2);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return { textura: t, aspecto: ancho / alto };
  }, [texto, fondo, color]);
  useEffect(() => () => textura.dispose(), [textura]);

  const alto = 1.05;
  return (
    <sprite position={[0, altura, 0]} scale={[alto * aspecto, alto, 1]} renderOrder={10}>
      <spriteMaterial map={textura} transparent depthTest={false} />
    </sprite>
  );
}
