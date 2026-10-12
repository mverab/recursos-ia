# Práctica: reta a tu agente con un programa que tú controlas

Analizar apps ajenas tiene límites legales. Esta práctica usa un programa tuyo, así que sabes la respuesta correcta y puedes calificar a tu agente.

`juez.c` puntúa títulos de YouTube del 0 al 100 con reglas escondidas, una de ellas cifrada para que no aparezca con `strings`.

## Pasos

1. Compílalo como se distribuye una app real (optimizado y sin símbolos):
   ```bash
   # macOS
   clang -O2 -o juez juez.c && strip juez
   # Linux
   gcc -O2 -s -o juez juez.c
   ```
2. Comprueba que funciona: `./test_juez.sh ./juez` (6 casos `ok`).
3. Copia **solo** el binario `juez` a una carpeta nueva, sin `juez.c` ni este README. No leas `juez.c` si quieres jugar limpio.
4. Abre tu agente en esa carpeta y pega el prompt de [06-reto-binario.md](../prompts/06-reto-binario.md).
5. Cuando termine, compara su tabla con `juez.c` y corre tu propia prueba con títulos tuyos.

## Lo que pasó en nuestro ensayo

Claude Code con REA 6.4.0 y Ghidra 12.1.4, sin acceso al código: encontró todas las reglas, incluida la escondida, en 2 min 12 s; su reconstrucción en Python coincidió en 529 de 529 títulos, y en 56 de 56 títulos reales del canal. Con otro agente, modelo o motor el resultado puede variar.
