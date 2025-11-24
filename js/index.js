// CONFIG: configuración global usada por varias funciones
const CONFIG = {
    maxTableRows: 100,   // número máximo de filas a mostrar en la tabla (evita renderizar miles de filas)
    timeout: 30000       // tiempo máximo de espera para peticiones (en ms)
};

////////////////////////////////////////////////////////////////////////////////
// Evento DOMContentLoaded: inicialización cuando el HTML terminó de cargar //
////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Mensaje en consola para saber que el script ya está activo
    console.log('🚀 Aplicación cargada correctamente');
    
    // Cuando cambie el select de método (GET, POST...) togglear la visibilidad del body
    document.getElementById('method').addEventListener('change', function() {
        toggleBodyBox();
        toggleHeadersBox();
    });
    
    // Cuando cambie el lenguaje (js, axios, python, curl) actualizar la visibilidad de headers
    document.getElementById('language').addEventListener('change', function() {
        toggleHeadersBox();
    });
    
    // Cargar ejemplos guardados (placeholder — la función sólo notifica por ahora)
    loadSavedExamples();
});

/////////////////////////////////////////////////////////
// Funciones para mostrar/ocultar cajas del formulario //
/////////////////////////////////////////////////////////

// Muestra el textarea de body sólo si el método lo requiere (POST, PUT, PATCH)
function toggleBodyBox() {
    const method = document.getElementById('method').value;
    const bodyBox = document.getElementById('bodyBox');
    
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        bodyBox.classList.remove('hidden'); // mostrar
    } else {
        bodyBox.classList.add('hidden');    // ocultar
    }
}

// Muestra/oculta la caja de headers dependiendo del lenguaje seleccionado.
// En curl no se necesita un editor de headers separado porque en cURL los headers se incluyen en la línea de comando.
function toggleHeadersBox() {
    const language = document.getElementById('language').value;
    const headersBox = document.getElementById('headersBox');
    
    if (language !== 'curl') {
        headersBox.classList.remove('hidden');
    } else {
        headersBox.classList.add('hidden');
    }
}

/////////////////////////////////////////
// Cargar ejemplos predefinidos (UI)   //
/////////////////////////////////////////
function loadExample(type) {
    // Diccionario de ejemplos con URL, método y headers opcionales
    const examples = {
        jsonplaceholder: {
            url: 'https://jsonplaceholder.typicode.com/users',
            method: 'GET'
        },
        restcountries: {
            url: 'https://restcountries.com/v3.1/all',
            method: 'GET'
        },
        dogapi: {
            url: 'https://api.thedogapi.com/v1/breeds',
            method: 'GET',
            headers: '{"x-api-key": "demo-key"}' // ejemplo de headers en formato JSON
        }
    };
    
    const example = examples[type];
    if (example) {
        // Rellenar los campos del formulario con el ejemplo elegido
        document.getElementById('apiUrl').value = example.url;
        document.getElementById('method').value = example.method;
        document.getElementById('headers').value = example.headers || '';
        
        // Actualizar visibilidad de cajas (por si el método cambia)
        toggleBodyBox();
        toggleHeadersBox();
        
        // Notificación visual al usuario
        showNotification(`Ejemplo "${type}" cargado`, 'success');
    }
}

// Placeholder: en esta versión sólo hay un console.log. Podrías guardar ejemplos en localStorage aquí.
function loadSavedExamples() {
    console.log('💡 Ejemplos listos para usar');
}

