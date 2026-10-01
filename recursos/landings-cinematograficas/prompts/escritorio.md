Quiero construir una landing cinematográfica para mi caso de uso. Actúa como director visual y desarrollador: entiende primero el negocio, define una historia visual, produce los recursos aprobados y construye una experiencia desktop funcional. Después haremos el refinamiento móvil con un segundo prompt.

### 1. Recoge mi contexto antes de diseñar

Revisa primero lo que ya te haya compartido en esta conversación o carpeta. No me pidas de nuevo información disponible. Pregunta únicamente lo que falte, en un solo bloque breve:
- Qué negocio, producto o servicio presento, y si es real o ficticio.
- A quién va dirigido y qué propuesta de valor debe entender.
- Qué acción principal quiero que realice el visitante.
- Qué identidad, textos, logo, imágenes o videos propios/autorizados existen.
- Qué límites de presupuesto, herramientas o equipo de ejecución debemos respetar.

Si no tengo identidad, propón una dirección visual original y espera mi elección. Si falta evidencia comercial, no inventes clientes, reseñas, certificaciones, métricas, precios ni disponibilidad. No uses marcas o material ajeno sin autorización. No fabriques recursos inexistentes.

### 2. Define la historia visual para mi negocio

Propón una ruta de tres o cuatro escenas que comunique mi propuesta de valor. Adapta el tipo de recorrido al caso: visita física si vendo un lugar, recorrido del proceso/producto si vendo un objeto, o representación espacial claramente conceptual si explico un servicio. No fuerces una entrada a un edificio cuando no ayude al negocio.

Presenta una tabla con escena, propósito comercial, encuadre, movimiento de cámara y transición. Si la historia lo permite, empieza con una vista de contexto, entra o avanza hacia la experiencia, muestra el detalle importante y termina con un revelado general relacionado con el inicio. Un giro o regreso debe ser físicamente plausible, no una obligación que deforme la escena. No prometas un loop perfecto sin verificarlo.

Buscamos continuidad de cámara y profundidad aparente, no una secuencia de escenas independientes escondida con zooms o crossfades. Mantén escala, geometría, iluminación, objetos y dirección de movimiento. Evita personas y mecanismos complejos si no son necesarios. Explica qué es video generado y qué sería geometría 3D real; no los confundas.

### 3. Comprueba herramientas y genera por etapas

Enumera las herramientas reales disponibles de la integración de imagen/video. Para esta metodología utiliza Higgsfield MCP si está conectado. Consulta modelos, identificadores y parámetros exactos antes de usarlos. No inventes endpoints, costos, capacidad de imagen inicial/final ni nombres de herramientas. Si falta conexión o una capacidad necesaria, dilo y detente en ese punto.

Reutiliza los recursos autorizados que sirvan. Antes de cada generación presenta modelo, parámetros y costo consultable. Si el costo no está disponible, indica la incertidumbre y pide autorización antes de gastar. No ejecutes batches ni reintentos pagados automáticamente.

Primero produce UNA imagen de dirección después de mi autorización y espera revisión. Después propón el menor número de clips que resuelva la ruta aprobada. Genera un clip por autorización. Comprueba que el archivo real decodifica y revisa el movimiento completo, no sólo sus extremos. Extrae el último frame decodificado REAL del clip y úsalo como inicio del siguiente si la herramienta admite esa referencia. No inventes el frame ni uses una captura aproximada como si fuera exacta.

Revisa cada unión y la permanencia de objetos. Si el material es defectuoso, describe la falla y detente antes de gastar otra vez. Registra trabajos, parámetros, referencias y archivos descargados. No publiques recursos ni incluyas credenciales en los registros.

### 4. Construye desktop alrededor de la historia

Usa únicamente los recursos existentes y aprobados. Construye un hero cinematográfico controlado por scroll, con textos HTML accesibles y legibles separados de las imágenes, identidad acorde con el negocio y un CTA conectado a la acción acordada.

Añade sólo las secciones necesarias para convertir: propuesta de valor, producto/experiencia/proceso, información comercial verificada y una acción final. Las interacciones deben ayudar al contenido, no parecer un HUD o un videojuego. No añadas tarjetas apiladas por costumbre.

Para una demo, los formularios y compras son simulados y deben avisarlo; no enviar datos ni cobrar. Para un negocio real, pregunta antes de conectar pagos, envíos, analytics o sistemas externos. No despliegues ni publiques sin autorización.

### 5. Verifica carga y movimiento antes de darlo por terminado

Mide archivos, carga en frío y respuesta al scroll en el entorno real donde se usará. Elige la estrategia de reproducción según evidencia. Si utilizas video, comprueba encoding y HTTP Range. No conviertas indiscriminadamente el master en cientos de imágenes; cualquier secuencia requiere un presupuesto medido de bytes, solicitudes, memoria y precarga.

Muestra una portada mientras carga sin bloquear toda la página. No declares completado el recorrido si sólo está visible la portada. Prueba rueda normal hacia adelante y atrás, navegación, CTA, teclado y ausencia de overflow. Mide el movimiento realmente dibujado y la demora de respuesta: esperar a que llegue al destino no demuestra fluidez.

Entrega el comando local con valores reales resueltos, archivos utilizados, evidencia de pruebas y limitaciones. No inventes cifras, ejecuciones ni éxitos. Si sólo probaste en el servidor o un navegador emulado, indícalo; no lo presentes como prueba en mi equipo. Detente con el desktop revisable antes de pasar al segundo prompt.
