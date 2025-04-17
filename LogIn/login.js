//  Obtenemos los elementos del DOM, que son los inputs de correo y contraseña
const correoDOM = document.getElementById('correo-usuario');
const contrasenaDOM = document.getElementById('contrasena-usuario');

// Botón DOM para iniciar sesión o registrarse
const botonRegistro = document.getElementById('login__boton');

// Parrafo donde se mostraran los errores o mensajes de que algo funciono
let informacionErrores = document.getElementById('informacion-datos');
informacionErrores.style.display = 'none';

// Se llaman los usuarios guardados del localStorage o se crean un array vacío
let usuariosDOM = JSON.parse(localStorage.getItem('usuarios')) || [];

// Variables globales para validar si el correo y la contraseña son correctos
let contrasenaCorrecta = false;
let correoCorrecto = false;

// Muestra un mensaje de exito
function mensajeCorrecto() {
    informacionErrores.style.display = 'block';
    informacionErrores.classList.add('text-success');
    informacionErrores.classList.remove('text-danger');
}

// Muestra un mensaje de error
function mensajeError() {
    informacionErrores.style.display = 'block';
    informacionErrores.classList.add('text-danger');
    informacionErrores.classList.remove('text-success');
}

// Se valida que la contraseña cumpla los requisitos
function datosContrasena(contrasena) {
    if (contrasena.length < 6 || !/\d/.test(contrasena) || !/[A-Z]/.test(contrasena)) {
        mensajeError();
        informacionErrores.textContent = 'La contraseña no cumple con los requisitos.';
        contrasenaCorrecta = false;
    } else {
        mensajeCorrecto();
        informacionErrores.textContent = 'La contraseña cumple con los requisitos.';
        contrasenaCorrecta = true;
    }
}

// Se valida que el correo tenga un formato valido
function datosCorreo(correo) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mensajeError();
        informacionErrores.textContent = 'El correo no cumple con los requisitos.';
        correoCorrecto = false;
    } else {
        mensajeCorrecto();
        informacionErrores.textContent = 'El correo cumple con los requisitos.';
        correoCorrecto = true;
    }
}

// Se verifica si el correo ya existe y se cambia el texto del boton
function datosExistentes(correo) {
    let correoExiste = false;

    for (let i = 0; i < usuariosDOM.length; i++) {
        if (usuariosDOM[i].correo === correo) {
            correoExiste = true;
            break;
        }
    }

    if (correoExiste) {
        botonRegistro.textContent = 'Login';
        informacionErrores.textContent = 'Correo existente';
        return true;
    } else {
        botonRegistro.textContent = 'Registrarse';
    }
}

// Funcion para registrar o iniciar sesión 
function registroDOM() {
    // Si el usuario no existe, se intenta registrarlo
    if (!datosExistentes(correoDOM.value)) {
        if (correoCorrecto && contrasenaCorrecta) {
            let usuariosStorage = {
                correo: correoDOM.value,
                contrasena: contrasenaDOM.value
            };
            
            // Se agrega al local y session
            usuariosDOM.push(usuariosStorage);
            localStorage.setItem('usuarios', JSON.stringify(usuariosDOM));
            sessionStorage.setItem('usuario', correoDOM.value);

            // Se redirige a la pagina de la lista de tareas
            window.location.href = 'Tareas/index.html';
        } else {
            mensajeError();
            informacionErrores.textContent = 'Verifique los datos y vuelva a intentar.';
        }
    } else {
        // Si el usuario ya existe, se verifica si la contraseña es la correcta
        let datosCorrectos = false;

        for (let i = 0; i < usuariosDOM.length; i++) {
            if (usuariosDOM[i].correo === correoDOM.value && usuariosDOM[i].contrasena === contrasenaDOM.value) {
                datosCorrectos = true;
                break;
            }
        }

        //Se crea un sessionStorage para luego obtener el correo en el ToDoList
        let usuarioSession = sessionStorage.getItem('usuario');
        if (datosCorrectos) {
            // Si los datos son corretos, envia los datos al session y se redirige al ToDo List
            sessionStorage.setItem('usuario', correoDOM.value);
            window.location.href = 'Tareas/index.html';
        } else {
            mensajeError()
            informacionErrores.textContent = 'La contraseña no es correcta.';
        }
    }
}

// Se verifica el correo y revisa si ya existe
correoDOM.addEventListener('input', () => {
    datosCorreo(correoDOM.value);
    datosExistentes(correoDOM.value);
});

// Se verifica la contraseña y si ya existe un usuario, no muestra el mensaje de verificacion
contrasenaDOM.addEventListener('input', () => {
    if (datosExistentes(correoDOM.value)) {
        informacionErrores.style.display = 'none';
        return;
    }
    datosContrasena(contrasenaDOM.value);
});

// Cuando se da click, se intenta registrar o iniciar sesion
botonRegistro.addEventListener('click', () => {
    registroDOM();
});