# Ingeniería inversa con REA: entiende una función y construye la tuya

Seis prompts y una práctica para que tu agente (Claude Code, Codex, Cursor, Gemini CLI) investigue cómo funciona una función de una app sin ver su código fuente, te muestre la evidencia, la verifiques y construyas tu propia versión con tests.

## Qué incluye

- [P0 · Preparar](prompts/01-preparar.md): instalar REA en tu agente.
- [P1 · Investigar](prompts/02-investigar.md): analizar la app y la función.
- [P2 · Exigir evidencia](prompts/03-evidencia.md): tabla afirmación / evidencia / estado.
- [P3 · Verificar](prompts/04-verificar.md): contrastar con una fuente independiente.
- [P4 · Construir](prompts/05-construir.md): tu versión, tests primero.
- [P5 · Reto con un binario](prompts/06-reto-binario.md): reconstruir un programa compilado y demostrarlo.
- [Práctica: el juez de títulos](practica/README.md): un programa propio con reglas escondidas para retar a tu agente sin problemas legales.
- [Checklist](checklist.md): 10 puntos para no creerle a tu agente sin pruebas.

## Requisitos

- Node.js 22.19+, 24.11+ o 26+ y un agente con soporte MCP.
- [REA](https://github.com/morluto/rea) (licencia MIT), que se instala con el primer prompt.
- Para binarios nativos: Hopper, Ghidra o IDA. Para apps Electron/JavaScript y .NET no hacen falta.
- Para la práctica: un compilador de C (`clang` en macOS, `gcc` en Linux).

## Uso paso a paso

1. Corre P0 en tu terminal y reinicia tu agente.
2. Copia P1 completo y responde las preguntas del agente.
3. Sigue con P2, P3 y P4 en orden. No pases a construir sin haber verificado.
4. Repasa el checklist antes de dar por buena tu versión.

## Variables que debes reemplazar

**Ninguna.** El agente te pregunta la app, la función, la ruta y el stack.

## Qué es y qué no es

Sirve para entender e interoperar, no para clonar productos, saltarse licencias, DRM ni cuentas. Analiza solo apps que tengas derecho a analizar y nunca copies marca, textos, assets ni código literal. El análisis corre en tu equipo, pero lo que REA encuentra lo lee tu agente y su proveedor: no analices apps con datos de clientes.

Una app real puede generar cientos de MB de evidencia y tardar varios minutos. Recortar `node_modules` ayuda mucho.

## Estado de verificación

En la preparación del video, REA 6.4.0 analizó MarkText 0.21.2 (open source, MIT) sin su código fuente: 828 archivos en unos 7 minutos en un servidor de 2 vCPU. Las 11 funciones que la app expone a su ventana coincidieron con su código real, y REA marcó como desconocidos los canales que no pudo resolver. La versión propia construida con P4 pasó 2 de 2 tests.

Con la práctica del juez, Claude Code + REA + Ghidra encontró todas las reglas del binario sin su código, incluida la escondida, y su reconstrucción coincidió en 529 de 529 títulos.

El flujo completo con Claude Code en macOS se ensaya antes de grabar. Estos prompts no garantizan el mismo resultado con otras apps, versiones o agentes.

## Video asociado

Se enlazará aquí cuando esté publicado.

## Cofradía Agéntica

En la **[Cofradía Agéntica](https://www.skool.com/cofradia)** está la skill completa `investigar-funcion` para Claude Code: análisis sin ahogarte en cientos de MB, un script que resume las fronteras de la app en segundos, la tabla de verificación y un ejemplo de versión propia con tests.
