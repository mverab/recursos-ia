# De anuncios de referencia a tus propios briefs

Un prompt para pedirle a tu agente de código una **versión básica y local** del flujo del video de Jev + Higgsfield Ads Studio: ordenar referencias, encontrar ángulos y preparar mensajes para tus anuncios.

**Gratis, sin APIs y sin instalar Jev.** Tú eliges las referencias y etiquetas sus ángulos; el programa cuenta esas etiquetas y prepara briefs. No replica las decisiones probabilísticas de Jev ni incluye la automatización del proyecto exclusivo.

## Cómo usarlo

1. Abre tu agente de código favorito en una carpeta vacía.
2. Copia y pega el prompt de abajo. El agente debe construir y probar la herramienta.
3. Contesta sus preguntas sobre tu marca y agrega algunos anuncios de referencia desde la [Biblioteca de anuncios de Meta](https://www.facebook.com/ads/library/).

No necesitas una cuenta publicitaria para construir la herramienta. Usar después Higgsfield Ads Studio requiere tu propia cuenta y puede consumir créditos; este recurso no genera ni publica anuncios.

## Prompt para copiar y pegar

```text
Construye una herramienta sencilla de terminal en Python 3, usando solo la biblioteca estándar. Quiero pasar de anuncios de referencia a briefs para crear mis propios anuncios. Sin web, sin base de datos, sin APIs, sin scraping y sin instalar dependencias.

Antes de escribir archivos, confirma que estamos en una carpeta de proyecto segura y pregunta en un solo mensaje: nombre de mi marca, producto, precio y moneda, público y hechos verificables que podemos mencionar. No inventes beneficios, ofertas ni resultados. Si la carpeta tiene archivos, no los sobrescribas.

Crea únicamente:
- ads_base.py: programa con un menú en español.
- anuncios.csv: referencias vacías, solo con encabezados.
- README.md: instrucciones para ejecutar y una explicación de los límites.

El menú debe permitir:
1. Agregar manualmente una referencia con marca, URL pública, texto del hook, ángulo y CTA. Los ángulos permitidos son beneficio, problema, situación y oferta. Yo elijo la etiqueta; el programa no dice que la haya inferido con IA. Valida la URL como http/https sin descargarla y guarda CSV en UTF-8 usando el módulo csv.
2. Mostrar cuántas referencias hay por ángulo y su porcentaje. Si no hay datos, dilo sin dividir entre cero. No interpretes frecuencia como ventas, rentabilidad ni probabilidad de éxito.
3. Pedirme un hook original para mi marca por cada uno de los tres ángulos más frecuentes y un CTA. En empates, ordena por nombre del ángulo. Si hay menos de tres ángulos, usa solo los que existan; si no hay referencias, pide agregarlas primero. No copies hooks de competidores ni inventes texto como si lo hubiera elegido un modelo.
4. Exportar un archivo briefs.md con mi marca, los datos del producto, el resumen de referencias y los hooks que aprobé. Incluye un prompt en español para Static Ads por cada ángulo elegido: mensaje, público, hechos autorizados y la instrucción de no inventar ofertas ni prestaciones. Añade un bloque separado con el hook de video y otro con el CTA para copiarlos manualmente en Ad Multiplier. No llames a Higgsfield ni prometas que su interfaz acepta un formato determinado.
5. Salir.

Pide la ficha de marca al arrancar; no hace falta persistirla entre sesiones. Permite revisar y corregir los hooks y el CTA antes de exportar. No reemplaces un briefs.md existente sin confirmación. No uses credenciales ni añadas integraciones.

Ejecuta pruebas reales en una carpeta temporal con datos ficticios marcados como tales: CSV vacío, conteos con empates, acentos y comas en los textos, URL inválida y exportación. No dejes esos datos en mi anuncios.csv. Comprueba que el programa inicia y sale correctamente. Al terminar, dime qué probaste realmente y el comando exacto para abrirlo en el entorno donde lo construiste.
```

## Qué revisar antes de generar

- Los hechos de tu producto y el precio son correctos.
- Los hooks son tuyos, no copias de las referencias.
- Los conteos describen **tu muestra**, no todo el mercado.
- Un anuncio activo no demuestra ventas: aquí no se estima rendimiento.
- Revisa texto, tildes, producto y costo antes de generar en Higgsfield.

**Estado:** recurso de instrucciones; no incluye una aplicación ya implementada ni una integración verificada con Jev o Higgsfield. El resultado depende de tu agente: exige que ejecute las pruebas del prompt antes de usarlo.

---

¿Quieres ir más allá de esta base manual? En la **[Cofradía Agéntica](https://www.skool.com/cofradia)** profundizamos en agentes y automatizaciones. Este recurso se puede usar sin entrar a la comunidad.
