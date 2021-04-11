eventListeners();
// lista proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });

    //botón para crear para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Boton para una nueva tarea
    if (document.querySelector('.nueva-tarea') !== null) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }

    //Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas)
}

function nuevoProyecto(e) {
    e.preventDefault();

    // Crea un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto" placeholder="Nuevo proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el ID con el nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar enter crear el proyecto

    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //enviar datos por formData
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //Abrir la conexión
    xhr.open('POST', 'include/modelos/modelo-proyecto.php', true);

    //En la carga
    xhr.onload = function() {
        if (this.status === 200) {
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //Comprobar la inserción
            if (resultado === 'correcto') {
                // fue exitoso
                if (tipo === 'crear') {
                    //Se creo un nuevo proyecto
                    //inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a href="index.php?id_proyecto${id_proyecto} id="proyecto:${id_proyecto}">
                        ${proyecto}
                    </a>
                    `;
                    //agregar al html
                    listaProyectos.appendChild(nuevoProyecto);

                    // enviar alerta
                    Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `El proyecto ${proyecto} se creó correctamente`,
                            showConfirmButton: false,
                            timer: 2500
                        })
                        .then(resultado => {
                            //Redireccionar a la nueva URL
                            window.location.href = `index.php?id_proyecto=${id_proyecto}`;
                        });

                } else {
                    //Se actualizo o se elimino

                }
            } else {
                //hubo un error
                swal({
                    title: 'Error',
                    text: '¡Hubo un error!',
                    type: 'error'
                })
            }
        }
    }

    //Enviar el request
    xhr.send(datos);
}

// agregar una nueva tarea al proyecto actual

function agregarTarea(e) {
    e.preventDefault();

    var nombreTarea = document.querySelector('.nombre-tarea').value;

    //Validar que el campo tenga algo escrito

    if (nombreTarea === '') {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡La tarea no puede ir vacia!',
            showConfirmButton: false,
            timer: 2000
        })
    } else {
        // la tarea tiene algo, insertar en PHP

        //Crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // crear formData
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //Abrir la conexión
        xhr.open('POST', 'include/modelos/modelo-tareas.php', true);

        //ejecutarlo y respuesta
        xhr.onload = function() {
            if (this.status === 200) {
                // todo correcto
                var respuesta = JSON.parse(xhr.responseText);

                //asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (respuesta.respuesta === 'correcto') {
                    //Se agrego correctamente
                    if (tipo === 'crear') {
                        //lanzar alerta
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `La tarea ${tarea} se creó correctamente`,
                            showConfirmButton: false,
                            timer: 2500
                        })

                        // Seleccionar el parrafo con la lista vacia

                        var parrafoListaVacia = document.querySelector('.lista-vacia');
                        if (parrafoListaVacia) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // construir template
                        var nuevaTarea = document.createElement('li');

                        //agregar el ID
                        nuevaTarea.id = `tarea:${id_insertado}`;

                        //agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        //construir en el html

                        nuevaTarea.innerHTML = `
                                    <p>${tarea}</p>
                                    <div class="acciones">
                                        <i class="far fa-check-circle"></i>
                                        <i class="fas fa-trash"></i>
                                    </div>
                                    `;

                        // agregarlo al HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //Limpiar el formulario{
                        document.querySelector('.agregar-tarea').reset();

                        //Actualizar el progreso
                        actualizarProgreso();
                    }
                }
            } else {
                // Hubo un error
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }

        //Enviar la consulta
        xhr.send(datos);
    }
}

//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: '¿Estás seguro(a)?',
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
                eliminarTareaBD(tareaEliminar);
                // Borrar del HTML
                tareaEliminar.remove();
                Swal.fire(
                    'Eliminado!',
                    'La tarea fue eliminada.',
                    'success'
                )
            }
        })
    }

}

// Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');

    // crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    // abrir la conexión
    xhr.open('POST', 'include/modelos/modelo-tareas.php', true);

    // on load
    xhr.onload = function() {
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));
            //Actualizar el progreso
            actualizarProgreso();
        }
    }
    xhr.send(datos);
}

// Elimina las tareas de la base de datos
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');

    // crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    // abrir la conexión
    xhr.open('POST', 'include/modelos/modelo-tareas.php', true);

    // on load
    xhr.onload = function() {
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));

            //Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }
            //Actualizar el progreso
            actualizarProgreso();
        }
    }
    xhr.send(datos);
}

//Actualiza el avance del proyecto
function actualizarProgreso() {
    //Obtener todas las tareas{
    const tareas = document.querySelectorAll('li.tarea');
    //Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //Determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    //asignar el avance de la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    //Mostrar una alerta al completar el 100%
    if (avance === 100) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Ya no tienes tareas pendientes!',
            showConfirmButton: false,
            timer: 2500
        })
    }
}