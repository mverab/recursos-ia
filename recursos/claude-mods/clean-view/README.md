# Clean View — mod de Claude Code

Menos ruido mientras Claude trabaja. Con `/simple on`, las filas técnicas de lectura y búsqueda que ya terminaron bien desaparecen de la pantalla y en su lugar ves una lista corta de pasos con su estado real y un resumen al finalizar. `/simple off` lo revierte todo al instante.

## Qué NO hace (a propósito)

- **Nunca oculta permisos, preguntas, errores, rechazos ni comandos con efectos** (Bash, escrituras, diffs). Lo que puede romper algo o necesita tu decisión siempre queda visible.
- No toca el transcript guardado: sólo cambia lo que se dibuja en pantalla.
- No inventa porcentajes ni barra de progreso falsa: muestra conteos de pasos reales observados.
- Empieza **apagado**: tú lo activas cuando quieres.

## Requisitos

- Claude Code **2.1.287 o superior** (verificado en 2.1.289).

## Instalación

```bash
claude --plugin-dir /ruta/a/clean-view
```

O `/plugin` dentro de Claude Code para instalarlo permanente. Si el typecheck lo pide, genera los tipos con `/plugin-types` en una sesión.

## Uso

- `/simple` — alterna encendido/apagado.
- `/simple on` / `/simple off` — explícito.
- También hay un botón nativo sobre el prompt para alternar con un clic.

## Límites honestos

- Es un mod de **terminal**: en la app Desktop el panel superior no aplica con el API actual.
- Es deliberadamente conservador: no esconde todo el ruido durante la ejecución, sólo las lecturas/búsquedas exitosas ya terminadas.

## Verificación

12 pruebas automatizadas (7 de comportamiento + 5 del engine nativo real), validación estricta sin advertencias, montaje y botón verificados en el kit de pruebas de Claude Code 2.1.289. Ninguna prueba envía prompts ni consume tokens.

## Licencia

MIT. Implementación original.
