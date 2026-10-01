# Landing cinematográfica con dos prompts

Construye una landing con un recorrido de video generado controlado por scroll, usando un prompt para escritorio y otro para refinar móvil. El agente recoge contigo el contexto del negocio: los prompts no traen una marca ni un escenario obligatorio.

## Qué incluye

- [Prompt de escritorio](prompts/escritorio.md): contexto, storyboard, generación por etapas, construcción y pruebas.
- [Prompt de móvil](prompts/movil.md): reutilización de assets, adaptación y pruebas de ambos formatos.
- [Checklist](checklist.md): integración, autorizaciones, continuidad y rendimiento.

## Requisitos

- Un agente de código con acceso a una carpeta de proyecto independiente.
- Una integración real de generación de imagen y video. El flujo de la demostración utiliza Claude con Higgsfield MCP; estos archivos no instalan ni configuran esa conexión.
- Cuenta y créditos suficientes para las generaciones que autorices. Consulta disponibilidad y costo actuales en la herramienta, no asumas modelos o precios fijos.
- Un navegador local y recursos propios o autorizados si los vas a reutilizar.

## Uso paso a paso

1. Abre tu agente en un proyecto independiente y verifica las herramientas de generación disponibles, sin gastar créditos.
2. Copia **todo** el contenido de `prompts/escritorio.md` y pégalo en el agente.
3. Responde el bloque de preguntas con tu negocio, audiencia, CTA, identidad y presupuesto.
4. Revisa la propuesta visual. Autoriza la imagen y cada clip por separado; no autorices un batch a ciegas.
5. Revisa continuidad y movimiento de los archivos reales; prueba escritorio con carga nueva y scroll hacia adelante y atrás.
6. Copia `prompts/movil.md` después de revisar escritorio. Reutiliza los mismos assets.
7. Usa el checklist antes de dar por terminada la experiencia. Publicar o desplegar es un paso aparte que debes autorizar.

## Variables que debes reemplazar

**Ninguna dentro de los prompts.** El agente te pregunta por el contexto que falte. Tu negocio, CTA, presupuesto, identidad y recursos se comunican como respuestas, no editando marcadores de posición.

## Qué es y qué no es

Es video generado con profundidad aparente, no un mundo 3D navegable. No asegura un loop perfecto, continuidad sin defectos ni rendimiento adecuado sin pruebas. Un recorrido físico no tiene sentido para todos los servicios: la dirección visual debe adaptarse al caso.

Los formularios y compras de una demo son simulados y deben avisarlo. No conectar pagos ni enviar datos sin autorización. Corregir código no exige generar de nuevo; reemplazar una toma sí puede consumir créditos.

## Estado de verificación

Este recurso publica prompts y una guía; **no incluye una landing lista para producción**. La integración CLI de generación se utilizó en la preparación del ejemplo, pero eso no certifica Higgsfield MCP en tu agente. El primer prototipo tuvo problemas de movimiento y carga y fue corregido localmente por el creador; esa versión local no está auditada aquí. Los prompts incluyen controles para detectar esos problemas, no una garantía de haberlos eliminado en cualquier implementación.

La revisión de este repositorio comprueba estructura, enlaces relativos, separación de los prompts y ausencia de información privada detectada. No sustituye una prueba de generación y reproducción en tu equipo.

## Video asociado

El video propio que acompaña este recurso todavía no está publicado. Su enlace se añadirá cuando exista; no hay un enlace ficticio ni se presenta el video de referencia como propio.

## Qué NO debes publicar

Credenciales, claves, cookies, correos, briefs de campaña, datos de clientes o material de terceros sin autorización. Este recurso no distribuye las imágenes ni los videos de la campaña.

## Sigue aprendiendo

Para profundizar en agentes y desarrollar implementaciones con acompañamiento, conoce la **[Cofradía Agéntica](https://www.skool.com/cofradia)**.
