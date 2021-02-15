// Required variables
let rightKey = false;
let leftKey = false;
const canvasWidth = 1800
const canvasHeight = 750
let balSnelheidX = 7;
let balSnelheidY = 7;
let rij = 8;
let kolom = 9;
let gameIsGestart = true;
let levenKwijt = false;
let volgendLevel = false;
let levens = 3;
let score = 0;
let level = 1;
var muziekVolume = 0.03;
let currentSong;
const blokkies = [];


// Moeilijkheid
if (level > 1) {
  balSnelheidX = balSnelheidX * level * 0.5;
  balSnelheidY = balSnelheidY * level * 0.5;
  if(!rij <= 14){
    rij = rij + level;
  }
}

// Constructors
const plankConstructor = {
  x: 750,
  y: 700,
  width: 100,
  kleur: "cornflowerblue"
}

plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
plankConstructor.y = canvasHeight - 50;

const balConstructor = {
  x: plankConstructor.x + (plankConstructor.width / 2),
  y: plankConstructor.y - 25,
  kleur: "#E6E6FA",
  diameter: 30
}

// Preload and Setup
function preload() {
  // load heart icon
  heartImage = loadImage('assets/heart.png');

  // Sounds
  soundFormats('mp3');
  blokGeluid = loadSound('assets/blockhit');
  plankGeluid = loadSound('assets/paddlehit');
  levenKwijtGeluid = loadSound('assets/livelost');
  gameOverGeluid = loadSound('assets/death.mp3');
  themeSongs = [loadSound('assets/music/1'), loadSound('assets/music/2'), loadSound('assets/music/3'), loadSound('assets/music/4'), loadSound('assets/music/5'), loadSound('assets/music/6')];

  // load fonts
  loadFont('assets/sansbold.ttf');
  loadFont('assets/sans.ttf');

  // instellingen gui
  sliderRange(0, 1, 0.01);
  var gui = createGui('Intellingen');
  gui.addGlobals('muziekVolume');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  maakBlokkies();
  blokGeluid.setVolume(0.3);
  plankGeluid.setVolume(0.3);
  levenKwijtGeluid.setVolume(0.3);
  gameOverGeluid.setVolume(0.3);
}

// Screen when live is lost
function levenKwijtScherm() {
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40);
  text('Leven kwijt!', canvasWidth / 2, canvasHeight / 2)
  textSize(30);
  if (levens === 1) {
    text('Je hebt nu ' + levens + ' leven over', canvasWidth / 2, canvasHeight / 2 + 40);
  } else {
    text('Je hebt nu ' + levens + ' levens over', canvasWidth / 2, canvasHeight / 2 + 40);
  }
}

// scherm volgend level
function volgendlevelScherm(){
  noStroke();
  fill('#00CDAD');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40)
  text('Gefeliciteerd!', canvasWidth / 2, canvasHeight / 2)
  textSize(30);
  text('Je hebt level ' + level + ' gehaald!', canvasWidth / 2, canvasHeight / 2 + 40 );
}

function mainSchermTekst() {
  // score
  noStroke();
  fill('#FFEEEE');
  textFont('sans')
  textSize(20);
  text('Score: ' + score, 45, 30);

  // levens
  switch (levens) {
    case 3:
      image(heartImage, width - 80, 10, 32, 32);
      image(heartImage, width - 114, 10, 32, 32);
      image(heartImage, width - 149, 10, 32, 32);
      break;
    case 2:
      image(heartImage, width - 80, 10, 32, 32);
      image(heartImage, width - 114, 10, 32, 32);
      break;
    case 1:
      image(heartImage, width - 80, 10, 32, 32);
      break;
  }

}

// Aantal blokken checken
/* function hoeveelBlokkies(){
  if(blokkies.length === null){
    return true;
  }
}

*/

// Maakt de blokjes
function maakBlokkies() {
  const blokBreedte = width / kolom - 4
  for (let c = 0; c < kolom; c++) {
    for (let l = 0; l < rij; l++) {
      const blok = {
        kleur: "#008B8B",
        h: 30,
        b: blokBreedte,
        x: c * (blokBreedte + 2) + 10,
        y: l * (30 + 2) + 40
      }
      blokkies.push(blok);
    }
  }
}

function blokkiesZeichnen() {
  blokkies.forEach(blok => {
    fill(blok.kleur);
    rect(blok.x, blok.y, blok.b, blok.h);
  })
}

// Screen when life is lost
function eindeSpel() {
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40);
  text('Game over!', canvasWidth / 2, canvasHeight / 2);
  textSize(30);
  text('Je eindscore is ' + score, canvasWidth / 2, canvasHeight / 2 + 40);
}


