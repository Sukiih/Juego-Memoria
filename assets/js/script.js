let listaDeEmojis = [
    '🐱', '🐶', '🐭', '🐰', '🐻', '🐼', '🐨', '🦁', 
    '🦄', '🦋', '🐵', '🦊', '🍎', '🍌', '🍉', '🍇'
];

let contenedorDelTablero = document.getElementById('game-board');
let cartasSeleccionadas = [];
let paresEncontrados = 0;
let cartaEnfocada = null;
const columnas = 8;

// Función para crear el tablero de cartas
function crearTableroDeJuego() {
    let emojisMezclados = mezclar(listaDeEmojis.concat(listaDeEmojis));
    emojisMezclados.forEach(function (emoji, indice) {
        let carta = document.createElement('div');
        carta.classList.add('card');
        carta.setAttribute('data-indice', indice);
        carta.setAttribute('data-emoji', emoji);
        carta.setAttribute('tabindex', '0'); 
        carta.setAttribute('aria-pressed', 'false'); 
        carta.addEventListener('click', voltearCarta);
        carta.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                voltearCarta.call(this);
            }
        });
        carta.addEventListener('focus', function() {
            cartaEnfocada = this;
        });
        contenedorDelTablero.appendChild(carta);
    });

    document.addEventListener('keydown', manejarTeclado);
}

// Función para mezclar cartas
function mezclar(arreglo) {
    let indiceActual = arreglo.length, valorTemporal, indiceAleatorio;

    while (indiceActual !== 0) {
        indiceAleatorio = Math.floor(Math.random() * indiceActual);
        indiceActual -= 1;
        valorTemporal = arreglo[indiceActual];
        arreglo[indiceActual] = arreglo[indiceAleatorio];
        arreglo[indiceAleatorio] = valorTemporal;
    }

    return arreglo;
}

// Función para voltear la carta
function voltearCarta() {
    if (cartasSeleccionadas.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.getAttribute('data-emoji');
        this.setAttribute('aria-pressed', 'true');
        cartasSeleccionadas.push(this);

        if (cartasSeleccionadas.length === 2) {
            setTimeout(verificarCoincidencia, 1000);
        }
    }
}

// Función para verificar si las cartas coinciden
function verificarCoincidencia() {
    let primerEmojiDeCarta = cartasSeleccionadas[0].getAttribute('data-emoji');
    let segundoEmojiDeCarta = cartasSeleccionadas[1].getAttribute('data-emoji');

    if (primerEmojiDeCarta === segundoEmojiDeCarta) {
        cartasSeleccionadas.forEach(function (carta) {
            carta.classList.add('matched');
            carta.setAttribute('aria-pressed', 'false');
        });
        paresEncontrados++;

        if (paresEncontrados === listaDeEmojis.length) {
            document.getElementById('feedback').textContent = '¡Felicidades! Has encontrado todas las parejas.';
        }
    } else {
        cartasSeleccionadas.forEach(function (carta) {
            carta.classList.remove('flipped');
            carta.textContent = '';
            carta.setAttribute('aria-pressed', 'false');
        });
    }

    cartasSeleccionadas = [];
}

// Función para manejar la navegación con las teclas de flecha
function manejarTeclado(evento) {
    if (cartaEnfocada) {
        let indiceActual = Array.from(contenedorDelTablero.children).indexOf(cartaEnfocada);
        let cartas = Array.from(contenedorDelTablero.children);

        switch (evento.key) {
            case 'ArrowRight':
                // derecha
                if (indiceActual % columnas < columnas - 0) {
                    cartas[indiceActual + 1].focus();
                } else {
                    // Si estás en la última columna, moverte a la primera columna de la siguiente fila
                    if (indiceActual + columnas < cartas.length) {
                        cartas[indiceActual + columnas].focus();
                    }
                }
                break;
            case 'ArrowLeft':
                // izquierda
                if (indiceActual % columnas > 0) {
                    cartas[indiceActual - 1].focus();
                } else {
                    // Si estás en la primera columna, moverte a la última columna de la fila anterior
                    if (indiceActual - columnas >= 0) {
                        cartas[indiceActual - columnas + (columnas - 1)].focus();
                    }
                }
                break;
            case 'ArrowDown':
                // abajo
                if (indiceActual + columnas < cartas.length) {
                    // Si no estás en la última fila, moverse hacia abajo
                    cartas[indiceActual + columnas].focus();
                }
                break;
            case 'ArrowUp':
                // arriba
                if (indiceActual - columnas >= 0) {
                    // Si no estás en la primera fila, moverse hacia arriba
                    cartas[indiceActual - columnas].focus();
                }
                break;
            default:
                break;
        }
    }
}

crearTableroDeJuego();
