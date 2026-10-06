# Procedencia y restricciones

Implementación original de Hermes Agent para esta tarea. Se leyó la referencia de comportamiento existente en `/home/hermes-2/Sync/mkt/claude-mods/referencia-ldn7r/mods-clean-view.txt`, pero no se copió ni incluyó en este proyecto el prompt del creador.

Se consultaron exclusivamente como documentación técnica los tipos y ejemplos oficiales locales:

- `/home/hermes-2/Sync/mkt/claude-mods/fuentes/claude-code/mods/`
- Snapshot git: `8e60c4cac989c0e0cc6d2c49407a5c67f5a4a8e6`.
- `LICENSE.md`: «© Anthropic PBC. All rights reserved. Use is subject to Anthropic's Commercial Terms of Service.» No se interpretó como licencia permisiva.

No se copió código de los ejemplos ni el archivo oficial de declaraciones al repo final. El typecheck apunta a ese archivo externo. Los imports de tipos y el uso del API no implican conceder derechos sobre las fuentes upstream. El código de tests y del mod es original. Dependencias dev instaladas desde npm con lockfile; no se vendorizan sus fuentes.

No se ha elegido una licencia pública para este entregable ni se ha publicado. El owner debe decidir destino/licencia antes de distribuirlo.

Hay una discrepancia del snapshot de tipos de testing: el runtime 2.1.289 permite `$.classic.Notification` en tests (ejercitado), pero el tipo `Engine` no declara `classic`. Un cast estrecho sólo en el test usa el `Args<'classic.Notification'>` oficial; no se modifica ni duplica la declaración upstream.
