#!/usr/bin/env bash
# Hoja de respuestas: puntuaciones esperadas según las reglas de juez.c
set -u
BIN=${1:-./bin/juez}
fail=0
check(){ got=$("$BIN" "$1"); [ "$got" = "$2" ] && echo "ok   $2  $1" || { echo "FAIL got=$got want=$2  $1"; fail=1; }; }
check "Hola" 40
check "Claude Code y REA: evidencia para construir tu propia versión" 74
check "GRATIS!!! GRATIS!!! GRATIS!!!" 34
check "Únete a la cofradia y aprende agentes" 70
check "¿Puede Claude Code entender una app sin ver su código? Probamos REA" 76
check "11 de 11: lo que REA vio por dentro" 67
exit $fail
