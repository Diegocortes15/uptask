<?php

    $conn = new mysqli('localhost', 'root', '123456', 'uptask');
    //localhost,usuario,contraseña,baseDdato

    if($conn->connect_error){
        echo $error -> $connection->connect_error;
    }
    
    $conn->set_charset('utf8');

?>