////////////////////////////////////////////////////////
// Generación de código (JS Fetch, Axios, Python, cURL)
////////////////////////////////////////////////////////
function generateCode() {
    // Recoger valores del formulario
    const url = document.getElementById('apiUrl').value;
    const method = document.getElementById('method').value;
    const body = document.getElementById('jsonBody').value;
    const headers = document.getElementById('headers').value;
    const language = document.getElementById('language').value;

    // Validación básica: URL requerida
    if (!url) {
        showNotification('❌ Por favor ingresa una URL de API válida', 'error');
        return;
    }

    let code = '';
    let parsedHeaders = {};
    let parsedBody = {};

    // Intentar parsear headers y body desde JSON (los campos son textarea donde el usuario escribe JSON)
    try {
        if (headers) parsedHeaders = JSON.parse(headers);
        if (body) parsedBody = JSON.parse(body);
    } catch (e) {
        // Si el JSON está mal formado, avisar y no generar código
        showNotification('❌ JSON inválido en headers o body', 'error');
        return;
    }

    // Seleccionar la plantilla de código a generar según el lenguaje elegido
    switch (language) {
        case 'js':
            code = generateJSCode(url, method, parsedBody, parsedHeaders);
            break;
        case 'axios':
            code = generateAxiosCode(url, method, parsedBody, parsedHeaders);
            break;
        case 'python':
            code = generatePythonCode(url, method, parsedBody, parsedHeaders);
            break;
        case 'curl':
            code = generateCurlCode(url, method, parsedBody, parsedHeaders);
            break;
    }

    // Mostrar el código generado en el UI
    document.getElementById('codeResult').textContent = code;
    document.getElementById('output').classList.remove('hidden');
    
    // Llevar la vista al resultado para mejorar UX
    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('✅ Código generado correctamente', 'success');
}

/////////////////////////////////////////////////////
// Plantillas de generación de código por lenguaje //
/////////////////////////////////////////////////////

// Plantilla JavaScript usando fetch y async/await
function generateJSCode(url, method, body, headers) {
    // Determinar si hay body (y si el método lo permite)
    const hasBody = Object.keys(body).length > 0 && (method === 'POST' || method === 'PUT' || method === 'PATCH');
    const hasHeaders = Object.keys(headers).length > 0;

    // Construcción de la plantilla como string. Se respetan los headers y body si existen.
    return `// Código generado automáticamente
async function fetchData() {
    const url = "${url}";
    const options = {
        method: "${method}"${hasHeaders ? ',' : ''}
        ${hasHeaders ? `headers: ${JSON.stringify(headers, null, 8)}${hasBody ? ',' : ''}` : ''}
        ${hasBody ? `body: JSON.stringify(${JSON.stringify(body, null, 8)})` : ''}
    };

    try {
        console.log('🔄 Realizando petición...');
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        const data = await response.json();
        console.log('✅ Datos obtenidos:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Uso
fetchData()
    .then(data => console.log('Datos:', data))
    .catch(error => console.error('Error:', error));`;
}

// Plantilla usando Axios (útil en Node.js o front con axios instalado)
function generateAxiosCode(url, method, body, headers) {
    const hasBody = Object.keys(body).length > 0 && (method === 'POST' || method === 'PUT' || method === 'PATCH');
    
    return `// Código generado automáticamente (Axios)
const axios = require('axios');

async function fetchData() {
    const config = {
        method: '${method}',
        url: '${url}',
        ${Object.keys(headers).length > 0 ? `headers: ${JSON.stringify(headers, null, 8)},` : ''}
        ${hasBody ? `data: ${JSON.stringify(body, null, 8)}` : ''}
    };

    try {
        console.log('🔄 Realizando petición...');
        const response = await axios(config);
        console.log('✅ Datos obtenidos:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        throw error;
    }
}

// Uso
fetchData()
    .then(data => console.log('Datos:', data))
    .catch(error => console.error('Error:', error));`;
}

// Plantilla Python con requests
function generatePythonCode(url, method, body, headers) {
    const hasBody = Object.keys(body).length > 0 && (method === 'POST' || method === 'PUT' || method === 'PATCH');
    
    return `# Código generado automáticamente
import requests
import json

def fetch_data():
    url = "${url}"
    headers = ${JSON.stringify(headers, null, 4)}
    
    try:
        print('🔄 Realizando petición...')
        
        if '${method}' == 'GET':
            response = requests.get(url, headers=headers)
        elif '${method}' == 'POST':
            response = requests.post(url, json=${JSON.stringify(body, null, 8)}, headers=headers)
        elif '${method}' == 'PUT':
            response = requests.put(url, json=${JSON.stringify(body, null, 8)}, headers=headers)
        elif '${method}' == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError('Método no soportado')
        
        response.raise_for_status()
        data = response.json()
        print('✅ Datos obtenidos correctamente')
        return data
        
    except requests.exceptions.RequestException as e:
        print(f'❌ Error de conexión: {e}')
        raise
    except Exception as e:
        print(f'❌ Error: {e}')
        raise

# Uso
if __name__ == "__main__":
    data = fetch_data()
    print('Datos:', data)`;
}

