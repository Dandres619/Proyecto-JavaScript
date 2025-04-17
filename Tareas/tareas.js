let listaTareas = document.querySelector('.tareas-lista');
let tareaInput = document.getElementById('tarea-input');
let descripcionInput = document.getElementById('descripcion-input');
let fechaInput = document.getElementById('fecha-input');
let botonTarea = document.querySelector('.form__container');
let filtros = document.querySelectorAll('.filtro');
let numeroTarea = 1;

let usuario = sessionStorage.getItem('usuario');

let tareasPorUsuario = JSON.parse(localStorage.getItem('tareas')) || {};
if (!tareasPorUsuario[usuario]) {
    tareasPorUsuario[usuario] = [];
}   
let getTareas = tareasPorUsuario[usuario];

getTareas.forEach(tarea => cargarTareas(tarea));

function cargarTareas(tarea) {
    let elementoLista = document.createElement('li');
    elementoLista.classList.add('list-unstyled', 'tarea-item');

    let elementoContenido = document.createElement('div');
    elementoContenido.classList.add('row', 'align-items-center', 'text-center', 'my-2', 'mx-3');

    let parrafoTarea = document.createElement('p');
    parrafoTarea.textContent = '#' + tarea.id;
    parrafoTarea.classList.add('col', 'text-truncate', 'align-items-center');

    let nombre = document.createElement('p');
    nombre.textContent = tarea.nombre;
    nombre.classList.add('col', 'text-truncate');
    nombre.title = tarea.nombre;

    let descripcion = document.createElement('p');
    descripcion.textContent = tarea.descripcion;
    descripcion.classList.add('col', 'text-truncate');
    descripcion.title = tarea.descripcion;

    let fecha = new Date(tarea.fecha).toLocaleString();
    let fechaElemento = document.createElement('p');
    fechaElemento.textContent = fecha;
    fechaElemento.classList.add('col', 'text-truncate');
    fechaElemento.title = tarea.fecha;

    let botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'fw-bold');

    let botonCompletar = document.createElement('button');
    botonCompletar.textContent = tarea.completada ? 'Pendiente' : 'Completar';
    botonCompletar.classList.add('btn', 'btn-warning', 'btn-sm', 'fw-bold');

    if (tarea.completada) {
        elementoLista.classList.add('completada');
    }

    let contenedorBotones = document.createElement('div');
    contenedorBotones.classList.add('col', 'd-flex', 'justify-content-center', 'gap-3');
    contenedorBotones.append(botonEliminar, botonCompletar);

    elementoContenido.append(parrafoTarea, nombre, descripcion, fechaElemento, contenedorBotones);
    elementoLista.appendChild(elementoContenido);
    listaTareas.appendChild(elementoLista);

    botonEliminar.addEventListener('click', () => {
        listaTareas.removeChild(elementoLista);

        const index = getTareas.findIndex(t => t.id === tarea.id);
        if (index !== -1) {
            getTareas.splice(index, 1);
        }

        tareasPorUsuario[usuario] = getTareas;
        localStorage.setItem('tareas', JSON.stringify(tareasPorUsuario));
    });

    botonCompletar.addEventListener('click', () => {
        tarea.completada = !tarea.completada;
        elementoLista.classList.toggle('completada');
        botonCompletar.textContent = tarea.completada ? 'Pendiente' : 'Completar';

        tareasPorUsuario[usuario] = getTareas;
        localStorage.setItem('tareas', JSON.stringify(tareasPorUsuario));
    });

    if (tarea.id + 1 > numeroTarea) {
        numeroTarea = tarea.id + 1;
    }
}

function crearTareas() {
    let nuevaTarea = {
        id: numeroTarea,
        nombre: tareaInput.value.trim(),
        descripcion: descripcionInput.value.trim(),
        fecha: fechaInput.value,
        completada: false
    };

    getTareas.push(nuevaTarea);
    tareasPorUsuario[usuario] = getTareas;

    localStorage.setItem('tareas', JSON.stringify(tareasPorUsuario));

    cargarTareas(nuevaTarea);

    tareaInput.value = '';
    descripcionInput.value = '';
    fechaInput.value = '';
}

botonTarea.addEventListener('submit', (e) => {
    e.preventDefault();

    let tareaExiste = getTareas.some(tarea => tareaInput.value.trim() === tarea.nombre.trim());

    if (tareaExiste) {
        alert("Ya existe una tarea con este nombre.");
    } else {
        crearTareas();
    }
});

filtros.forEach(boton => {
    boton.addEventListener('click', () => {
        const filtro = boton.dataset.filtro;
        const tareas = document.querySelectorAll('.tarea-item');

        tareas.forEach(tarea => {
            switch (filtro) {
                case 'todas':
                    tarea.style.display = 'block';
                    break;
                case 'completadas':
                    tarea.style.display = tarea.classList.contains('completada') ? 'block' : 'none';
                    break;
                case 'pendientes':
                    tarea.style.display = tarea.classList.contains('completada') ? 'none' : 'block';
                    break;
            }
        });
    });
});