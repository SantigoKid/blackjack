// SDefino un objeto llamado blackjackGame que representa el estado del juego. Procedo a poner las correspondientes propiedades

let blackjackGame = {

  // you y dealer son objetos que representan las manos del jugador y el crupier (es quien reparte las cartas en el blackjack) respectivamente.

  you: {
    scoreSpan: "#your-blackjack-result",
    div: "#your-box",
    boxSize: ".flex-blackjack-row-2 div",
    score: 0,
  },


  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    boxSize: ".flex-blackjack-row-2 div",
    score: 0,
  },

  // cards es una matriz que contiene todas las cartas en el juego.

  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],

  // cardsMap es un objeto que asigna valores numéricos a cada carta.
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },

  // wins, losses y draws son contadores para el número de veces que el jugador gana, pierde o empata.

  wins: 0,
  losses: 0,
  draws: 0,
// isStand indica si el jugador ha plantado o no.
  isStand: false,
  // isTurnsOver indica si el juego ha terminado o no.
  isTurnsOver: false,
  // pressOnce indica si los botones de pedir, plantar y repartir han sido presionados al menos una vez.
  pressOnce: false,
};

// defino las constantes YOU y DEALER que son referencias al objeto de manos del jugador y el crupier. 

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

// procedo a crear 3 objetos de audio para los sonidos del juego
const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const loseSound = new Audio("sounds/aww.mp3");

// Se definen variables windowWidth y windowHeight que se utilizan para adaptar la interfaz a diferentes tamaños de pantalla.
let windowWidth = window.screen.width;
let windowHeight = window.screen.height;
let winner;

// Se agregan escuchadores de eventos para los botones del juego, que activan funciones cuando se hace clic en ellos.

// blackjackHit: si el jugador no se ha plantado, se agrega una nueva carta a su mano y se muestra en la pantalla.
document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);
  // blackjackStand: el jugador se planta y es el turno del crupier. El crupier continúa sacando cartas hasta que su puntaje sea mayor o igual a 17.
document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", blackjackStand);
  // blackjackDeal: se reinicia el juego y se reparten nuevas cartas.
document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);
  // blackjackRestart: se reinician los contadores y el juego comienza de nuevo.
document
  .querySelector("#blackjack-reset-button")
  .addEventListener("click", blackjackRestart);

  // La función blackjackHit agrega una nueva carta a la mano del jugador y actualiza su puntaje.
function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

// La función randomCard elige una carta aleatoria de la baraja.
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

// La función showCard agrega una imagen de la carta a la pantalla.
function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;
    cardImage.style = `width:${widthSize()}; height:${heightSize()};`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}
// La función widthSize() utiliza la variable windowWidth para verificar si la pantalla tiene una anchura mayor a 1000 píxeles. Si es así, el tamaño de la carta se establece en el 10% del ancho de la pantalla (window.screen.width * 0.1). Si la pantalla tiene una anchura menor a 1000 píxeles, el tamaño de la carta se establece en el 18% del ancho de la pantalla (window.screen.width * 0.18).
function widthSize() {
  if (windowWidth > 1000) {
    let newWidthSize = window.screen.width * 0.1;
    return newWidthSize;
  } else {
    return window.screen.width * 0.18;
  }
}
// La función heightSize() funciona de manera similar a la función widthSize(), pero utiliza la variable windowHeight para determinar si la pantalla tiene una altura mayor a 700 píxeles. Si es así, el tamaño de la carta se establece en el 18% de la altura de la pantalla (window.screen.height * 0.18). Si la pantalla tiene una altura menor a 700 píxeles, el tamaño de la carta se establece en el 15% de la altura de la pantalla (window.screen.height * 0.15).
function heightSize() {
  if (windowHeight > 700) {
    let newHeightSize = window.screen.height * 0.18;
    return newHeightSize;
  } else {
    return window.screen.height * 0.15;
  }
}

// La función updateScore actualiza el puntaje del jugador o del crupier en la pantalla.
function updateScore(card, activePlayer) {
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }

  console.log(activePlayer["score"]);
}
// La función showScore se encarga de mostrar la puntuación de un jugador en el marcador del juego. Toma como parámetro el objeto activePlayer, que representa al jugador activo actualmente en el juego.
function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

// La función blackjackStand termina el turno del jugador y permite que el crupier saque cartas hasta que su puntaje sea mayor o igual a 17.
function blackjackStand() {
  if (blackjackGame.pressOnce === false) {
    blackjackGame["isStand"] = true;
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");

    for (let i = 0; i < yourImages.length; i++) {
      let card = randomCard();
      showCard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);
    }

    blackjackGame["isTurnsOver"] = true;

    computeWinner();
    showWinner(winner);
  }

  blackjackGame.pressOnce = true;
}
// La función computeWinner determina quién gana el juego y actualiza los contadores.

function computeWinner() {
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      winner = "Draw";
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    winner = "None";
  }

  return winner;
}

// Esta función showWinner() se encarga de mostrar el resultado del juego y actualizar las estadísticas de victorias, derrotas y empates en la página HTML. Recibe como parámetro el ganador de la partida o el valor "None" si ambos jugadores se pasaron de 21.

function showWinner(winner) {
  let message, messageColor;

  if (winner === YOU) {
    message = "You Won";
    messageColor = "#00e676";
    document.querySelector("#wins").textContent = blackjackGame["wins"] += 1;
    winSound.play();
  } else if (winner === DEALER) {
    message = "You Lost";
    messageColor = "red";
    document.querySelector("#losses").textContent = blackjackGame[
      "losses"
    ] += 1;
    loseSound.play();
  } else if (winner === "Draw") {
    message = "You Drew";
    messageColor = "yellow";
    document.querySelector("#draws").textContent = blackjackGame["draws"] += 1;
    loseSound.play();
  } else if (winner === "None") {
    message = "You Both Busted!";
    messageColor = "orange";
    loseSound.play();
  }

  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messageColor;
}

// La función blackjackDeal reinicia el estado del juego y muestra una nueva mano.
function blackjackDeal() {
  if (blackjackGame["isTurnsOver"] === true) {
    // selecciona todas las imagenes del jugador como del dealer
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    document.querySelector("#blackjack-result").style.color = "white";

    //pone el puntaje del dealer y el jugador a 0
    YOU["score"] = DEALER["score"] = 0;
    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;

    //resetea el color a blanco
    document.querySelector("#your-blackjack-result").style.color = "white";
    document.querySelector("#dealer-blackjack-result").style.color = "white";

    //Reset to Let's Play
    document.querySelector("#blackjack-result").textContent = "Lets Play";

    //remueve las cartas en la parte del usuario
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
      dealerImages[i].remove();
    }

    blackjackGame["isStand"] = false;
    blackjackGame.pressOnce = false;
    blackjackGame["isTurnsOver"] = false;
  }
}

// La función blackjackRestart reinicia el juego y los contadores.

function blackjackRestart() {
  blackjackDeal();
  document.querySelector("#wins").textContent = 0;
  document.querySelector("#losses").textContent = 0;
  document.querySelector("#draws").textContent = 0;

  blackjackGame.wins = 0;
  blackjackGame.losses = 0;
  blackjackGame.draws = 0;
}
