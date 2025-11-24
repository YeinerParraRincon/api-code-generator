function explicacionConsumir() {
    const url = document.getElementById("courseUrl").value;
    const method = document.getElementById("courseMethod").value;
    const lenguaje = document.getElementById("courseLanguage").value;

    if (!url) {
        alert("Por favor ingresa una URL válida");
        return;
    }

    let example = `🔥 CURSO: ¿Cómo consumir esta API?\n\n`;
    example += `📌 URL que vas a consumir:\n${url}\n\n`;
    example += `📌 Método HTTP:\n${method}\n\n`;
    example += `📌 Lenguaje seleccionado:\n${lenguaje}\n\n`;
    example += `=====================================\n`;
    example += `📘 EJEMPLO DE CÓDIGO\n`;
    example += `=====================================\n\n`;

    if (lenguaje == "js") {
        example += `// Paso 1: Usamos fetch para hacer la petición\n`;
        example += `fetch("${url}", {\n`;
        example += `  method: "${method}",\n`;
        example += `})\n`;
        example += `  .then(res => res.json())\n`;
        example += `  .then(data => console.log(data))\n`;
        example += `  .catch(err => console.error("Error:", err));\n`;
    } 
    else if (lenguaje == "axios") {
        example += `// Usando Axios\n`;
        example += `axios.${method.toLowerCase()}("${url}")\n`;
        example += `  .then(res => console.log(res.data))\n`;
        example += `  .catch(err => console.error(err));\n`;
    }
    else if (lenguaje == "python") {
        example += `import requests\n\n`;
        example += `response = requests.${method.toLowerCase()}("${url}")\n`;
        example += `print(response.json())\n`;
    }
    else if (lenguaje == "curl") {
        example += `curl -X ${method} "${url}"\n`;
    }

    document.getElementById("courseResult").classList.remove("hidden");
    document.getElementById("courseCode").textContent = example;
}


document.getElementById("mostrarTabla").addEventListener("click", async () => {
    const url = document.getElementById("courseUrl").value;

    if (!url.trim()) {
        alert("Primero ingresa la URL de la API");
        return;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        const arrayData = Array.isArray(data) ? data : (data.results || [data]);

        if (!Array.isArray(arrayData)) {
            alert("La API no devolvió datos válidos para tabla");
            return;
        }

        const keys = Object.keys(arrayData[0]);

        let tableCode = `// Ejemplo para mostrar datos de la API en una tabla\n`;
        tableCode += `fetch("${url}")\n`;
        tableCode += `  .then(res => res.json())\n`;
        tableCode += `  .then(data => {\n`;
        tableCode += `      const rows = Array.isArray(data) ? data : data.results;\n`;
        tableCode += `      let html = "<table border='1'>";\n`;
        
        tableCode += `      html += "<tr>";\n`;
        keys.forEach(k => {
            tableCode += `      html += "<th>${k}</th>";\n`;
        });
        tableCode += `      html += "</tr>";\n`;

        tableCode += `      rows.forEach(item => {\n`;
        tableCode += `          html += "<tr>";\n`;
        keys.forEach(k => {
            let value = JSON.stringify(arrayData[0][k]).replace(/"/g, "'");
            tableCode += `          html += "<td>" + item["${k}"] + "</td>";\n`;
        });
        tableCode += `          html += "</tr>";\n`;
        tableCode += `      });\n`;

        tableCode += `      html += "</table>";\n`;
        tableCode += `      document.body.innerHTML += html;\n`;
        tableCode += `  })\n`;
        tableCode += `  .catch(err => console.error("Error:", err));`;

        document.getElementById("courseResult").classList.remove("hidden");
        document.getElementById("courseCode").textContent = tableCode;

    } catch (error) {
        alert("Error al consumir la API");
        console.error(error);
    }
});
