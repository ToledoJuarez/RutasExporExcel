document.addEventListener('DOMContentLoaded', () => {
    const agregarPosteBtn = document.getElementById('agregar-poste');
    const postesInputsDiv = document.getElementById('postes-inputs');
    const enviarDesperfectoBtn = document.getElementById('enviar-desperfecto');
    const tablaDetalleBody = document.querySelector('#tabla-detalle-desperfectos tbody');
    const tablaListaBody = document.querySelector('#tabla-lista-desperfectos tbody');
    const exportarExcelBtn = document.getElementById('exportar-excel');
    const eliminarRegistrosBtn = document.getElementById('eliminar-registros');
    const actualizarDesperfectoBtn = document.getElementById('actualizar-desperfecto');
    const desperfectoInput = document.getElementById('desperfecto');
    const detalleInput = document.getElementById('detalle');

    let contadorPostes = 0;
    let desperfectos = {}; // Objeto para almacenar los desperfectos por nombre
    let subRutaCounter = 65; // Inicia con la letra 'A' (código ASCII 65)
    let desperfectoSeleccionado = null; // Para rastrear el desperfecto a actualizar

    agregarPosteBtn.addEventListener('click', () => {
        contadorPostes++;
        const nuevoInputGrupo = document.createElement('div');
        nuevoInputGrupo.classList.add('poste-input-group');
        nuevoInputGrupo.innerHTML = `
            <input type="text" class="poste" placeholder="Poste ${contadorPostes}">
            <button type="button" class="eliminar-poste eliminar">Eliminar</button>
        `;
        postesInputsDiv.appendChild(nuevoInputGrupo);

        const botonEliminar = nuevoInputGrupo.querySelector('.eliminar-poste');
        botonEliminar.addEventListener('click', (event) => {
            event.target.parentNode.remove();
        });
    });

    enviarDesperfectoBtn.addEventListener('click', () => {
        const desperfectoNombre = desperfectoInput.value.trim();
        const detalle = detalleInput.value.trim();
        const postesInputs = postesInputsDiv.querySelectorAll('.poste');
        const postes = Array.from(postesInputs).map(input => input.value.trim()).filter(value => value !== '');

        if (desperfectoNombre && detalle) {
            if (!desperfectos[desperfectoNombre]) {
                desperfectos[desperfectoNombre] = {
                    detalle: detalle,
                    postes: []
                };
            }
            if (desperfectoSeleccionado === desperfectoNombre) {
                // Si estamos actualizando, simplemente agregamos los nuevos postes
                desperfectos[desperfectoNombre].postes = [...new Set([...desperfectos[desperfectoNombre].postes, ...postes])];
                desperfectoSeleccionado = null; // Resetear la selección
                enviarDesperfectoBtn.textContent = 'Guardar Desperfecto'; // Restaurar texto del botón
            } else {
                // Si es un nuevo desperfecto, agregamos los postes
                desperfectos[desperfectoNombre].postes = [...new Set([...desperfectos[desperfectoNombre].postes, ...postes])];
            }

            actualizarListaDesperfectos();
            actualizarTablaDetalle();
            limpiarFormulario();
        } else {
            alert('Por favor, ingrese el desperfecto y el detalle.');
        }
    });

    function asignarSubRutas() {
        const subRutas = {};
        const sortedDesperfectos = Object.keys(desperfectos).sort();
        let contadorSubRuta = 65;
        sortedDesperfectos.forEach(desperfecto => {
            subRutas[desperfecto] = String.fromCharCode(contadorSubRuta++);
        });
        return subRutas;
    }

    function actualizarListaDesperfectos() {
        tablaListaBody.innerHTML = '';
        const subRutas = asignarSubRutas();
        for (const desperfectoNombre in desperfectos) {
            const nuevaFila = tablaListaBody.insertRow();
            const celdaSubRuta = nuevaFila.insertCell();
            const celdaDesperfecto = nuevaFila.insertCell();
            const celdaAccion = nuevaFila.insertCell();

            celdaSubRuta.textContent = subRutas[desperfectoNombre];
            celdaDesperfecto.textContent = desperfectoNombre;

            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.addEventListener('click', () => cargarDesperfectoParaEditar(desperfectoNombre));
            celdaAccion.appendChild(botonEditar);
        }
    }

    function actualizarTablaDetalle() {
        tablaDetalleBody.innerHTML = '';
        const subRutas = asignarSubRutas();
        for (const desperfectoNombre in desperfectos) {
            const detalle = desperfectos[desperfectoNombre].detalle;
            const postes = desperfectos[desperfectoNombre].postes;
            const subRuta = subRutas[desperfectoNombre];

            if (postes.length > 0) {
                postes.forEach(poste => {
                    const nuevaFila = tablaDetalleBody.insertRow();
                    const celdaSubRuta = nuevaFila.insertCell();
                    const celdaDesperfecto = nuevaFila.insertCell();
                    const celdaDetalle = nuevaFila.insertCell();
                    const celdaPoste = nuevaFila.insertCell();

                    celdaSubRuta.textContent = subRuta;
                    celdaDesperfecto.textContent = desperfectoNombre;
                    celdaDetalle.textContent = detalle;
                    celdaPoste.textContent = poste;
                });
            } else {
                const nuevaFila = tablaDetalleBody.insertRow();
                const celdaSubRuta = nuevaFila.insertCell();
                const celdaDesperfecto = nuevaFila.insertCell();
                const celdaDetalle = nuevaFila.insertCell();
                const celdaPoste = nuevaFila.insertCell();

                celdaSubRuta.textContent = subRuta;
                celdaDesperfecto.textContent = desperfectoNombre;
                celdaDetalle.textContent = detalle;
                celdaPoste.textContent = 'N/A';
            }
        }
    }

    function cargarDesperfectoParaEditar(desperfectoNombre) {
        const desperfectoInfo = desperfectos[desperfectoNombre];
        desperfectoInput.value = desperfectoNombre;
        detalleInput.value = desperfectoInfo.detalle;
        postesInputsDiv.innerHTML = '';
        contadorPostes = 0;
        desperfectoInfo.postes.forEach(poste => {
            contadorPostes++;
            const nuevoInputGrupo = document.createElement('div');
            nuevoInputGrupo.classList.add('poste-input-group');
            nuevoInputGrupo.innerHTML = `
                <input type="text" class="poste" value="${poste}" placeholder="Poste ${contadorPostes}">
                <button type="button" class="eliminar-poste eliminar">Eliminar</button>
            `;
            postesInputsDiv.appendChild(nuevoInputGrupo);

            const botonEliminar = nuevoInputGrupo.querySelector('.eliminar-poste');
            botonEliminar.addEventListener('click', (event) => {
                event.target.parentNode.remove();
            });
        });
        desperfectoSeleccionado = desperfectoNombre;
        enviarDesperfectoBtn.textContent = 'Actualizar Desperfecto';
    }

    function limpiarFormulario() {
        desperfectoInput.value = '';
        detalleInput.value = '';
        postesInputsDiv.innerHTML = '';
        contadorPostes = 0;
    }

    exportarExcelBtn.addEventListener('click', () => {
        if (Object.keys(desperfectos).length === 0) {
            alert('No hay registros para exportar.');
            return;
        }

        const libroExcel = XLSX.utils.book_new();

        // Hoja de lista de desperfectos
        const listaDesperfectosArray = Object.keys(desperfectos)
            .sort()
            .map((desperfecto, index) => ({
                SubRuta: String.fromCharCode(65 + index),
                Desperfecto: desperfecto
            }));
        const hojaLista = XLSX.utils.json_to_sheet(listaDesperfectosArray);
        XLSX.utils.book_append_sheet(libroExcel, hojaLista, 'Lista Desperfectos');

        // Hoja de detalle de desperfectos
        const detalleDesperfectosArray = [];
        const subRutasExport = asignarSubRutas();
        for (const desperfectoNombre in desperfectos) {
            const detalle = desperfectos[desperfectoNombre].detalle;
            const postes = desperfectos[desperfectoNombre].postes;
            const subRuta = subRutasExport[desperfectoNombre];
            if (postes.length > 0) {
                postes.forEach(poste => {
                    detalleDesperfectosArray.push({
                        SubRuta: subRuta,
                        Desperfecto: desperfectoNombre,
                        Detalle: detalle,
                        Poste: poste
                    });
                });
            } else {
                detalleDesperfectosArray.push({
                    SubRuta: subRuta,
                    Desperfecto: desperfectoNombre,
                    Detalle: detalle,
                    Poste: 'N/A'
                });
            }
        }
        const hojaDetalle = XLSX.utils.json_to_sheet(detalleDesperfectosArray);
        XLSX.utils.book_append_sheet(libroExcel, hojaDetalle, 'Detalle Desperfectos');

        XLSX.writeFile(libroExcel, 'desperfectos.xlsx');
    });

    eliminarRegistrosBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar todos los registros?')) {
            desperfectos = {};
            actualizarListaDesperfectos();
            actualizarTablaDetalle();
        }
    });

    actualizarListaDesperfectos(); // Inicializar la lista de desperfectos al cargar la página
    actualizarTablaDetalle();   // Inicializar la tabla de detalles al cargar la página
});
