# Higgsfield Create — mod de Claude Code

Crea imágenes y video con Higgsfield **sin salir de Claude Code**. Abre un panel nativo con `/create`, eliges Photo o Video, modelo, proporción y resolución, escribes o editas el prompt, ves la cotización real en créditos y **nada se gasta hasta que confirmas el precio en pantalla**.

## Requisitos

- Claude Code **2.1.287 o superior** (verificado en 2.1.289).
- [CLI de Higgsfield](https://github.com/higgsfield-ai/cli) instalado y autenticado (`higgsfield auth login`).
- Créditos Higgsfield. La cotización aparece antes de cada generación y cambiar cualquier parámetro la invalida: confirmas siempre el precio vigente.

## Instalación

Desde tu proyecto:

```bash
claude --plugin-dir /ruta/a/higgsfield-create
```

Para dejarlo permanente: `/plugin` dentro de Claude Code y agrégalo como plugin local. Si el typecheck lo pide, genera los tipos de tu versión con `/plugin-types` dentro de una sesión.

## Uso

1. `/create` — abre el panel.
2. Elige Photo o Video, modelo (los que tu CLI tenga disponibles), proporción y resolución.
3. Escribe el prompt; es editable hasta el último momento.
4. Revisa la cotización en créditos y confirma explícitamente, o cancela sin gasto.
5. El resultado se descarga a `outputs/` del plugin sin sobrescribir archivos anteriores. También puedes consultar jobs anteriores y guardar sus resultados.

## Límites honestos

- Funciona en la **terminal** de Claude Code; no incluye superficie Desktop/móvil.
- No sube imágenes de referencia ni mejora prompts con otro modelo en esta versión.
- La cotización es una estimación del CLI, no un precio reservado en servidor.
- Sin tu confirmación en el botón de precio, no hay gasto: está probado que un botón viejo no puede autorizar una cotización nueva.

## Verificación

19 pruebas automatizadas (comportamiento, seguridad de descarga y engine nativo), validación estricta del plugin y sesión TUI real con cuenta autenticada: panel, saldo, cotización, cancelación y descarga sin sobrescritura. La generación pagada de extremo a extremo se ejercita con tu primera creación confirmada.

## Licencia

MIT. Reconstrucción original para la comunidad; el backend es el CLI oficial de Higgsfield.
