# Glosario - Semana 8: Autorización y Seguridad

## 📚 Terminología de Seguridad

### A

**Access Control (Control de Acceso)**
Mecanismo que determina quién tiene permiso para acceder a recursos o realizar acciones en un sistema.

**Authentication (Autenticación)**
Proceso de verificar la identidad de un usuario o sistema. Responde a la pregunta "¿Quién eres?".

**Authorization (Autorización)**
Proceso de determinar qué permisos tiene un usuario autenticado. Responde a la pregunta "¿Qué puedes hacer?".

### B

**Broken Access Control**
Vulnerabilidad donde usuarios no autorizados pueden acceder a recursos o funciones que deberían estar restringidas.

**Brute Force Attack**
Ataque que intenta adivinar credenciales probando muchas combinaciones posibles.

### C

**Content Security Policy (CSP)**
Cabecera HTTP que controla qué recursos el navegador puede cargar para una página, previniendo ataques XSS.

**Cross-Origin Resource Sharing (CORS)**
Mecanismo de seguridad que permite o restringe requests HTTP entre diferentes dominios.

**Cross-Site Scripting (XSS)**
Vulnerabilidad que permite inyectar scripts maliciosos en páginas web vistas por otros usuarios.

**Clickjacking**
Ataque que engaña al usuario para que haga clic en algo diferente de lo que percibe, ocultando la interfaz real.

### D

**DDoS (Distributed Denial of Service)**
Ataque que sobrecarga un servidor con un gran volumen de tráfico desde múltiples fuentes.

**Defense in Depth (Defensa en Profundidad)**
Estrategia de seguridad que utiliza múltiples capas de defensa para proteger contra vulnerabilidades.

### E

**Express Rate Limit**
Middleware para Express.js que implementa rate limiting para proteger contra ataques de fuerza bruta y DDoS.

### H

**Helmet**
Middleware para Express.js que configura automáticamente varias cabeceras HTTP de seguridad.

**HTTP Strict Transport Security (HSTS)**
Cabecera HTTP que fuerza al navegador a usar siempre HTTPS para comunicarse con el servidor.

**HttpOnly Cookie**
Cookie que no puede ser accedida por JavaScript, previniendo robo de tokens a través de XSS.

### I

**Injection**
Vulnerabilidad donde datos no confiables son interpretados como comandos o queries.

**Input Validation**
Proceso de verificar que los datos de entrada cumplen con los criterios esperados antes de procesarlos.

**Input Sanitization**
Proceso de limpiar los datos de entrada para eliminar caracteres peligrosos.

### J

**JSON Web Token (JWT)**
Token compacto y URL-safe que representa claims transferidos entre dos partes.

### M

**Man-in-the-Middle (MITM) Attack**
Ataque donde un atacante intercepta y potencialmente altera la comunicación entre dos partes.

**Middleware**
Software que maneja tareas comunes entre aplicaciones y el sistema operativo, en Express.js procesa requests antes de llegar a los controladores.

**MIME-Sniffing**
Técnica del navegador para determinar el tipo de contenido de un archivo, que puede ser explotada por atacantes.

### N

**NoSQL Injection**
Ataque similar a SQL injection pero orientado a bases de datos NoSQL como MongoDB.

### O

**OWASP (Open Web Application Security Project)**
Organización sin fines de lucro enfocada en mejorar la seguridad de software.

**OWASP Top 10**
Lista de las 10 vulnerabilidades de seguridad web más críticas, actualizada regularmente.

### P

**Path Traversal**
Vulnerabilidad que permite acceder a archivos y directorios fuera del directorio web previsto.

**Preflight Request**
Request OPTIONS que el navegador hace antes de una request cross-origin para verificar si está permitida.

**Principle of Least Privilege**
Principio de seguridad que otorga solo los permisos mínimos necesarios para realizar una tarea.

### R

**Rate Limiting**
Técnica que limita la cantidad de requests que un cliente puede hacer en un período de tiempo.

**RBAC (Role-Based Access Control)**
Modelo de control de acceso donde los permisos se asignan a roles, y los roles se asignan a usuarios.

**Referrer Policy**
Cabecera HTTP que controla qué información del referer se incluye en las requests.

**Role (Rol)**
Conjunto de permisos asignados a un usuario que determina qué puede hacer en el sistema.

### S

**Same-Origin Policy**
Política de seguridad del navegador que restringe cómo un documento o script de un origen puede interactuar con recursos de otro origen.

**Sanitization**
Proceso de limpiar datos de entrada para eliminar caracteres peligrosos o formatearlos correctamente.

**Security Headers**
Cabeceras HTTP que mejoran la seguridad de una aplicación web.

**Server-Side Request Forgery (SSRF)**
Vulnerabilidad donde un servidor es forzado a hacer requests a recursos internos por un atacante.

**Session Hijacking**
Ataque donde un atacante toma control de la sesión de un usuario legítimo.

**Session Fixation**
Ataque donde un atacante fija el identificador de sesión de un usuario antes de que este inicie sesión.

### T

**Token**
Pieza de datos que representa la identidad o permisos de un usuario, usada para autenticación y autorización.