// Plantilla cURL
function generateCurlCode(url, method, body, headers) {
    let curl = `curl -X ${method} \\\n  "${url}"`;
    
    // Añadir headers uno por uno
    Object.entries(headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
    });
    
    // Añadir body si corresponde
    if (Object.keys(body).length > 0 && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        curl += ` \\\n  -d '${JSON.stringify(body)}'`;
    }
    
    return `# Código generado automáticamente (cURL)
${curl}`;
}

//////////////////////////////////////////////////////////
// Función que consume la API y muestra resultados/tabla //
//////////////////////////////////////////////////////////
async function fetchAndShowTable() {
    // Recoger inputs
    const url = document.getElementById('apiUrl').value;
    const method = document.getElementById('method').value;
    const body = document.getElementById('jsonBody').value;
    const headers = document.getElementById('headers').value;

    // Validación rápida
    if (!url) {
        showNotification('❌ Por favor ingresa una URL de API válida', 'error');
        return;
    }

    // Mostrar overlay de carga
    showLoading();

    try {
        console.log('🔄 Iniciando petición a la API...');
        
        // Preparar options de fetch (incluye timeout usando AbortSignal.timeout)
        const options = {
            method: method,
            headers: {},
            signal: AbortSignal.timeout(CONFIG.timeout)
        };

        // Si el usuario puso headers, intentar parsearlos como JSON
        if (headers) {
            try {
                options.headers = { ...options.headers, ...JSON.parse(headers) };
            } catch (e) {
                throw new Error('Headers JSON inválido');
            }
        }

        // Si el método admite body y el usuario lo puso, parsearlo y asignarlo
        if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && body) {
            try {
                const parsedBody = JSON.parse(body);
                // Si no se definió Content-Type, asumimos application/json
                if (!options.headers['Content-Type']) {
                    options.headers['Content-Type'] = 'application/json';
                }
                options.body = JSON.stringify(parsedBody);
            } catch (e) {
                throw new Error('Body JSON inválido');
            }
        }

        // Ejecutar fetch
        const response = await fetch(url, options);
        
        // Manejo de códigos HTTP no OK
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Intentar parsear JSON (si la API devuelve otro tipo, esto fallará)
        const data = await response.json();
        
        // Mostrar estadísticas y la tabla con datos
        showApiStats(data, response);
        renderTable(data);
        
        showNotification('✅ API consumida correctamente', 'success');

    } catch (error) {
        // Log y renderizado de error en UI
        console.error('❌ Error completo:', error);
        handleApiError(error, url, method);
    } finally {
        // Siempre ocultar el loading
        hideLoading();
    }
}

//////////////////////////////////////
// Mostrar estadísticas de la API   //
//////////////////////////////////////
function showApiStats(data, response) {
    const statsContent = document.getElementById('statsContent');
    const apiStats = document.getElementById('apiStats');
    
    // Tamaño en bytes del JSON recibido
    let dataSize = new Blob([JSON.stringify(data)]).size;
    let rowCount = 0;
    
    // Si es un array, filas = length. Si es objeto buscar arrays internos y sumar sus longitudes.
    if (Array.isArray(data)) {
        rowCount = data.length;
    } else if (typeof data === 'object') {
        const arrays = findArraysInObject(data);
        rowCount = arrays.reduce((sum, arr) => sum + arr.length, 0);
    }
    
    // Construir HTML de las estadísticas (status, tamaño, registros, hora)
    statsContent.innerHTML = `
        <div class="bg-gray-800 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-400">${response.status}</div>
            <div class="text-sm text-gray-400">Status Code</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-400">${(dataSize / 1024).toFixed(2)} KB</div>
            <div class="text-sm text-gray-400">Tamaño</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-400">${rowCount}</div>
            <div class="text-sm text-gray-400">Registros</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-yellow-400">${new Date().toLocaleTimeString()}</div>
            <div class="text-sm text-gray-400">Hora</div>
        </div>
    `;
    
    // Mostrar el contenedor de estadísticas en UI
    apiStats.classList.remove('hidden');
}

