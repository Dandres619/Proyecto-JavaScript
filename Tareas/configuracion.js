// Se obtienen los elementos del DOM para modificarlos
const colorDOM = document.getElementById('color-input');
const tamanioLetraDOM = document.getElementById('tamano-input');
const fuenteDOM = document.getElementById('fuente-input');
const colorLetraDOM = document.getElementById('letra-input');

let configuracionStorage = JSON.parse(localStorage.getItem('configuraciones')) || [];

// Boton del DOM para aplicar los cambios
const aplicarDOM = document.getElementById('aplicar-cambios');

// Navbar del DOM para el nombre de usuario
const navbar = document.getElementById('usuario-navbar');

// Sacamos los datos del session y ponemos el correo en el navbar
let usuarioNav = sessionStorage.getItem('usuario');
navbar.textContent = usuarioNav;

const cargarConfiguracion = document.addEventListener('DOMContentLoaded', () => {
	// Se crea un indice para verificar las configuraciones del usuario
	let indiceUsuario = Infinity;
	// Si ya el usuario tiene configuraciones previas, pasara a true
	let existeConfiguraciones = false;
	for (let i = 0; i < configuracionStorage.length; i++) {
		if (configuracionStorage[i].usuario === usuarioNav) {
			indiceUsuario = i;
			existeConfiguraciones = true;
			break;
		}
	}

	if (existeConfiguraciones) {
		// Se cambian las configuraciones de la página al cargarse
		colorPagina(configuracionStorage[indiceUsuario].colorP);
		tamanioLetra(configuracionStorage[indiceUsuario].tamanioL);
		fuenteLetra(configuracionStorage[indiceUsuario].fuenteL);
		colorLetra(configuracionStorage[indiceUsuario].colorL);
	}
});

// Funciones para cada uno de los elementos
function colorPagina(color) {
	document.body.style.backgroundColor = color;
}

function tamanioLetra(tamanio) {
	document.body.style.fontSize = tamanio
}

function fuenteLetra(fuente) {
	document.body.style.fontFamily = fuente
}

function colorLetra(color) {
	// Se quitan las clases de colores de bootstrap a todos los elementos para poder cambiar el color
	document.querySelectorAll('body, label, p, h1, h2, h3, h4, h5, h6, span, div').forEach(elemento => {
		elemento.style.setProperty('color', color, 'important');
	});
}

function guardarStorage() {
	// Informacion que se guardara en el localStorage
	let configuracionGuardada = {
		usuario: usuarioNav,
		colorP: colorDOM.value,
		tamanioL: tamanioLetraDOM.value,
		fuenteL: fuenteDOM.value,
		colorL: colorLetraDOM.value
	}

	let configuracionExistente = configuracionStorage.find(usuario => usuario.usuario === usuarioNav);
	// Si ya existe una configuracion previa, la actualizara
	if (configuracionExistente) {
		configuracionExistente.colorP = colorDOM.value
		configuracionExistente.tamanioL = tamanioLetraDOM.value
		configuracionExistente.fuenteL = fuenteDOM.value
		configuracionExistente.colorL = colorLetraDOM.value
		localStorage.setItem('configuraciones', JSON.stringify(configuracionStorage));
	} else {
		// Si no existe una configuracion previa, la creara
		configuracionStorage.push(configuracionGuardada);
		localStorage.setItem('configuraciones', JSON.stringify(configuracionStorage));
	}
}

// Evento para activar los cambios cuando se de click al boton
aplicarDOM.addEventListener('click', () => {
	colorPagina(colorDOM.value);
	tamanioLetra(tamanioLetraDOM.value);
	fuenteLetra(fuenteDOM.value);
	colorLetra(colorLetraDOM.value);
	guardarStorage();
});