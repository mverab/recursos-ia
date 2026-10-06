# Clean View — mod local original

Vista tranquila **opt-in**, implementada con function hooks y componentes nativos de Claude Code. Empieza **OFF en cada carga/sesión del mod**; no persiste una elección ON global.

## Uso

Carga temporal, sin instalar ni modificar configuración global:

```sh
claude --plugin-dir /home/hermes-2/workspace/labs/local/claude-mods-clean-view
```

No se ha ejecutado este arranque interactivo durante la implementación.
Antes de una petición: `/simple on`. Para recuperar las filas normales: `/simple off`, o el botón **Clean View: ON/OFF** situado encima del prompt. `/simple` alterna; otros argumentos muestran el uso sin cambiar el estado. La orden se registra como inmediata para poder apagarlo mientras hay trabajo.

## Qué hace

- Panel nativo con las últimas seis llamadas observadas y sus estados. Conteos exactos de llamadas que terminaron bien, fallaron, fueron denegadas o siguen ejecutándose. No conoce el total futuro: no muestra porcentajes ni un plan supuesto.
- Estados de turno y un resumen al terminar. «Turn complete» significa que terminó el turno, **no** que se logró todo el objetivo del usuario.
- «Needs you» ante un evento de permiso o una pregunta observada. Los errores, rechazos, cancelaciones y respuestas originales siguen visibles.
- Oculta únicamente filas **terminadas y exitosas** de Read/Grep/Glob/LS observadas por este mod, cuando no hay señales de advertencia/error en su resultado. Un grupo sólo se oculta si todas sus filas cumplen esa condición. Filas pendientes, IDs desconocidos y grupos mixtos quedan visibles.
- Nunca oculta Bash, cambios/escrituras/diffs, preguntas, permisos, respuestas del asistente ni el control de background. Esta reducción conservadora es intencional: seguridad antes que ocultar toda la actividad.
- Los tool/turn hooks delegan sin reescribir entrada, resultado, permiso, respuesta o transcript persistente. No hay acceso al sistema de archivos, llamadas de modelo, títulos generados, prompt injections, herramientas extra ni un bloqueo «plan primero».

## Límites reales

`AbovePrompt` es terminal-only en las declaraciones oficiales usadas. Por tanto el panel/botón es de terminal. Desktop/mobile/VS Code no ocultan filas: sin un control de reversión nativo montado, no es seguro hacerlo. Cuando un survey ocupa la banda se delega intacto; `/simple off` sigue siendo la salida.

Los nombres describen herramientas **realmente observadas**, no un plan semántico completo. El panel mantiene un historial acotado de seis filas visibles; los conteos incluyen todas las llamadas observadas del turno. No hay animación, reloj, colapso temporizado ni estado ON persistente.

Verificaciones del kit nativo no equivalen a captura visual ni a E2E interactivo de generación. No se ha enviado un prompt facturable. El rollout de function hooks puede bloquear otro proceso o cuenta; registrar ese bloqueo y detenerse, no cambiar global settings para evitarlo.

## Verificación

```sh
npm ci --ignore-scripts
npm test
npm run typecheck
claude plugin validate . --strict --json
claude plugin test .
```

- `checks/*.check.ts`: pruebas comportamentales Node/tsx con un harness local explícitamente etiquetado.
- `tests/*.test.ts`: kit **real** `claude-code/testing`; monta componentes nativos, prueba el botón y suministra el mundo debajo de los hooks sin hacer llamadas de modelo.
- No llamar `*.test.ts` a tests Node: el runner Claude los descubre recursivamente, incluso fuera de `tests/`, y rechaza `node:test` en su sandbox.
- `tsconfig.json` referencia las declaraciones oficiales **externas** de este host; no se redistribuyen.

Para otro equipo copia `.claude-plugin/`, `hooks/` y `types/` a una carpeta local y usa `claude --plugin-dir /ruta/clean-view` con un runtime compatible y function hooks habilitados. El mod no necesita npm en ejecución. Para desarrollo/typecheck, consigue las declaraciones del runtime vía `/plugin-types` y adapta el include de `tsconfig.json`; no copies el prompt del creador ni fuentes upstream sin permiso.

## Estado

CLI verificado: 2.1.289. Siete pruebas comportamentales y cinco del engine pasan; typecheck y validación estricta pasan. Ver `logs/verification.json` y el handoff externo para evidencia, trazabilidad TDD y límites de UI.

Proyecto local sin remote/publicación; licencia de distribución pendiente de decisión del owner. Ver `PROVENANCE.md`.