////////////////////////////////////////////////////////////
// Renderizado general de resultados: raw o en tabla masu //
////////////////////////////////////////////////////////////
function renderTable(data) {
    const apiResults = document.getElementById('apiResults');
    apiResults.innerHTML = ''; // limpiar previo

    // Crear contenedor estilizado para los resultados
    const container = document.createElement("div");
    container.className = "api-data-table bg-gray-800 p-6 rounded-xl shadow-lg";
    
    // Analizar la estructura para decidir si mostrar tabla o raw
    const analysis = analyzeDataStructure(data);
    
    // Si se detectó que es mejor mostrar raw (no hay arrays), entonces renderRawData,
    // en tu código actual renderRawData no está definida — por eso en el original
    // se usan renderRawData y renderDataTable; si no está definida, se mostraría tabla.
    if (analysis.shouldShowRaw) {
        renderRawData(container, data, analysis);
    } else {
        renderDataTable(container, data, analysis);
    }
    
    apiResults.appendChild(container);
    
    // Llevar la vista al contenedor
    container.scrollIntoView({ behavior: 'smooth' });
}

/////////////////////////////////////////////////////
// Funciones de análisis de la estructura de datos //
/////////////////////////////////////////////////////
function analyzeDataStructure(data) {
    const analysis = {
        isArray: Array.isArray(data),
        arrays: [],          // arrays encontrados dentro del objeto o root array
        shouldShowRaw: false,
        dataType: typeof data
    };
    
    // Si la raíz es array, lo añadimos como 'root'
    if (analysis.isArray) {
        analysis.arrays.push({ key: 'root', data: data, count: data.length });
    } else if (typeof data === 'object' && data !== null) {
        // Buscar arrays dentro del objeto (por ejemplo: { results: [...] })
        findArraysInObject(data).forEach((arr, index) => {
            analysis.arrays.push({ 
                key: `array_${index}`, 
                data: arr, 
                count: arr.length 
            });
        });
        
        // Si no hay arrays detectados, es mejor mostrar el JSON en bruto
        if (analysis.arrays.length === 0) {
            analysis.shouldShowRaw = true;
        }
    } else {
        analysis.shouldShowRaw = true; // no es objeto ni array
    }
    
    return analysis;
}

// Busca recursivamente arrays dentro de un objeto y devuelve una lista de arrays encontrados
function findArraysInObject(obj, path = '') {
    let arrays = [];
    
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            arrays.push(value);
        } else if (typeof value === 'object' && value !== null) {
            arrays = arrays.concat(findArraysInObject(value, path ? `${path}.${key}` : key));
        }
    }
    
    return arrays;
}

