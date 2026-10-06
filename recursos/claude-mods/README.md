# Claude Mods — mods para Claude Code

Cuatro mods que cambian cómo se ve y se trabaja dentro de Claude Code. Aquí van **dos en abierto**; el pack completo con guías de implementación está en la Cofradía Agéntica.

Un **mod** es un plugin con function hooks: código TypeScript que corre dentro de Claude Code y puede cambiar su interfaz y comportamiento. Requiere Claude Code **2.1.287 o superior** (verificados en 2.1.289).

| Mod | Qué hace | Requisito extra |
| --- | --- | --- |
| [Higgsfield Create](higgsfield-create/README.md) | Crea imágenes y video con Higgsfield sin salir de Claude Code, con cotización y confirmación antes de gastar | Cuenta Higgsfield con créditos y su CLI autenticado |
| [Clean View](clean-view/README.md) | Esconde el ruido técnico mientras Claude trabaja y muestra pasos claros; jamás oculta permisos ni errores | Ninguno |

## Instalación rápida

Descarga el repositorio (**Code → Download ZIP** o `git clone`) y abre Claude Code apuntando al mod:

```bash
claude --plugin-dir /ruta/a/recursos-ia/recursos/claude-mods/clean-view
```

Para dejarlo permanente usa `/plugin` dentro de Claude Code. Cada carpeta tiene su propia guía con requisitos, límites honestos y estado de verificación.

## Avisos

- Instala mods sólo de fuentes confiables: un mod corre código dentro de Claude Code.
- Higgsfield Create cotiza antes de gastar, pero la generación consume créditos de tu cuenta cuando confirmas.
- Video relacionado: se enlazará aquí cuando esté publicado.

## Cofradía Agéntica

El pack completo —estos dos mods más **Prompt Cache Control** y **Prompt Rail**, con guías de implementación— está en la **[Cofradía Agéntica](https://www.skool.com/cofradia)**.
