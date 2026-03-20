# ⚙️ Generador Automático de Código para APIs

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Herramienta web que genera automáticamente código JavaScript para consumir cualquier API con `fetch`. Incluye generador de código, probador de APIs en vivo y un curso interactivo para aprender a consumir APIs desde cero.

---


## ✨ Funcionalidades

### ⚡ Generador de código
- 🔗 Ingresa la **URL** de cualquier API
- ⚙️ Selecciona el **método HTTP** (`GET`, `POST`, `PUT`, `DELETE`)
- 🧠 Elige el **lenguaje** (JavaScript con Fetch)
- `</> Generar Código` — genera el código listo para copiar y usar
- `🚀 Probar API` — hace la petición en vivo y muestra la respuesta real
- `🧹 Limpiar` — limpia todos los campos del formulario

### 💡 APIs de ejemplo incluidas
La herramienta trae APIs de ejemplo listas para probar con un clic:

| API | URL |
|-----|-----|
| JSONPlaceholder | `https://jsonplaceholder.typicode.com/users` |
| REST Countries | `https://restcountries.com/v3.1/all` |
| Dog API | `https://api.thedogapi.com/v1/breeds` |

### 📚 Curso: Cómo consumir APIs
Sección educativa integrada que enseña a consumir APIs desde cero:
- Ingresa una URL y método para ver un **ejemplo explicado paso a paso**
- Botón **"Generar Ejemplo Explicado"** — muestra el código con comentarios didácticos
- Botón **"Mostrar cómo se vería en una tabla"** — visualiza la respuesta de la API en formato tabla
- Botón **"Volver"** — regresa al generador principal

---

## 🚀 Cómo usarlo

1. Clona el repositorio:
```bash
git clone https://github.com/YeinerParraRincon/api-code-generator.git
```

2. Abre `index.html` directamente en tu navegador.

> No requiere instalaciones ni dependencias. Funciona 100% en el navegador.

---

## 🎮 Flujo de uso
```
1. Ingresa la URL de una API
        ↓
2. Selecciona el método HTTP (GET, POST, PUT, DELETE)
        ↓
3. Elige el lenguaje (JavaScript Fetch)
        ↓
   ┌────────────────┬──────────────────┐
   │ Generar Código │   Probar API     │
   │  (ver código)  │ (ver respuesta)  │
   └────────────────┴──────────────────┘
        ↓
4. ¿Quieres aprender? → Curso de cómo consumir APIs
        ↓
   - Ejemplo explicado con comentarios
   - Ver respuesta en tabla visual
```

---

## 📁 Estructura del proyecto
```
api-code-generator/
├── index.html        # Pantalla principal — generador
├── curso.html        # Pantalla del curso interactivo
├── style.css         # Estilos adicionales
└── js/
    └── app.js        # Lógica del generador, probador y curso
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura de las páginas |
| TailwindCSS | Diseño oscuro y estilos de la interfaz |
| JavaScript | Generador de código, fetch en vivo y curso |

---

## 👤 Autor

**Yeiner Parra Rincón**  
[GitHub](https://github.com/YeinerParraRincon)