/////////////////////////////////////////////////////
// Renderizado cuando hay arrays: pestañas y tablas //
/////////////////////////////////////////////////////
function renderDataTable(container, data, analysis) {
    let html = `<h2 class='text-2xl font-bold mb-6 flex items-center'>
        <i class="fas fa-table mr-3 text-green-400"></i>Datos de la API
    </h2>`;
    
    // Si hay más de un conjunto de datos (varios arrays), crear pestañas para cada uno
    if (analysis.arrays.length > 1) {
        html += `<div class="flex space-x-2 mb-4 border-b border-gray-700">`;
        analysis.arrays.forEach((arr, index) => {
            const isActive = index === 0;
            html += `<button onclick="switchTab(${index})" 
                class="tab-button px-4 py-2 ${isActive ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}">
                Conjunto ${index + 1} (${arr.count})
            </button>`;
        });
        html += `</div>`;
    }
    
    // Para cada array construir una tabla (ocultando todas menos la primera)
    analysis.arrays.forEach((arr, index) => {
        const isVisible = index === 0;
        html += `<div id="tab-${index}" class="tab-content ${isVisible ? '' : 'hidden'}">`;
        html += renderSingleTable(arr.data, arr.count);
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

/////////////////////////////////////////////////////
// Construye el HTML de una sola tabla (primer nivel)
/////////////////////////////////////////////////////
function renderSingleTable(arrayData, totalCount) {
    // Si no hay datos, mostrar mensaje
    if (!arrayData || arrayData.length === 0) {
        return `<p class="text-yellow-400 text-center py-4">No hay datos para mostrar</p>`;
    }
    
    // Tomamos las keys del primer objeto como headers (suponiendo estructura homogénea)
    const headers = Object.keys(arrayData[0]);
    // Mostrar sólo hasta maxTableRows para evitar bloquear el navegador
    const displayData = arrayData.slice(0, CONFIG.maxTableRows);
    
    let html = `<div class="mb-4 p-4 bg-gray-700 rounded-lg">
        <div class="flex flex-wrap gap-4 text-sm">
            <span class="text-green-400"><i class="fas fa-database mr-1"></i> ${totalCount} registros</span>
            <span class="text-blue-400"><i class="fas fa-columns mr-1"></i> ${headers.length} columnas</span>
            ${totalCount > CONFIG.maxTableRows ? 
                `<span class="text-yellow-400"><i class="fas fa-info-circle mr-1"></i> Mostrando ${CONFIG.maxTableRows} de ${totalCount}</span>` : ''}
        </div>
    </div>`;
    
    // Construcción de tabla con encabezados
    html += `<div class="overflow-x-auto rounded-lg border border-gray-700">`;
    html += `<table class="min-w-full">`;
    
    html += `<thead class="bg-gray-700"><tr>`;
    headers.forEach(h => {
        html += `<th class="px-4 py-3 text-left font-semibold text-sm border-b border-gray-600">${h}</th>`;
    });
    html += `</tr></thead>`;
    
    html += `<tbody class="divide-y divide-gray-700">`;
    displayData.forEach((item, index) => {
        const rowClass = index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750';
        html += `<tr class="${rowClass} hover:bg-gray-600 transition-colors">`;
        
        // Para cada celda formatear según tipo (imagen, enlace, objeto, boolean, número...)
        headers.forEach(h => {
            const value = item[h];
            html += `<td class="px-4 py-3 align-top border-b border-gray-700">${formatTableCell(value)}</td>`;
        });
        
        html += `</tr>`;
    });
    html += `</tbody></table></div>`;
    
    return html;
}

/////////////////////////////////////////////////////
// Formateo inteligente de celdas para mejor lectura
/////////////////////////////////////////////////////
function formatTableCell(value) {
    if (value === null || value === undefined) {
        return '<span class="text-gray-500 italic text-sm">null</span>';
    }
    
    // Detectar urls de imágenes y devolver <img> optimizado
    if (typeof value === 'string' && isImageUrl(value)) {
        return `<img src="${value}" alt="Imagen" class="max-w-20 h-auto rounded border border-gray-600 hover:scale-105 transition cursor-pointer" 
                onerror="this.style.display='none'" loading="lazy">`;
    }
    
    // Si es un link, devolver <a> con truncamiento
    if (typeof value === 'string' && value.startsWith('http')) {
        return `<a href="${value}" target="_blank" class="text-blue-400 hover:underline flex items-center text-sm">
                <i class="fas fa-external-link-alt mr-1"></i> ${truncateText(value, 30)}
            </a>`;
    }
    
    // Si es un objeto complejo, mostrar botón que despliega JSON
    if (typeof value === 'object') {
        return `<div class="max-w-xs">
                <button onclick="toggleJsonView(this)" 
                    class="text-xs bg-gray-900 hover:bg-gray-700 px-2 py-1 rounded transition flex items-center">
                    <i class="fas fa-brackets-curly mr-1"></i> JSON
                </button>
                <pre class="hidden mt-2 text-xs bg-gray-900 p-2 rounded overflow-x-auto">${JSON.stringify(value, null, 2)}</pre>
            </div>`;
    }
    
    // Booleanos con estilo visual (verde/rojo)
    if (typeof value === 'boolean') {
        return value ? 
            '<span class="text-green-400 font-bold flex items-center"><i class="fas fa-check mr-1"></i> true</span>' : 
            '<span class="text-red-400 font-bold flex items-center"><i class="fas fa-times mr-1"></i> false</span>';
    }
    
    // Números con monoespaciado para destacarlos
    if (typeof value === 'number') {
        return `<span class="text-yellow-400 font-mono">${value}</span>`;
    }
    
    // Por defecto texto truncado para no romper el layout
    return `<span class="text-sm max-w-xs block truncate" title="${value}">${truncateText(value.toString(), 50)}</span>`;
}

/////////////////////////////////////
// Manejo de errores visual en UI  //
/////////////////////////////////////
function handleApiError(error, url, method) {
    let errorMessage = error.message;
    let errorType = 'Error desconocido';
    
    // Clasificar errores comunes para dar pistas útiles al usuario
    if (error.name === 'TimeoutError') {
        errorType = 'Timeout';
        errorMessage = 'La petición tardó demasiado tiempo';
    } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorType = 'Error de CORS/Red';
        errorMessage = 'No se pudo conectar con la API. Verifica la URL y CORS.';
    } else if (error.message.includes('HTTP')) {
        errorType = 'Error HTTP';
    }
    
    // Renderizar una tarjeta de error con detalles y posibles soluciones para CORS/Red
    const apiResults = document.getElementById('apiResults');
    apiResults.innerHTML = `
        <div class="bg-red-900 border border-red-700 p-6 rounded-xl">
            <h2 class="text-2xl font-bold mb-4 flex items-center">
                <i class="fas fa-exclamation-triangle mr-3"></i>Error al consumir la API
            </h2>
            <div class="space-y-3">
                <div><strong>Tipo:</strong> <span class="text-red-300">${errorType}</span></div>
                <div><strong>Mensaje:</strong> <span class="text-red-300">${errorMessage}</span></div>
                <div><strong>URL:</strong> <code class="bg-gray-700 px-2 py-1 rounded">${url}</code></div>
                <div><strong>Método:</strong> <code class="bg-gray-700 px-2 py-1 rounded">${method}</code></div>
            </div>
            ${errorType === 'Error de CORS/Red' ? `
            <div class="mt-4 p-4 bg-yellow-900 rounded-lg">
                <h3 class="font-bold mb-2">💡 Posibles soluciones:</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>Verifica que la URL sea correcta</li>
                    <li>Comprueba la política CORS del servidor</li>
                    <li>Prueba con un proxy CORS</li>
                    <li>Verifica tu conexión a internet</li>
                </ul>
            </div>
            ` : ''}
        </div>
    `;
}

/////////////////////////////////////
// Utilidades de UI y helpers      //
/////////////////////////////////////

// Alterna la vista del JSON embebido (botón + <pre> escondido)
function toggleJsonView(button) {
    const pre = button.nextElementSibling;
    pre.classList.toggle('hidden');
    button.innerHTML = pre.classList.contains('hidden') ? 
        '<i class="fas fa-brackets-curly mr-1"></i> JSON' : 
        '<i class="fas fa-eye-slash mr-1"></i> Ocultar';
}

// Cambia entre pestañas de conjuntos de datos
function switchTab(index) {
    document.querySelectorAll('.tab-content').forEach((tab, i) => {
        tab.classList.toggle('hidden', i !== index);
    });
    document.querySelectorAll('.tab-button').forEach((btn, i) => {
        btn.classList.toggle('border-b-2 border-blue-500 text-blue-400', i === index);
        btn.classList.toggle('text-gray-400', i !== index);
    });
}

// Copiar código generado al portapapeles usando la API de Clipboard
function copyCode() {
    const code = document.getElementById('codeResult').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('✅ Código copiado al portapapeles', 'success');
    });
}

