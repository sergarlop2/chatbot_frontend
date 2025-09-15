# Modelo de lenguaje generativo para tutor en sistemas de comunicaciones digitales

### Trabajo Fin de Máster. Máster en Ingeniería de Telecomunicación

Sergio García López. Universidad de Sevilla. 2025

## Resumen

En los últimos años, los denominados LLMs (Large Language Models) han transformado los campos de la 
inteligencia artificial y del procesamiento del lenguaje natural. Estos sistemas, basados en arquitecturas 
neuronales avanzadas como el modelo Transformer y entrenados con cantidades masivas de datos, han 
demostrado una capacidad sin precedentes para generar textos coherentes y contextualizados. Dichos modelos 
han redefinido aplicaciones prácticas en áreas como la traducción automática, la atención al cliente, la 
clasificación de documentos e incluso la asistencia en investigación científica. Sin embargo, su rápido desarrollo 
plantea desafíos críticos en términos de ética, sesgos de entrenamiento, sostenibilidad computacional y 
adaptación a contextos específicos. 

Dentro de este marco, este Trabajo Fin de Máster propone adaptar un LLM de código abierto preentrenado, 
como es el caso de Llama 3.1, mediante técnicas RAG (Retrieval Augmented Generation) para que actúe como 
un tutor especializado en el ámbito de los sistemas de comunicaciones digitales. Para ello, se utilizará una 
arquitectura basada en LangChain y ChromaDB, con el objetivo de realizar búsquedas semánticas sobre una 
base de datos vectorial construida a partir de documentos académicos del área de interés. Dichos documentos 
serán segmentados en fragmentos de texto y vectorizados mediante un modelo de embedding del framework 
Hugging Face para almacenarlos en ChromaDB. Tras realizar la búsqueda semántica, los fragmentos más 
relevantes se incorporarán dinámicamente al prompt del LLM, con el fin de generar respuestas contextualizadas 
y alineadas con la consulta. Además, se empleará la librería Transformers de Hugging Face tanto para la 
ejecución local del modelo como para aprovechar sus herramientas de cuantización, permitiendo reducir 
significativamente el tiempo de inferencia sin comprometer en exceso la precisión de las respuestas generadas.

<img width="1920" height="1080" alt="Arquitectura_TFM" src="https://github.com/user-attachments/assets/d4aec3b2-3bf1-443a-b86e-7e35024bcc4f" />

## Frontend

El frontend constituye el componente que habilita la interacción con el asistente experto en sistemas de comunicaciones digitales. Para ello, se ha desarrollado una interfaz de tipo chat, a través de la cual se puede mantener una conversación con el modelo de lenguaje y administrar la información almacenada en el sistema RAG.

Las principales funcionalidades de la interfaz de usuario son las siguientes:

- **Interacción conversacional con el LLM**: La interfaz reproduce el esquema de conversación empleado por los asistentes más conocidos basados en LLMs. El usuario puede enviar preguntas al modelo de lenguaje y recibir respuestas en tiempo real, manteniendo un historial de mensajes que facilita la continuidad del diálogo. El sistema implementa además una ventana de contexto que asegura la coherencia de las respuestas, incorporando los mensajes previos en las consultas al modelo.

- **Limpieza del historial de mensajes**: El frontend incorpora una opción para reiniciar la conversación mediante la eliminación completa del historial de mensajes. De esta forma, se puede comenzar una nueva conversación sin arrastrar el contexto de interacciones anteriores, otorgando una mayor flexibilidad al sistema.

- **Edición del system prompt**: La aplicación permite modificar las instrucciones que guían el comportamiento del modelo **Llama 3.1**, las cuales se incluyen en cada interacción con el modelo. El *system prompt* se almacena de forma persistente para cada usuario, de manera que los cambios realizados permanecen activos en conversaciones posteriores.

- **Gestión de documentos del sistema RAG**: La interfaz integra herramientas para administrar la base de conocimiento empleada en la recuperación de información. Entre las funcionalidades disponibles se incluyen:
  - **Subida de nuevos documentos**, que son posteriormente procesados y vectorizados para incorporarse a la base de datos.  
  - **Descarga de documentos almacenados**, lo que permite al usuario revisar y reutilizar el material incluido en el sistema.  
  - **Eliminación de documentos**, asegurando la actualización y depuración de la información almacenada en el sistema RAG.
 
La implementación del frontend se ha llevado a cabo mediante React en combinación con TypeScript, lo que ha permitido desarrollar una aplicación mantenible, robusta y dividida en componentes, favoreciendo así la modularidad del sistema. La comunicación con el backend se realiza a través de peticiones HTTP dirigidas a la API REST, enviando los datos en formato JSON para garantizar la compatibilidad y la simplicidad en la integración.

<div align="center">
<img width="614" height="588" alt="fadingAI" src="https://github.com/user-attachments/assets/a5c30579-d9a6-440e-b103-66cd7a4db76d" />
</div>

<div align="center">
<img width="469" height="401" alt="menuInterfaz" src="https://github.com/user-attachments/assets/5d3e975a-6ee5-406b-abdf-1a3a04f75c74" />
</div>

### Despliegue del frontend

El despliegue del frontend de este proyecto se ha realizado mediante **Vite**, una herramienta de desarrollo y compilación de interfaces de usuario que destaca por su rapidez y eficiencia. Vite aprovecha la carga nativa de módulos y librerías en el navegador, lo que permite reducir de forma notable los tiempos de arranque de la aplicación. Además, incluye un sistema de compilación optimizado capaz de generar un conjunto de ficheros estáticos listos para ser distribuidos en producción.

Este proceso se apoya en **Node.js**, que actúa como servidor en las fases de desarrollo y compilación. Node se encarga de gestionar las dependencias del proyecto, levantar el servidor local y orquestar la construcción de la aplicación final. Gracias a ello, la aplicación puede desarrollarse y probarse de manera fluida, y posteriormente distribuirse como un conjunto de archivos independientes, preparados para ejecutarse en cualquier servidor web convencional.
En combinación con React, Vite ofrece un flujo de trabajo ágil, con recarga instantánea de módulos y compatibilidad nativa con JavaScript y TypeScript. Esto permite que la fase de desarrollo sea más interactiva y eficiente, simplificando además la preparación del frontend para entornos reales y garantizando un rendimiento óptimo en producción.

Durante la etapa de desarrollo, podemos ejecutar el frontend en un servidor local con Node mediante el comando:

```bash
npm run dev
```

Una vez finalizada la fase de desarrollo, Vite permite compilar la aplicación y generar una versión optimizada mediante el comando:

```bash
npm run build
```

Este comando genera un conjunto de ficheros HTML, CSS y JavaScript, y los agrupa en el directorio `dist`. Estos ficheros pueden ser desplegados en cualquier servidor web o servicio de hosting estático, como Nginx, Apache, GitHub Pages o plataformas en la nube, sin necesidad de que Node.js esté presente en el entorno de producción

