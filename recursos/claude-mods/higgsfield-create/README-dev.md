# Higgsfield /create — reconstrucción original local

Mod **function-hooks nativo**, no HTML externo ni una skill. No es el código
original de Tristen O’Brien, que no fue publicado en las fuentes consultadas.
Adapta el backend MCP de la referencia al **CLI oficial Higgsfield** autenticado.
El propietario decide más adelante si será privado/público y dónde se publicará.

## Abrir, sin instalación ni configuración global

```sh
cd /home/hermes-2/workspace/labs/local/claude-mods-higgsfield
/home/hermes-2/.local/share/claude/versions/2.1.289 --permission-mode default --plugin-dir "$PWD"
```

En Claude Code: `/create`. Tab mueve entre controles; flechas/Enter seleccionan.
El prompt se escribe dentro del panel, **no se envía al LLM**. Photo/Video, modelos,
ratios, resoluciones y valores se leen del catálogo y los schemas reales del CLI.
Se conservan los defaults del modelo; los enums nullable no se presentan como un
valor elegido cuando en realidad están ausentes. Campos numéricos: confirmar con
Enter. Editar un campo invalida cualquier cotización anterior.

1. **Cotizar sin generar** llama exclusivamente a `higgsfield generate cost`.
2. El botón **Sí, GENERAR y gastar X créditos** es el único camino a `generate create`.
   Usa exactamente el vector de parámetros cotizado, cambiando solo el verbo.
   Quote local de un solo uso, con caducidad de 60 s y vinculado al botón dibujado.
3. Editar, cambiar modelo/medio, recotizar, cerrar o cancelar invalida el quote;
   las respuestas tardías no lo restauran. No hay reintentos automáticos de create.
4. Los jobs tienen actualización manual de estado. Un UUID existente puede
   consultarse sin generar nada. Se muestran status, modelo real y URL de preview.
5. Guardar descarga exclusivamente a `outputs/`, con sufijos libres y creación
   atómica `O_EXCL`/`O_NOFOLLOW`. No sobrescribe, no acepta rutas arbitrarias.

**No pulsar GENERAR para una demo sin nueva confirmación del propietario.**
La cancelación revoca una cotización, no revierte un job ya enviado a Higgsfield.
La cotización del CLI es una estimación real de créditos, no una reserva de precio
server-side. No cambiar el workspace de facturación en otro CLI entre quote y
confirmación. Las credenciales siguen en el CLI; el mod no las lee ni almacena.

## Seguridad y límites

- Procesos mediante `$.process.run(argv)`, sin shell, sin interpolación de comandos.
- HTTPS y CDN explícitos observados en respuestas reales; nada de file/http como
  fuente de descargas, credenciales en URL, puertos custom ni redirects.
- Descarga acotada a 100 MiB; tipos PNG/JPEG/WebP/MP4 por firma, no por extensión
  inventada. Requiere Python 3 en el host y directorio `outputs/` existente.
- No upload de referencias, enhancement de prompt ni preview raster: ese contenido
  queda fuera de este vertical. Models/modes que exijan referencias fallarán en
  cost/schema; no se sustituye el modelo ni se genera por otro backend.
- Mod dibuja únicamente en la superficie terminal de Claude Code. No se afirma
  compatibilidad con Desktop, móvil o VS Code.
- `unlim_choice`, respuesta desconocida, fallo de red o timeout: se detiene;
  **no** elige una modalidad de cobro ni repite una generación.
- La creación pagada NO se probó en vivo. Los tests del gate usan doubles
  explícitos para no gastar; no son prueba de generación real.

## Verificación

```sh
npm ci --ignore-scripts
npm test
npm run test:security
npm run test:native
npm run typecheck
npm run validate
npm run smoke:live  # solo account/model/get/cost; create está prohibido
```

`types/claude-code.d.ts` es la declaración oficial suministrada por el propietario
(generada por 2.1.277); validación, engine tests y TUI se ejercitaron con el binario
2.1.289. Los logs RED/GREEN y API no pagada están en `logs/`.
La TUI real abrió el panel, leyó 1860 créditos Ultra, obtuvo quote de 2 créditos,
consultó un job **preexistente** y guardó su PNG dos veces sin overwrite. La prueba
API adicional cotizó Nano Banana Pro 16:9/4k a 4 créditos y Seedance 2.5 a 35
créditos, sin cambiar el saldo. Ninguna de esas imágenes fue generada en este trabajo.

## Rollout y actualización automática observada

El primer `plugin test` falló por `rollout switch was saved off`. Una apertura
interactiva normal con red, sin prompt ni modelo enviados, refrescó el switch.
Los tests y la TUI funcionan después: **no hay bloqueo de rollout vigente**.
Durante esa apertura el actualizador automático propio del CLI instaló 2.1.291 y
movió su launcher. No se ejecutó ningún comando update ni se editaron settings
para forzar el rollout. Se mantuvo y usó explícitamente el binario 2.1.289 existente
para todo el engine testing y la TUI del mod. La sesión de prueba se cerró.

Estado y handoff detallado:
`/home/hermes-2/Sync/mkt/claude-mods/implementacion-higgsfield.md`.
