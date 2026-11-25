# Inkling 2 Mini en una Mac de 16 GB (gratis y sin internet)

Thinking Machines dice que Inkling 2 Mini necesita 32 GB. Lo corrí en una Mac mini M4 de 16 GB a casi 20 tokens por segundo. Aquí están los comandos exactos, la receta para que no se te reinicie la Mac y los 4 prompts del video.

## Qué incluye

- [Comandos](comandos.md): instalar llama.cpp, bajar el modelo correcto y arrancarlo.
- [Receta de optimización](receta-optimizacion.md): los pasos que nos llevaron de 6 a 19.8 tok/s, y cómo lograr que termine las tareas largas.
- [memoria.sh](memoria.sh): un comando que te dice cuánta memoria está ocupada de verdad antes de cargar el modelo.
- [Prompts](prompts/): los 4 casos del video (videojuego 3D, landing, bug de Python y análisis de datos).

## Uso en 5 minutos

1. Cierra todo lo pesado (navegador, apps de Electron, editores de video).
2. Corre `bash memoria.sh`. Si sale arriba de 6 GB, sigue cerrando cosas.
3. Sigue [comandos.md](comandos.md) de arriba a abajo.
4. Abre `http://127.0.0.1:8080` y pega uno de los prompts.

## Lo que medimos (Mac mini M4, 16 GB, llama.cpp)

| Versión del modelo | Tamaño | Velocidad | Resultado |
|---|---|---|---|
| UD-IQ3_XXS (3 bits) | 11.7 GB | 6.0 tok/s | Usó 11 GB de swap. En otra carga la Mac se reinició. |
| **UD-Q2_K_XL (2 bits)** | **9.1 GB** | **19.8 tok/s** | Cabe entero en la GPU. Carga en 2–11 s. |

Con `reasoning_effort: medium` y 32K de contexto (caché en q8), las 4 pruebas del video terminaron: juego 3D en 21 min, landing en 11, bug de Python 5/5 en 4 y análisis de datos en 19.

Probamos también todo en GPU (`-ngl 99`) y decodificación especulativa (`--spec-type ngram-mod`): las dos quedan en 19.8 tok/s. En 16 GB, la palanca es el tamaño del archivo, no las banderas.

## Qué es y qué no es

Es una versión comprimida de la comunidad (unsloth), no la oficial. Comprimir a 2 bits le quita calidad, sobre todo en datos y en español. Si tienes 32 GB o más, usa la versión que recomienda Hugging Face (IQ4_NL).

## Cofradía Agéntica

En la **[Cofradía Agéntica](https://www.skool.com/cofradia)** está la guía paso a paso para instalar tu primer modelo local en 15 minutos con Ollama: qué versión te cabe según tu memoria, el checklist para que no se te reinicie la compu y cómo conectarlo a tus agentes para no pagar API.
