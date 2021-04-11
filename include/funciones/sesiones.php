<?php

function usuario_autenticado(){
    /*Verificar si el usuario esta autenticado, si no,
    redireccionar al login para inicio de sesión*/
    if(!revisar_usuario()){
        header('Location:login.php');
        exit();
    }
}
function revisar_usuario(){
    /*Revisar si la sesion es iniciada*/
    return isset($_SESSION['nombre']);
}

session_start();
usuario_autenticado();

?>