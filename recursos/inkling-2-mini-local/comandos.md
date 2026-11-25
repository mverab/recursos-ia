# Comandos: Inkling 2 Mini en una Mac de 16 GB

Probado en una Mac mini M4 de 16 GB con macOS, el 2026-11-25.

## 1. Herramientas

```bash
xcode-select --install          # si no tienes las herramientas de compilación
brew install cmake
```

## 2. llama.cpp actualizado

La versión de Homebrew (`brew install llama.cpp`, build 12359) todavía no carga Inkling. Compila la última:

```bash
mkdir -p ~/llm-models && cd ~/llm-models
git clone --depth 1 https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build -DLLAMA_CURL=OFF
cmake --build build -j4 --target llama-server
```

## 3. El modelo (9.1 GB)

```bash
cd ~/llm-models
curl -L -C - -o Inkling-2-Mini-UD-Q2_K_XL.gguf \
  https://huggingface.co/unsloth/Inkling-2-Mini-GGUF/resolve/main/Inkling-2-Mini-UD-Q2_K_XL.gguf
```

Si el disco interno está lleno, puedes ponerlo en un SSD externo. Ojo: si lo corres desde un SSD externo, macOS puede pedir permiso de acceso al disco.

## 4. Antes de cargar: libera memoria

```bash
bash memoria.sh     # te dice si ya puedes cargar (menos de 6 GB ocupados)
```

Cierra el navegador y las apps pesadas hasta que baje. Si cargas el modelo con la memoria llena, la Mac puede reiniciarse: la memoria de la GPU no se puede comprimir ni mandar a swap.

## 5. Arrancar

```bash
~/llm-models/llama.cpp/build/bin/llama-server \
  -m ~/llm-models/Inkling-2-Mini-UD-Q2_K_XL.gguf \
  -c 32768 -ctk q8_0 -ctv q8_0 -fa on --jinja -np 1 --port 8080
```

- `-c 32768 -ctk q8_0 -ctv q8_0`: 32K de contexto con la memoria del contexto comprimida a 8 bits. Ocupa lo mismo que 16K normal. Con 16K, el juego 3D y el análisis de datos se quedaron sin espacio.

## 6. Bájale al razonamiento (importante)

Inkling viene con el razonamiento en alto (0.9). Así puede pasarse 15 minutos pensando sin escribir nada. Pídele esfuerzo medio en cada petición:

```bash
curl http://127.0.0.1:8080/v1/chat/completions -H 'Content-Type: application/json' -d '{
  "messages": [{"role": "user", "content": "Hola"}],
  "chat_template_kwargs": {"reasoning_effort": "medium"}
}'
```

Valores: `none`, `minimal`, `low`, `medium`, `high`. Incluso con `none` sigue razonando un poco (lo dice la ficha).

Abre http://127.0.0.1:8080 y escribe. También habla la API de OpenAI en `http://127.0.0.1:8080/v1`, así que lo puedes conectar a tus agentes.

## Si va lento

- Mira `sysctl vm.swapusage`. Si el swap sube de 2–3 GB, cierra más cosas o baja el contexto (`-c 8192`).
- Inkling razona mucho antes de contestar. Para tareas largas pon un límite de tokens; la propia ficha lo recomienda.
