// Variables del juego
let anchoCanvas = 600;
let altoCanvas = 400;

// Variables para las imágenes
let imagenFondo, 
    imagenRaquetaJugador, 
    imagenRaquetaComputadora, 
    imagenPelota;

let pelotaX, pelotaY;
let velocidadPelotaX = 5;
let velocidadPelotaY = 3;
let radioPelota = 10;
let anguloPelota = 0;

let jugadorX = 10;
let jugadorY;
let anchoRaqueta = 10;
let altoRaqueta = 100;

let computadoraX;
let computadoraY;
let velocidadComputadora = 4;

// Marcador
let puntosJugador = 0;
let puntosComputadora = 0;

// Variable para el sonido
let sonidoRebote;
let sonidoAnotacion;

// Función para narrar el marcador
function narrarMarcador() {
    let narrador = window.speechSynthesis;
    let texto = `El marcador es ${puntosJugador} a ${puntosComputadora}`;
    let mensaje = new SpeechSynthesisUtterance(texto);
    narrador.speak(mensaje);
}

function preload() {
    // Cargar las imágenes antes de que comience el juego
    imagenFondo = loadImage('Sprites/fondo1.png');
    imagenRaquetaJugador = loadImage('Sprites/barra1.png');
    imagenRaquetaComputadora = loadImage('Sprites/barra2.png');
    imagenPelota = loadImage('Sprites/bola.png');

    // Cargar el sonido de rebote
    sonidoRebote = loadSound('sounds/bounce.wav');
    sonidoAnotacion = loadSound('sounds/game_over_mono.wav');
}

function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    // Inicializar posiciones
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
    
    jugadorY = altoCanvas / 2 - altoRaqueta / 2;
    computadoraX = anchoCanvas - anchoRaqueta - 10;
    computadoraY = altoCanvas / 2 - altoRaqueta / 2;
}

function draw() {
    // Dibujar la imagen de fondo
    image(imagenFondo, 0, 0, anchoCanvas, altoCanvas);

    // Dibujar bordes
    stroke(color('red')); // Color del borde
    strokeWeight(10); // Grosor del borde
    line(0, 0, anchoCanvas, 0); // Borde superior
    line(0, altoCanvas, anchoCanvas, altoCanvas); // Borde inferior
    noStroke();

    // Dibujar marcador
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(puntosJugador, anchoCanvas / 4, 50);
    text(puntosComputadora, 3 * anchoCanvas / 4, 50);

    // Calcular el ángulo de rotación basado en la velocidad de la pelota
    anguloPelota += (abs(velocidadPelotaX) + abs(velocidadPelotaY)) * 0.05; // Ajustar la velocidad del giro si es necesario
  
    // Dibujar pelota con imagen
    push(); // Guardar la transformación actual
    translate(pelotaX, pelotaY); // Mover el origen de coordenadas al centro de la pelota
    rotate(anguloPelota); // Rotar la pelota
    image(imagenPelota, - radioPelota, - radioPelota, radioPelota * 2, radioPelota * 2);
    pop(); // Restaurar la transformación
    
    // Dibujar raquetas con imágenes
    image(imagenRaquetaJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta); // Raqueta del jugador
    image(imagenRaquetaComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta); // Raqueta de la computadora

    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Rebote en la parte superior e inferior (considerando el radio de la pelota)
    if (pelotaY - radioPelota < 0 || pelotaY + radioPelota > altoCanvas) {
        velocidadPelotaY *= -1;
        sonidoRebote.play(); // Reproduce sonido rebote
    }

    // Rebote en la raqueta del jugador
    if (pelotaX - radioPelota < jugadorX + anchoRaqueta &&
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        
        // Ajustar la trayectoria de la pelota según el punto de impacto
        let angulo = puntoImpacto / (altoRaqueta / 2); // Valor entre -1 y 1
        velocidadPelotaX *= -1;
        velocidadPelotaY = angulo * 5;

        sonidoRebote.play(); // Reproduce sonido rebote
    }

    // Rebote en la raqueta de la computadora
    if (pelotaX + radioPelota > computadoraX &&
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {

        // Calcular el punto de impacto en la raqueta
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        
        // Ajustar la trayectoria de la pelota según el punto de impacto
        let angulo = puntoImpacto / (altoRaqueta / 2); // Valor entre -1 y 1
        velocidadPelotaX *= -1;
        velocidadPelotaY = angulo * 5;

        sonidoRebote.play(); // Reproduce sonido rebote
    }

    // Anotaciones y reinicio
    if (pelotaX < 0) {
        puntosComputadora++;
        sonidoAnotacion.play(); // Reproducir el sonido de anotación
        narrarMarcador(); // Llamar a la narración del marcador
        resetPelota();
    } else if (pelotaX > anchoCanvas) {
        puntosJugador++;
        sonidoAnotacion.play(); // Reproducir el sonido de anotación
        narrarMarcador(); // Llamar a la narración del marcador
        resetPelota();
    }

    // Movimiento del jugador
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        jugadorY -= 7;
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        jugadorY += 7;
    }

    // Mantener la raqueta del jugador dentro del canvas (sin atravesar bordes)
    jugadorY = constrain(jugadorY, 0, altoCanvas - altoRaqueta);

    // Movimiento de la computadora
    if (computadoraY + altoRaqueta / 2 < pelotaY) {
        computadoraY += velocidadComputadora;
    } else if (computadoraY + altoRaqueta / 2 > pelotaY) {
        computadoraY -= velocidadComputadora;
    }

    // Mantener la raqueta de la computadora dentro del canvas
    computadoraY = constrain(computadoraY, 0, altoCanvas - altoRaqueta);
}

function resetPelota() {
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
    velocidadPelotaX *= -1; // Cambiar dirección
}