### W

**Whitelist**
Lista de elementos permitidos (opuesto a blacklist que lista elementos prohibidos).

**X-Content-Type-Options**
Cabecera HTTP que previene MIME-sniffing obligando al navegador a respetar el Content-Type declarado.

**X-Frame-Options**
Cabecera HTTP que previene clickjacking controlando si una página puede ser mostrada en un frame.

**X-XSS-Protection**
Cabecera HTTP que activa el filtro XSS del navegador (obsoleto pero aún soportado).

### Z

**Zod**
Biblioteca de validación de schemas para TypeScript y JavaScript que permite validar y sanitizar datos.

## 🔐 Términos Técnicos Específicos

### Middleware de Seguridad

**requireAuth()**
Middleware que verifica que el usuario esté autenticado mediante un token JWT válido.

**requireRole()**
Middleware que verifica que el usuario tenga un rol específico para acceder a una ruta.

**generalLimiter**
Configuración de rate limiting que aplica a toda la API con límites moderados.

**strictLimiter**
Configuración de rate limiting con límites muy estrictos para endpoints sensibles como login.

### Vulnerabilidades OWASP Top 10

**A01: Broken Access Control**
Fallas en el control de acceso que permiten acceso no autorizado a recursos.

**A02: Cryptographic Failures**
Fallas relacionadas con criptografía y protección de datos sensibles.

**A03: Injection**
Inyección de código o comandos a través de inputs no validados.

**A04: Insecure Design**
Fallas en el diseño de la arquitectura de seguridad.

**A05: Security Misconfiguration**
Configuraciones incorrectas o por defecto inseguras.

**A06: Vulnerable and Outdated Components**
Uso de componentes con vulnerabilidades conocidas.

**A07: Identification and Authentication Failures**
Fallas en la identificación y autenticación de usuarios.

**A08: Software and Data Integrity Failures**
Fallas en la integridad de software y datos.

**A09: Security Logging and Monitoring Failures**
Fallas en el logging y monitoreo de seguridad.

**A10: Server-Side Request Forgery (SSRF)**
El servidor es forzado a hacer requests a recursos internos.

## 🛠️ Herramientas y Tecnologías

**bcrypt**
Biblioteca para hashear passwords de forma segura.

**cookie-parser**
Middleware de Express para parsear cookies HTTP.

**cors**
Middleware de Express para habilitar CORS con varias opciones de configuración.

**express-rate-limit**
Middleware de Express para implementar rate limiting.

**helmet**
Middleware de Express para configurar cabeceras de seguridad HTTP.

**jsonwebtoken**
Biblioteca para crear y verificar JWT tokens.

**morgan**
Middleware de logging HTTP para Express.

**zod**
Biblioteca de validación de schemas para TypeScript y JavaScript.

## 📊 Conceptos de Arquitectura

**Defense in Depth (Defensa en Profundidad)**
Estrategia que utiliza múltiples capas de seguridad para que si una falla, otras protejan el sistema.

**Layered Security (Seguridad por Capas)**
Enfoque que implementa seguridad en múltiples niveles: red, aplicación, datos, etc.

**Security by Design (Seguridad desde el Diseño)**
Enfoque que considera la seguridad desde el inicio del desarrollo, no como una adición posterior.

**Whitelist vs Blacklist**
Whitelist: permite solo elementos específicos (más seguro)
Blacklist: bloquea elementos específicos (menos seguro)

## 🔒 Patrones de Seguridad

**Authentication Pattern**
Patrón para implementar autenticación segura usando tokens, sesiones, etc.

**Authorization Pattern**
Patrón para implementar control de acceso usando RBAC, ABAC, etc.

**Validation Pattern**
Patrón para validar y sanitizar inputs en múltiples capas.

**Error Handling Pattern**
Patrón para manejar errores sin exponer información sensible.

## 🌐 Protocolos y Estándares

**HTTP**
Protocolo de transferencia de hipertexto, base de la comunicación web.

**HTTPS**
Versión segura de HTTP que utiliza TLS/SSL para encriptar la comunicación.

**TLS/SSL**
Protocolos criptográficos que proporcionan comunicaciones seguras sobre una red.

**RFC (Request for Comments)**
Documentos oficiales de la IETF que describen estándares de internet.

## 📈 Métricas de Seguridad

**False Positive**
Alerta de seguridad que indica un problema cuando no existe.

**False Negative**
Falla en detectar un problema de seguridad real.

**Security Debt**
Déficit técnico relacionado con medidas de seguridad no implementadas.

**Vulnerability Severity**
Nivel de gravedad de una vulnerabilidad (crítico, alto, medio, bajo).

## 🎓 Términos Educativos

**Bootcamp**
Programa intensivo de entrenamiento técnico.

**Learning Path**
Ruta estructurada de aprendizaje para adquirir habilidades específicas.

**Hands-on Learning**
Aprendizaje práctico mediante implementación real de proyectos.

**Best Practices**
Prácticas recomendadas por la industria para lograr resultados óptimos.

---

**Este glosario cubre los términos clave de la semana 8 sobre autorización y seguridad.**