// Limpiar todos los campos y resultados en la UI
function clearAll() {
    document.getElementById('apiUrl').value = '';
    document.getElementById('jsonBody').value = '';
    document.getElementById('headers').value = '';
    document.getElementById('output').classList.add('hidden');
    document.getElementById('apiStats').classList.add('hidden');
    document.getElementById('apiResults').innerHTML = '';
    showNotification('🔄 Campos limpiados', 'info');
}

// Notificación flotante simple (toast)
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';
    
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300`;
    toast.textContent = message;
    toast.style.transform = 'translateX(100%)';
    
    document.body.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    
    // Auto-dismiss después de 3s con animación de salida
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Detectar si una cadena parece ser URL de imagen (por extensión o keywords)
function isImageUrl(url) {
    if (typeof url !== 'string') return false;
    const imagePattern = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    const imageKeywords = ['image', 'img', 'photo', 'picture', 'avatar', 'thumbnail'];
    return imagePattern.test(url) || imageKeywords.some(keyword => url.includes(keyword));
}

// Truncar texto a longitud máxima y añadir '...'
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/////////////////////////////////////////////
// Indicador de carga (overlay) en la UI   //
/////////////////////////////////////////////
function showLoading() {
    let loading = document.getElementById('loading');
    if (!loading) {
        // Crear un overlay si no existe
        loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loading.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="text-white">Consumiendo API...</span>
            </div>
        `;
        document.body.appendChild(loading);
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}
