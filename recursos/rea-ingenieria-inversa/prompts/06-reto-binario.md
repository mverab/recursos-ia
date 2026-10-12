# P5 · Reto: reconstruir un programa compilado

Úsalo con el programa de [práctica](../practica/README.md) o con cualquier binario que tengas derecho a analizar.

```text
En esta carpeta hay un programa compilado, ./juez, que puntúa títulos de YouTube del 0 al 100 (uso: ./juez "título"). No tienes su código fuente y no debes buscarlo fuera de esta carpeta.
Analiza el binario SOLO con las herramientas de REA. La terminal es solo para ejecutar ./juez y tus scripts de Python.
Averigua exactamente qué reglas usa para puntuar, incluida cualquier regla escondida.
Luego escribe juez_reconstruido.py que dé exactamente la misma puntuación, y demuéstralo con comparar.py probando al menos 300 títulos variados contra ./juez; reporta cuántos coinciden.
Al final dame una tabla: regla | puntos | evidencia (función o dirección del binario, y qué herramienta de REA la mostró) | ¿la confirmaste ejecutando ./juez?
```

Antes de pegarlo, confirma en tu agente que REA está conectado (en Claude Code: `/mcp`). Si no lo está, el agente puede irse por otras herramientas y ya no estarás probando REA.