// Ball function
function bal() {
  noStroke();
  fill(balConstructor.kleur);
  ellipse(balConstructor.x, balConstructor.y, balConstructor.diameter, balConstructor.diameter);

  if (balConstructor.y <= balConstructor.diameter / 2) { // If ball touches ceiling of canvas, bounce off
    balSnelheidY *= -1;
  }
  if (balConstructor.x <= balConstructor.diameter / 2 || balConstructor.x >= width - (balConstructor.diameter / 2)) { // If ball touches edge of canvas, bounce off
    balSnelheidX *= -1;
  }
  if (balConstructor.y >= height - ((height - plankConstructor.y) + (balConstructor.diameter / 2)) && balConstructor.x >= plankConstructor.x && balConstructor.x <= plankConstructor.x + (plankConstructor.width / 2)) { // If ball touches first part of plank, bounce to the left and bounce off
    if (balSnelheidX < 0) balSnelheidX = balSnelheidX;
    if (balSnelheidX > 0) balSnelheidX *= -1;
    plankGeluid.play();
    rightKey = false
    leftKey = false
    balSnelheidY *= -1;
  }
  if (balConstructor.y >= height - ((height - plankConstructor.y) + (balConstructor.diameter / 2)) && balConstructor.x >= plankConstructor.x + (plankConstructor.width / 2) && balConstructor.x <= plankConstructor.x + plankConstructor.width) { // if ball touches second part of the plank, bounce to the right and bounce off
    if (balSnelheidX < 0) balSnelheidX *= -1;
    if (balSnelheidX > 0) balSnelheidX = balSnelheidX;
    plankGeluid.play();
    rightKey = false
    leftKey = false
    balSnelheidY *= -1;
  }

  blokkies.forEach((blok, index) => {
    if(blockCheck(blok)){
      blokGeluid.play();
      console.log("Block broken");
      score++;
      blokkies.splice(index, 1);
      balSnelheidY *= -1;
    }
  })

  if (balConstructor.y >= 750) {
    if (levens === 0) {
      currentSong.stop();
      gameIsGestart = false;
      gameOverGeluid.play();
    } else {
      levenKwijtGeluid.play();
      levenKwijt = true;
      levens--;
    }
  }

  // ball movement
  balConstructor.x += balSnelheidX;
  balConstructor.y += balSnelheidY;
}

function blockCheck(blok){
  if(balConstructor.y < blok.y + 2 + blok.h + balConstructor.diameter / 2 && balConstructor.x > blok.x  && balConstructor.x < blok.x + blok.b){
    return true;
  }
}

// Draw plank
function gekkePlank() {
  fill(plankConstructor.kleur);
  rect(plankConstructor.x, plankConstructor.y, plankConstructor.width, 20, 25);
  if (rightKey && plankConstructor.x < width - plankConstructor.width) {
    plankConstructor.x += 18;
  } else if (leftKey && plankConstructor.x > 0) {
    plankConstructor.x -= 18;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 39:
      rightKey = true;
      break;
    case 37:
      leftKey = true;
      break;
    case 32:
      if (levenKwijt) {
        levenKwijt = false;
        balConstructor.y = plankConstructor.y - 25;
        balConstructor.x = plankConstructor.x + (plankConstructor.width / 2);
      } else if (!gameIsGestart) {
        maakBlokkies();
        score = 0;
        levens = 3;
        plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
        balConstructor.y = plankConstructor.y - 25;
        balConstructor.x = plankConstructor.x + (plankConstructor.width / 2);
        gameIsGestart = true;
      }
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case 39:
      rightKey = false;
      break;
    case 37:
      leftKey = false;
      break;

  }
}

//Draw
function draw() {
  background("#f04352");
  if (gameIsGestart && !levenKwijt) { // If gameIsGestart and there is no life lost, draw plank and ball
    if(currentSong){
      if(!currentSong.isPlaying()){
        let song = Math.round(Math.random() * (5 - 0) + 0);
        console.log(song)
        currentSong = themeSongs[song];
        currentSong.setVolume(muziekVolume);
        currentSong.play();
      }else{
        currentSong.setVolume(muziekVolume)
      }
    }else {
      let song = Math.round(Math.random() * (5 - 0) + 0);
      console.log(song)
      currentSong = themeSongs[song];
      currentSong.setVolume(muziekVolume);
      currentSong.play();
    }
    blokkiesZeichnen()
    gekkePlank();
    bal();
    mainSchermTekst();
  } else if (levenKwijt) {
    levenKwijtScherm();
    currentSong.setVolume(muziekVolume)
  } else if (!gameIsGestart) {
    eindeSpel();
  }
}


