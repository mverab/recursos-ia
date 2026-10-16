# Prompt: reporte de revisión antes del commit

Copia todo lo que está dentro del bloque y pégalo en tu agente al terminar una tarea.

```text
Antes de hacer commit, no me expliques el código. Dame un reporte de revisión con evidencia real (salidas de comandos que ejecutes ahora, no de memoria). Usa exactamente estas secciones:

1. QUÉ PEDÍ vs QUÉ HICISTE: una línea con lo que te pedí y una con lo que realmente cambiaste. Si hiciste algo que no pedí, dilo.
2. ARCHIVOS: ejecuta `git status` y `git diff --stat`. Lista cada archivo tocado con una frase de por qué. Marca con ⚠️ cualquier archivo que no esperaría ver (configuración, CI, migraciones, lockfiles, .env).
3. TESTS: qué tests cubren el cambio. ¿Escribiste alguno que haya fallado antes de pasar? Ejecuta la suite relevante y pega el resumen final (pasados/fallados). Si no hay tests, dilo claramente.
4. DEPENDENCIAS: ¿agregaste, quitaste o subiste de versión alguna librería? Nombre, versión y para qué.
5. SECRETOS: busca en el diff llaves, tokens, contraseñas, URLs con credenciales o archivos .env. Responde "ninguno encontrado" o lista lo que encontraste SIN mostrar el valor.
6. DATOS Y PERMISOS: ¿el cambio borra o migra datos, cambia permisos, autenticación o algo que cobra dinero? Sí/No y dónde.
7. LO QUE NO VERIFICASTE: qué supusiste sin comprobar y qué podría romperse.
8. CÓMO LO PRUEBO YO: los pasos exactos (comando o clics) para ver el cambio funcionando en menos de 2 minutos.
9. VEREDICTO: 🟢 listo para commit, 🟡 listo con riesgos (cuáles) o 🔴 no hagas commit todavía (por qué).

Si algún punto sale 🔴, no hagas commit: propón el arreglo y espera mi OK.
```
