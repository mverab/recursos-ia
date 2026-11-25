# Receta: de 6 a 19.8 tokens por segundo en 16 GB

Usamos el método de [inference-optimisation-skill](https://github.com/sybil-solutions/inference-optimisation-skill): primero se calcula el techo, después se cambia una sola cosa a la vez y se mide con controles.

## 1. Limpia antes de cargar

En una Mac, la GPU y el sistema comparten los 16 GB. La parte de la GPU no se comprime ni va a swap. Si cargas un modelo de 11 GB con 10 GB ya ocupados, la Mac se reinicia. A nosotros nos pasó.

Regla: menos de 6 GB ocupados antes de cargar (`bash memoria.sh`).

## 2. Calcula el techo

Al generar texto, la velocidad la pone el ancho de banda de la memoria, no la potencia de cálculo. Cada token lee los pesos activos del modelo:

    tokens por segundo máximo ≈ ancho de banda ÷ bytes leídos por token

Una M4 tiene unos 120 GB/s. Con Inkling a 2 bits el techo práctico queda en 45–60 tok/s. Si estás muy debajo del techo, hay algo que arreglar. Si estás cerca, ninguna bandera te va a salvar.

## 3. Elige el tamaño que cabe (la palanca grande)

| Versión | Tamaño | Velocidad medida |
|---|---|---|
| IQ3_XXS | 11.7 GB | 6.0 tok/s, con 11 GB de swap |
| Q2_K_XL | 9.1 GB | 19.8 tok/s, sin presión |

El archivo de 3 bits no cabe junto con el sistema. La Mac pasa la mitad del tiempo moviendo memoria al disco. El de 2 bits cabe entero y va 3.3 veces más rápido.

## 4. Cambia una sola cosa y mide con controles

Orden: control → cambio → control. Seis muestras de 512 tokens y la mediana.

| Prueba | tok/s |
|---|---|
| Base (`-c 16384 -fa on`) | 19.80 |
| Todo en GPU (`-ngl 99`) | 19.76 |
| Base otra vez | 19.79 |
| Especulativa n-gram (`--spec-type ngram-mod`) | 19.79 |
| Todo en GPU otra vez | 19.77 |

Ninguna bandera movió la aguja. Eso también es un resultado: ya no hay que perder tiempo con banderas.

## 5. Bájale al razonamiento y comprime el contexto

Inkling razona en alto por defecto. Con eso, el juego 3D se pasó 15 minutos pensando y no escribió código.

| Ajuste | Juego 3D | Análisis de datos (CSV de 270 filas) |
|---|---|---|
| Razonamiento por defecto, 16K | 0 líneas de código en 15 min | — |
| `reasoning_effort: medium`, 16K | Se corta a media página | Se queda sin espacio y no contesta |
| `medium` + 32K con KV en q8 | ✅ Juego completo en 21 min | ✅ Contesta en 19 min |

`-ctk q8_0 -ctv q8_0` comprime la memoria del contexto a 8 bits, así que 32K ocupa lo mismo que 16K normal.

## 6. Siguientes palancas (para equipos con más memoria)

- **MLX** en lugar de llama.cpp: en una Mac de 24 GB, @muradylan midió 37 contra 17.7 tok/s. La versión MLX más chica de Inkling pesa 11.5 GB, así que en 16 GB no cabe con margen.
- **Leer los expertos desde el SSD** (Atomic Engine): según @atomic_chat_hq usa 50 % menos RAM.
- **Decodificación especulativa con MTP**: según el skill, en chips con poco ancho de banda (M4 base) puede ir más lento, no más rápido.
