# Checklist: Nod de cero a primer encargo

## 1. Antes de instalar

- [ ] Mac con Apple Silicon o Windows. Para servidor propio, usa la [guía de self-host](https://nod.n8n.io/docs/deploy/self-host/).
- [ ] Unos 8 GB de RAM y varios GB libres en disco: Nod crea una máquina Linux con navegador y base de datos.
- [ ] Sabes que Nod se apaga si tu computadora se apaga o se duerme. Las tareas programadas solo corren con la computadora encendida.

## 2. Instalar y primer arranque

- [ ] Descarga el instalador oficial (nod.n8n.io o los releases de `n8n-io/nod` en GitHub).
- [ ] Arrastra Nod a Aplicaciones y ábrelo. Si macOS avisa que es una app de internet, ábrela igual.
- [ ] Espera en «Starting your private computer…». La primera vez son varios minutos y la pantalla no muestra progreso.

### Si sale «Nod runtime setup took too long»

Reinstalar la app no lo arregla: la computadora privada se guarda aparte, en `~/.nod-desktop/`, y Nod vuelve a arrancar la misma.

1. Cierra Nod por completo (Cmd+Q).
2. En la terminal, revisa qué hay: `ls ~/.nod-desktop/`
3. Si todavía no usaste Nod (no hay nada tuyo adentro), bórrala para que la cree de cero:
   `rm -rf ~/.nod-desktop/<carpeta>`
   Ojo: esto borra la computadora privada de Nod con todo lo que tenga adentro.
4. Abre Nod otra vez y espera.
5. Si vuelve a fallar, guarda la salida de `tail -40 ~/.nod-desktop/*/nod/ha.stderr.log` y repórtala con el botón «Report bug» o en el Discord de Nod.

## 3. Conectar un modelo

- [ ] **ChatGPT Plus o Pro:** elige «OpenAI», inicia sesión con tu cuenta y confirma el código del correo. Usa tu plan, sin costo extra.
- [ ] **Kimi (con tu plan de Kimi Code):** Settings → Models → Add → «OpenAI-compatible». En «Server address» pon `https://api.kimi.com/coding/v1` y en «API key» tu clave del plan (`sk-kimi-…`, la sacas de la consola de Kimi Code). Conecta y elige «Kimi for Coding». La opción «Moonshot AI» es otra cosa: la API de platform.kimi.ai, que cobra por uso.
- [ ] **Claude:** solo con clave de API; tu suscripción de Claude no sirve aquí.
- [ ] Pregúntale «¿qué modelo eres?» para confirmar cuál responde.
- [ ] Revisa la pestaña Usage después de cada encargo.

## 4. Antes de conectar tus cuentas

- [ ] Primero prueba sin correo. Si conectas uno, que sea una cuenta de pruebas.
- [ ] Las contraseñas se escriben en el panel de inicio de sesión de Nod, nunca en el chat.
- [ ] Los códigos de verificación se mandan solos en el mensaje; Nod los oculta del chat.
- [ ] Desactiva «Share traces» si no quieres que tus conversaciones lleguen al equipo de Nod.
- [ ] Nada de bancos, tarjetas ni cuentas de administración mientras sea versión de prueba.

## 5. Primer encargo

- [ ] Usa un prompt de `prompts/primeros-encargos.md`.
- [ ] Anota cuántas veces te pidió permiso y para qué.
- [ ] Si algo falla, usa «Report bug»: el diagnóstico ayuda a que lo arreglen.
