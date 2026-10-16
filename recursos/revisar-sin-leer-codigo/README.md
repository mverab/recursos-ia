# No leas el código: revisa esto

Ya casi nadie lee línea por línea lo que escribe su agente. Está bien: leer 2,000 líneas no te hace más seguro, te hace más lento. Lo que sí necesitas es que tu agente (Claude Code, Codex, Cursor, Gemini CLI) te entregue un reporte corto y verificable antes de cada commit.

## Qué incluye

- [Prompt · Reporte de revisión](prompts/reporte-de-revision.md): pégalo al terminar una tarea y tu agente te muestra qué tocó, qué probó y qué riesgos dejó.
- [Checklist](checklist.md): 10 cosas que sí revisas aunque no leas el código.

## Uso en 1 minuto

1. Termina la tarea con tu agente como siempre.
2. Antes de hacer commit, copia el prompt completo y pégalo en la misma sesión.
3. Lee el reporte (no el código) y pasa por el checklist.
4. Si algo sale en rojo, pídele al agente que lo arregle y vuelve a pedir el reporte.

Si quieres que lo haga siempre, pega el prompt en tu `CLAUDE.md` o `AGENTS.md` bajo una sección "Antes de cada commit".

## Variables que debes reemplazar

**Ninguna.** El prompt funciona en cualquier repositorio con Git.

## Qué es y qué no es

No reemplaza una revisión de seguridad ni a una persona que conozca el sistema. Es el mínimo para no subir a producción algo que no entiendes. En código que maneja dinero, datos de clientes o permisos, sí lee esas partes.

## Cofradía Agéntica

En la **[Cofradía Agéntica](https://www.skool.com/cofradia)** armamos el flujo completo: agentes que trabajan en ramas, tests primero, revisión automática antes de cada commit y sesiones en vivo para resolver tu caso.
