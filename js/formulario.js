eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        //La validación falló
        swal("Error!", "Ambos campos son obligatorios!", "error");
    } else {
        //Ambos campos son correctos mandar a ejecuar ajax
        //swal("Error!", "Ambos campos son obligatorios!", "success");

        //datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //crear llamado a Ajax
        var xhr = new XMLHttpRequest();

        //abrir la conexión
        xhr.open('POST', 'include/modelos/modelo-admin.php', true);


        //Retorno de datos
        xhr.onload = function() {
                if (this.status === 200) {
                    var respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);

                    //Si la respuesta es correcta
                    if (respuesta.respuesta === 'correcto') {

                        //Si es un nuevo usuario
                        if (respuesta.tipo === 'crear') {
                            swal("Usuario Creado", "El usuario se creó correctamente", "success");
                        } else if (respuesta.tipo === 'login') {
                            swal({
                                    title: 'Login Correcto',
                                    text: 'Presiona OK para continuar',
                                    type: 'success',
                                    allowOutsideClick: false //<-- Bloquea la interacción fuera de la alerta
                                })
                                .then(resultado => {
                                    window.location.href = 'index.php';
                                });
                        }
                    } else {
                        //Hubo un error
                        swal("Error!", "Hubo un error!", "error");
                    }
                }
            }
            // Enviar la petición
        xhr.send(datos);
    }
}