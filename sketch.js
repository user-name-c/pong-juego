// Variables del juego
let anchoCanvas = 600;
let altoCanvas = 400;

let pelotaX, pelotaY;
let velocidadPelotaX = 5;
let velocidadPelotaY = 3;
let radioPelota = 10;

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
    background(0); // Fondo negro

    // Dibujar bordes
    stroke(255); // Color del borde
    strokeWeight(10); // Grosor del borde
    line(0, 0, anchoCanvas, 0); // Borde superior
    line(0, altoCanvas, anchoCanvas, altoCanvas); // Borde inferior
    noStroke(); // Desactivar el borde para los objetos que siguen

    // Dibujar marcador
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(puntosJugador, anchoCanvas / 4, 50);
    text(puntosComputadora, 3 * anchoCanvas / 4, 50);

    // Dibujar pelota
    ellipse(pelotaX, pelotaY, radioPelota * 2, radioPelota * 2);
    
    // Dibujar raquetas
    rect(jugadorX, jugadorY, anchoRaqueta, altoRaqueta); // Raqueta del jugador
    rect(computadoraX, computadoraY, anchoRaqueta, altoRaqueta); // Raqueta de la computadora
    
    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Rebote en la parte superior e inferior (considerando el radio de la pelota)
    if (pelotaY - radioPelota < 0 || pelotaY + radioPelota > altoCanvas) {
        velocidadPelotaY *= -1;
    }

    // Rebote en la raqueta del jugador
    if (pelotaX - radioPelota < jugadorX + anchoRaqueta &&
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        
        // Calcular el punto de impacto en la raqueta
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        
        // Ajustar la trayectoria de la pelota según el punto de impacto
        let angulo = puntoImpacto / (altoRaqueta / 2); // Valor entre -1 y 1
        velocidadPelotaX *= -1;
        velocidadPelotaY = angulo * 5; // Modificar la velocidad en Y
    }

    // Rebote en la raqueta de la computadora
    if (pelotaX + radioPelota > computadoraX &&
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {

        // Calcular el punto de impacto en la raqueta
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        
        // Ajustar la trayectoria de la pelota según el punto de impacto
        let angulo = puntoImpacto / (altoRaqueta / 2); // Valor entre -1 y 1
        velocidadPelotaX *= -1;
        velocidadPelotaY = angulo * 5; // Modificar la velocidad en Y
    }

    // Anotaciones y reinicio si la pelota pasa las raquetas
    if (pelotaX < 0) {
        puntosComputadora++; // Punto para la computadora
        resetPelota();
    } else if (pelotaX > anchoCanvas) {
        puntosJugador++; // Punto para el jugador
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

    // Mantener la raqueta de la computadora dentro del canvas (sin atravesar bordes)
    computadoraY = constrain(computadoraY, 0, altoCanvas - altoRaqueta);
}

function resetPelota() {
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
    velocidadPelotaX *= -1; // Cambiar dirección
}