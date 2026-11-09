#!/usr/bin/env bash
# Uso: scripts/fuentes/extraer.sh <url-o-ruta-del-pdf> <nombre>
# Descarga (si es URL) el PDF a fuentes/<nombre>.pdf y lo convierte a fuentes/<nombre>.txt con pdftotext -layout.
# La carpeta fuentes/ no se versiona (ver .gitignore).
set -euo pipefail
origen="${1:?Falta la URL o la ruta del PDF}"
nombre="${2:?Falta el nombre corto (p. ej. ley9078)}"
mkdir -p fuentes
pdf="fuentes/${nombre}.pdf"
if [[ "$origen" =~ ^https?:// ]]; then
  curl -sSL --fail -m 180 -o "$pdf" "$origen"
else
  cp "$origen" "$pdf"
fi
file "$pdf" | grep -q "PDF document" || { echo "✘ $pdf no es un PDF"; exit 1; }
pdfinfo "$pdf" | grep -E "^(Title|Pages|ModDate|CreationDate):" || true
pdftotext -layout "$pdf" "fuentes/${nombre}.txt"
caracteres=$(wc -m < "fuentes/${nombre}.txt")
echo "✔ fuentes/${nombre}.txt ($caracteres caracteres)"
if [ "$caracteres" -lt 2000 ]; then
  echo "⚠ Casi no hay texto: probablemente es un PDF escaneado (imagen). Ver skill pdf-reading, sección OCR."
fi
