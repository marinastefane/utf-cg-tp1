/*
 
1. O básico que é desenhar um quadrado colorido na tela e conseguir mover ele com o teclado (ja foi dificil) ✅
2. Trocar o quadrado por uma textura -> PNG qualquer ✅
3. Inimigos, spawn, movimento na direção do personagem, dano
4. Ataque automático do personagem, cooldown, projétil, dano no inimigo mais próximo
Quero ataque automatico *por enquanto*, se der tempo colocamos atque com M1

ATAQUE COM MOUSE:
SOPHIA: * o jogador pode usar o _mouse_ para dar "dedadas" no inimigo e subtrair alguns pontos de vida também,ao clicar neles.
Isso é um evento específico chamado click:  https://www.w3schools.com/jsref/event_onclick.asp
vídeo aula: https://www.youtube.com/watch?v=cjpQU6NutU0

5. HUD — HP e pontuação na tela
6. Game over + restart !!!!sem alert().
7. trocar os placeholders por personagens lindos e bonitos
8. Animação do jogo, bombinha, sons, tela bonitinha...
*/

// colisaoccd
// fazer mais detecção de colisão, mais frequente, com distancias menores
// relacionado a velocidade o playerSpeed
// posso colocar uma velocidade maxima
// raycasting:

// SEÇÃO 01 - VARIAVEIS GLOBAIS E CONFIGURAÇÕES DO JOGO

// Essas variaveis são criadas no configuraTudo e usadas no desenhaCena
let gl;
let program;
let vao;
let playerPosLocation;
let resolutionLocation;
let canvas;
let playerTexcoordBuffer;
let groundTexture;
let groundVao;
let inimigoVao;
let inimigoTexture;
let inimigoTexcoordBuffer;
let ataqueInimigoVao;
let ataqueTexture;
let ataqueTexcoordBuffer;

// Configurações e estado do jogo
// precisa colocar gravidade (?) e verificar se ela está ou não n chão
const player = { x: 400, y: 500, velocityY: 0, noChao: true, hp: 100 };
const playerSpeed = 200; // pixels por segundo
const keysPressed = {};

// Grandezas fisicas em pixels/segundo
const GRAVITY = 1200; // gravidade
const JUMP_FORCE = -550; // forca do pulo, negativo pq o topo da tela no webgl é y = 0
const FLOOR_Y = 470; // chao da tela

// controle da sprite da personagem
const playerSprite = {
  animAtual: "idle",
  frameAtual: 0,
  timer: 0,
  terminou: false,
};

// // controle da sprite da personagem
// const enemySprite = {
//   animAtual: "idle",
//   frameAtual: 0,
//   timer: 0,
//   terminou: false,
// };

// plataformas do cenario
// ordem de cima pra baixo da esquerda pra direita
// x, y = canto superior esquerdo;
const plataformas = [
  { x: 640, y: 70, largura: 120, altura: 33 },
  { x: 0, y: 60, largura: 120, altura: 33 },
  { x: 300, y: 100, largura: 120, altura: 33 },
  { x: 100, y: 200, largura: 120, altura: 33 },
  { x: 550, y: 200, largura: 120, altura: 33 },
  { x: 0, y: 330, largura: 120, altura: 33 },
  { x: 400, y: 300, largura: 120, altura: 33 },
  { x: 200, y: 400, largura: 120, altura: 33 },
  { x: 680, y: 400, largura: 120, altura: 33 },
];

// Array que ira guardar o VAO de cada plataforma
const plataformasVaos = [];

// coloquei na ordem, de tras pra frente
// texture comeca null e é preenchhida em configuraTudo
// const camadasCenario = [
//   { src: "assets/cenario/camadas/Files/Sky.png", texture: null },
//   { src: "assets/cenario/camadas/Files/Clouds.png", texture: null },
//   { src: "assets/cenario/camadas/Files/Mountain_Back.png", texture: null },
//   { src: "assets/cenario/camadas/Files/Mountain_Middle.png", texture: null },
//   // { src: "assets/cenario/camadas/Files/Mountain_Front.png", texture: null },
//   {
//     src: "assets/cenario/camadas/Files/BackgroundTrees_pink.png",
//     texture: null,
//   },
//   // { src: "assets/cenario/camadas/Files/Trees.png", texture: null },
//   { src: "assets/cenario/camadas/Files/Ground.png", texture: null },
//   { src: "assets/cenario/camadas/Files/Gras.png", texture: null },
// ];

const camadasCenario = [
  { src: "assets/cenario/Jungle/1.Backround.png", texture: null },
  { src: "assets/cenario/Jungle/2.Trees_back.png", texture: null },
  { src: "assets/cenario/Jungle/3.Trees_front.png", texture: null },
  //{ src: "assets/cenario/Jungle/4.Ground.png", texture: null },
  // { src: "assets/cenario/camadas/Files/Mountain_Front.png", texture: null },
  {
    src: "assets/cenario/camadas/Files/BackgroundTrees.png",
    texture: null,
  },
  // { src: "assets/cenario/camadas/Files/Trees.png", texture: null },
  { src: "assets/cenario/camadas/Files/Ground.png", texture: null },
  { src: "assets/cenario/camadas/Files/Gras.png", texture: null },
];

const camadasPlat = [
  {
    src: "assets/cenario/camadas/Files/BackgroundTrees_plat.png",
    texture: null,
  },
  { src: "assets/cenario/camadas/Files/Ground_plat.png", texture: null },
];

const animacoesPlayer = {
  idle: {
    src: "assets/personagem/RedCape/Red_idle_sword.png",
    totalFrames: 5,
    duracaoFrame: 0.1,
    loop: true,
    texture: null,
  },
  walk: {
    src: "assets/personagem/RedCape/Red_Walking.png",
    totalFrames: 9,
    duracaoFrame: 0.1,
    loop: true,
    texture: null,
  },
  running: {
    src: "assets/personagem/RedCape/Red_Running.png",
    totalFrames: 9,
    duracaoFrame: 0.1,
    loop: true,
    texture: null,
  },
  jump: {
    src: "assets/personagem/RedCape/Red_jumping.png",
    totalFrames: 4,
    duracaoFrame: 0.1,
    loop: false,
    texture: null,
  },
  landing: {
    src: "assets/personagem/RedCape/Red_landing.png",
    totalFrames: 4,
    duracaoFrame: 0.1,
    loop: false,
    texture: null,
  },
  attack: {
    src: "assets/personagem/RedCape/Red_attack_1.png",
    totalFrames: 6,
    duracaoFrame: 0.08,
    loop: false,
    texture: null,
  },
  death: {
    src: "assets/personagem/RedCape/Red_Death.png",
    totalFrames: 6,
    duracaoFrame: 0.12,
    loop: false,
    texture: null,
  },
};

const animacoesEnemy = {
  idle: {
    src: "assets/inimigos/cogumelo/Mushroom-Idle.png",
    totalFrames: 7,
    duracaoFrame: 0.1,
    loop: true,
    texture: null,
  },
  running: {
    src: "assets/inimigos/cogumelo/Mushroom-Run.png",
    totalFrames: 8,
    duracaoFrame: 0.1,
    loop: true,
    texture: null,
  },
  stun: {
    src: "assets/inimigos/cogumelo/Mushroom-Stun.png",
    totalFrames: 18,
    duracaoFrame: 0.1,
    loop: false,
    texture: null,
  },
  hit: {
    src: "assets/inimigos/cogumelo/Mushroom-Hit.png",
    totalFrames: 5,
    duracaoFrame: 0.1,
    loop: false,
    texture: null,
  },
  attack: {
    src: "assets/inimigos/cogumelo/Mushroom-Attack.png",
    totalFrames: 10,
    duracaoFrame: 0.08,
    loop: false,
    texture: null,
  },
  death: {
    src: "assets/inimigos/cogumelo/Mushroom-Die.png",
    totalFrames: 15,
    duracaoFrame: 0.12,
    loop: false,
    texture: null,
  },
};

const spriteAtaque = {
  src: "assets/efeitos/Retro Impact Effect Pack 5/Retro Impact Effect Pack 5 A.png",
  totalColunas: 9,
  totalLinhas: 30,
  linha: 29, // quero a mesma sempre
  duracaoFrame: 0.5,
  loop: true,
  texture: null,
};

const inimigos = [];
let ataqueInimigo = [];

const configInimigos = {
  chao: {
    largura: 40,
    altura: 40,
    velocityY: 90,
    hp: 4, // vida dele
  },
  // voador: {
  //  largura: 40,
  // altura: 40,
  // velocityY: 60,
  // hp: 2, // vida dele
  // }
};

const configAtaqueInimigos = {
  largura: 10,
  altura: 10,
  // velocidade: 200,
  dano: 10,
  cooldownAtaque: 2,
};

const spawn = 5; // vai aparecer um inimigo no chao a cada 3 segundos
let spawnTimer = 0;
let ataqueTimer = 0;

// SEÇÃO 02 - TELAS E MENU - CONTROLE DAS TELAS DO JOGO
// Estado atual do jogo
let gameState = "splash";

// Telas
const splashScreen = document.querySelector("#splashScreen");
const menuScreen = document.querySelector("#menuScreen");
const optionsScreen = document.querySelector("#optionsScreen");
const creditsScreen = document.querySelector("#creditsScreen");
const gameOverScreen = document.querySelector("#gameOverScreen");

// Botões
const playButton = document.querySelector("#playButton");
const optionsButton = document.querySelector("#optionsButton");
const creditsButton = document.querySelector("#creditsButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const backOptionsButton = document.querySelector("#backOptionsButton");
const backCreditsButton = document.querySelector("#backCreditsButton");
const restartButton = document.querySelector("#restartButton");
const menuButton = document.querySelector("#menuButton");

// Opções
const volumeSlider = document.querySelector("#volumeSlider");

// Música do Menu
// não consigo fazer a musica iniciar sem que haja uma interação do usuário. =(
const menuMusic = new Audio("assets/audio/Celestial_Path.wav");
menuMusic.loop = true;
menuMusic.volume = Number(volumeSlider.value); // Começa em 50%, igual ao valor inicial do slider

volumeSlider.addEventListener("input", () => {
  menuMusic.volume = Number(volumeSlider.value);
});

// Se o navegador bloquear o autoplay, a primeira interação do usuário inicia a música
document.addEventListener("click", () => {
  if (gameState === "menu" && menuMusic.paused) {
    menuMusic.play();
  }
});

// Tela cheia
fullscreenButton.addEventListener("click", () => {
  const gameContainer = document.querySelector(".game-container");

  if (!document.fullscreenElement) {
    gameContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Esconde todas as telas
function esconderTelas() {
  splashScreen.classList.add("hidden");
  menuScreen.classList.add("hidden");
  optionsScreen.classList.add("hidden");
  creditsScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
}

// SPLASH SCREEN
// Depois de 2 segundos, sai da splash e mostra o menu
setTimeout(() => {
  esconderTelas();
  menuScreen.classList.remove("hidden");
  gameState = "menu";
  // menuMusic.play().catch(() => {
  //   console.log("O navegador bloqueou o autoplay.");
  // });
}, 2000);

// TELA DE JOGOS
playButton.addEventListener("click", () => {
  esconderTelas(); // Esconde menu, opções, créditos etc.
  gameState = "playing"; // Inicia o jogo
  // Para a música do menu
  // !! CONTINUAR MUSICA !!
  menuMusic.pause();
  menuMusic.currentTime = 0;
});

// TELA DE OPÇÕES
optionsButton.addEventListener("click", () => {
  esconderTelas();
  optionsScreen.classList.remove("hidden");
  gameState = "options";
});

backOptionsButton.addEventListener("click", () => {
  esconderTelas();
  menuScreen.classList.remove("hidden");
  gameState = "menu";
});
// Volta para o menu principal

// TELA DE CRÉDITOS
creditsButton.addEventListener("click", () => {
  esconderTelas();
  creditsScreen.classList.remove("hidden");
  gameState = "credits";
});

backCreditsButton.addEventListener("click", () => {
  esconderTelas();
  menuScreen.classList.remove("hidden");
  gameState = "menu";
});

// SEÇÃO 03 - FUNÇÕES AUXILIARES

// FUNCAO AUXILIAR QUE COMPILA SHADERS
function createShader(gl, type, source) {
  const shader = gl.createShader(type); // cria o obj do shader vazio
  gl.shaderSource(shader, source);
  gl.compileShader(shader); // compila na placa de vídeo
  return shader;
}

// recortar o sprite
function montarSprite(frameAtual, totalFrames) {
  // quantas cenas tem do personagem
  const frame = frameAtual % totalFrames;
  const larguraFrame = 1.0 / totalFrames;

  const uMin = frame * larguraFrame;
  const uMax = uMin + larguraFrame;

  // Array unico com os 6 vertices do quadrado (area) do personagem
  return new Float32Array([
    uMin,
    0.0, // superior esquerdo
    uMax,
    0.0, // superior direito
    uMin,
    1.0, // inferior esquerdo

    uMin,
    1.0, // inferior esquerdo
    uMax,
    0.0, // superior direito
    uMax,
    1.0, // inferior direito
  ]);
}

// recortar o sprite grandao
function montarSpriteGrid(coluna, totalColunas, linha, totalLinhas) {
  // quantas cenas tem do personagem
  const frameY = coluna % totalColunas;
  const larguraFrame = 1.0 / totalColunas;
  const alturaFrame = 1.0 / totalLinhas;

  const uMin = frameY * larguraFrame;
  const uMax = uMin + larguraFrame;

  const vMin = linha * alturaFrame;
  const vMax = vMin + alturaFrame;

  // Array unico com os 6 vertices do quadrado (area) do personagem
  return new Float32Array([
    uMin,
    vMin, // superior esquerdo
    uMax,
    vMin, // superior direito
    uMin,
    vMax, // inferior esquerdo

    uMin,
    vMax, // inferior esquerdo
    uMax,
    vMin, // superior direito
    uMax,
    vMax, // inferior direito
  ]);
}

function trocarSprite(nome) {
  if (playerSprite.animAtual === nome) {
    return;
  }
  playerSprite.animAtual = nome;
  playerSprite.frameAtual = 0;
  playerSprite.timer = 0;
  playerSprite.terminou = false;
}

// sao varios inimigos entao tem que fazer individual pra cada um
function spawnInimigo() {
  // tava muito ruim de inimigo
  if (inimigos.length >= 3) {
    return;
  }

  // ele vai nascer das bordas da tela, tanto faz se é esquerda ou direita
  const ladoEsquerdo = Math.random() < 0.5;
  const x = ladoEsquerdo ? -30 : canvas.width + 30;

  inimigos.push({
    tipo: "chao",
    x: x,
    y: FLOOR_Y + 30, // AQUELA MESMA BEÇÃO DO PERSONAGEM, ALTURA DO PEZINHO NO CHAO
    hp: configInimigos.chao.hp,
    cooldownAtaque: 0,
    // aqui faz a animacao individual
    animAtual: "running",
    frameAtual: 0,
    timer: 0,
    terminou: false,
  });
}

function spawnAtaqueInimigo(inimigo) {
  // vai calcular qual a distancia do inimigo até a personagem
  // se ta perto, vai numa velocidade ok
  // se esta longe vai super rapido
  const direcaoX = player.x - inimigo.x;
  const direcaoY = player.y - inimigo.y;

  ataqueInimigo.push({
    x: inimigo.x,
    y: inimigo.y,
    velocidadeX: direcaoX * 2,
    velocidadeY: direcaoY * 2,
    // animAtual: ,
    frameAtual: 0,
    timer: 0,
    terminou: false,
  });
}

// SEÇÃO 03 - RODA UMA VEZ SÓ
// Prepara canvas, teclado, shaders, VAOs e texturas

function configuraTudo() {
  canvas = document.querySelector("#glcanvas");
  gl = canvas.getContext("webgl2");

  // const metadeLarguraa = canvas.width / 2;
  // console.log(metadeLarguraa);

  // Input do teclado
  window.addEventListener("keydown", (e) => (keysPressed[e.key] = true));
  window.addEventListener("keyup", (e) => (keysPressed[e.key] = false));

  // PERDIDINHA
  const vsCode = `#version 300 es
    in vec2 a_position;
    in vec2 a_texcoord;

    uniform vec2 u_playerPos;
    uniform vec2 u_resolution;

    out vec2 v_texcoord;

    void main() {
      vec2 position = a_position + u_playerPos;
      vec2 zeroToOne = position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;

      gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
      v_texcoord = a_texcoord;
    }
  `;

  // aplica a cor do pixel da textura
  const fsCode = `#version 300 es
    precision highp float;

    in vec2 v_texcoord;
    uniform sampler2D u_texture;

    out vec4 outColor;

    void main() {
      outColor = texture(u_texture, v_texcoord);
    }
  `;

  const vs = createShader(gl, gl.VERTEX_SHADER, vsCode);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsCode);

  // Compila o programa webgl
  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // 03.2 - GEOMETRIA DA PERSONAGEM (50x50)

  // Vertices do quadrado do personagem (2 triângulos)
  const vertices = new Float32Array([
    -70, -50, 70, -50, -70, 50, -70, 50, 70, -50, 70, 50,
  ]);

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // VBO de Posição
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const posicaoLoc = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(posicaoLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posicaoLoc);

  // VBO de Coordenadas UV
  playerTexcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, playerTexcoordBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
  const initialSprite = montarSprite(0, playerSprite.totalFrames);
  gl.bufferData(gl.ARRAY_BUFFER, initialSprite, gl.DYNAMIC_DRAW);

  const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordLoc);

  // variáveis uniform no shader
  playerPosLocation = gl.getUniformLocation(program, "u_playerPos");
  resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // transparência pro ong
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Carrega a personagem
  Object.values(animacoesPlayer).forEach((animacao) => {
    animacao.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, animacao.texture);

    // cor temporaria pra carregar o fundo
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]),
    );

    const img = new Image();
    img.src = animacao.src;

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, animacao.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Filtro pixel art para não borrar
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
  });

  // 03.3 - GEOMETRIAS DOS INIMIGOS
  // Vertices do quadrado do personagem (2 triângulos)
  const inimigoVertices = new Float32Array([
    -50, -40, 50, -40, -50, 40, -50, 40, 50, -40, 50, 40,
  ]);

  // Mapeamento das coordenadas UV da textura
  const inimigoTexcoords = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
  ]);

  inimigoVao = gl.createVertexArray();
  gl.bindVertexArray(inimigoVao);

  // VBO de Posição
  const inimigoPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, inimigoPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, inimigoVertices, gl.STATIC_DRAW);

  // da pra usar o mesmo do personagem
  // const posicaoLoc = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(posicaoLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posicaoLoc);

  // VBO de Coordenadas UV
  inimigoTexcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, inimigoTexcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, inimigoTexcoords, gl.STATIC_DRAW);

  // da pra usar o mesmo do personagem
  // const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordLoc);

  // Carrega o inimigo
  Object.values(animacoesEnemy).forEach((animacao) => {
    animacao.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, animacao.texture);

    // cor temporaria pra carregar o fundo
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]),
    );

    const img = new Image();
    img.src = animacao.src;

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, animacao.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Filtro pixel art para não borrar
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
  });

  // 03.4 - GEOMETRIAS DOS ATAQUES DOS INIMIGOS
  // Vertices do quadrado do personagem (2 triângulos)
  const inimigoAtaqueVertices = new Float32Array([
    -40, -40, 40, -40, -40, 40, -40, 40, 40, -40, 40, 40,
  ]);

  // Mapeamento das coordenadas UV da textura
  const inimigoAtaqueTexcoords = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
  ]);

  ataqueInimigoVao = gl.createVertexArray();
  gl.bindVertexArray(ataqueInimigoVao);

  // VBO de Posição
  const inimigoAtquePositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, inimigoAtquePositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, inimigoAtaqueVertices, gl.STATIC_DRAW);

  // da pra usar o mesmo do personagem
  // const posicaoLoc = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(posicaoLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posicaoLoc);

  // VBO de Coordenadas UV
  ataqueTexcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ataqueTexcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, inimigoAtaqueTexcoords, gl.STATIC_DRAW);

  // da pra usar o mesmo do personagem
  // const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordLoc);

  // Carrega o inimigo
  spriteAtaque.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, spriteAtaque.texture);

  // cor temporaria pra carregar o fundo
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  );

  const img = new Image();
  img.src = spriteAtaque.src;

  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, spriteAtaque.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    // Filtro pixel art para não borrar
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  // Configuracao da tela, ele via buscar o tamnho da tela e dividir por 2
  const metadeLargura = canvas.width / 2;
  const metadeAltura = canvas.height / 2;

  // o tamanho exato da tela
  const groundVertices = new Float32Array([
    -metadeLargura,
    -metadeAltura,
    metadeLargura,
    -metadeAltura,
    -metadeLargura,
    metadeAltura,

    -metadeLargura,
    metadeAltura,
    metadeLargura,
    -metadeAltura,
    metadeLargura,
    metadeAltura,
  ]);

  const groundTexcoords = new Float32Array([
    0, 0, 1, 0, 0, 1,

    0, 1, 1, 0, 1, 1,
  ]);

  groundVao = gl.createVertexArray();
  gl.bindVertexArray(groundVao);

  // posições do tile
  const groundPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, groundPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, groundVertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(posicaoLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posicaoLoc);

  // coordenadas da textura
  const groundTexcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, groundTexcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, groundTexcoords, gl.STATIC_DRAW);

  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordLoc);

  // carregar as imagens do fundo
  camadasCenario.forEach((camada) => {
    camada.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, camada.texture);

    // cor temporaria pra carregar o fundo
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]),
    );

    const img = new Image();
    img.src = camada.src;

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, camada.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Filtro pixel art para não borrar
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
  });

  // platafromas, cria um VAO e VBO novo para cada uma
  // mudar aula dia 14/09 ele pediu para não ficar atualizano VBO toda hora, ver como fazer
  plataformas.forEach((plat) => {
    const platVao = gl.createVertexArray();
    gl.bindVertexArray(platVao);

    const platVertices = new Float32Array([
      0,
      0,
      plat.largura,
      0,
      0,
      plat.altura,
      0,
      plat.altura,
      plat.largura,
      0,
      plat.largura,
      plat.altura,
    ]);

    const platTexcoords = new Float32Array([
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
    ]);

    const platPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, platPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, platVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(posicaoLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posicaoLoc);

    const platTexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, platTexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, platTexcoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordLoc);

    plataformasVaos.push(platVao);
  });

  // TEXTURA DO CHÃO

  // camadasPlat.forEach((camada) => {
  //   camada.texture = gl.createTexture();
  //   gl.bindTexture(gl.TEXTURE_2D, camada.texture);
  //   groundTexture = gl.createTexture();

  //   // cor temporaria pra carregar o fundo
  //   gl.texImage2D(
  //     gl.TEXTURE_2D,
  //     0,
  //     gl.RGBA,
  //     1,
  //     1,
  //     0,
  //     gl.RGBA,
  //     gl.UNSIGNED_BYTE,
  //     new Uint8Array([0, 0, 0, 0]),
  //   );

  //   const img = new Image();
  //   img.src = camada.src;

  //   img.onload = () => {
  //     gl.bindTexture(gl.TEXTURE_2D, camada.texture);
  //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  //     // Filtro pixel art para não borrar
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //   };
  // });

  const groundImage = new Image();
  groundImage.src = "assets/cenario/camadas/Files/Ground_plat.png";
  groundTexture = gl.createTexture();

  groundImage.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, groundTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      groundImage,
    );

    // Mantém os pixels definidos, sem borrar
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  //definindo a cor de fundo do jogo : R,G,B,A
  gl.clearColor(0.97, 0.87, 0.94, 1.0); //fundo rosa claro conforme nossa inspiração
  gl.useProgram(program);

  return gl;
}

function atualizaLogica(quantoPassou) {
  const distancia = playerSpeed * quantoPassou;

  // personagem morreu, nada pode acontecer depois, ou seja, andar, pular, aparecer inimigo
  // colocar tela de game over
  if (player.hp <= 0) {
    trocarSprite("death");

    // sabe qual animacao esta
    const animAtualObj = animacoesPlayer[playerSprite.animAtual];
    // isso aqui vai acumulando o tempo que aquele frame da animcao ficou na tela
    playerSprite.timer += quantoPassou;
    // isso aqui pergunta "hmm, ja posso trocar pro proximo frame?"
    // usa o tempo que coloquei lá em cima em cada uma das cenas, 0.1 pra tudo
    // se o timer for menor que isso, continua, caso seja maior TROCA e zera o cronometro pra proxima
    if (playerSprite.timer >= animAtualObj.duracaoFrame) {
      playerSprite.timer = 0;
      // isso aqui é um for falso, ve se esta no ultimo frame, enquanto nao tiver lá fica somando +1 frame, passando pro proximo
      if (playerSprite.frameAtual < animAtualObj.totalFrames - 1) {
        playerSprite.frameAtual++;
        // ai se for o ultimo, ve se a animacao é de loop, tambem configurado lá em cima
        // se for loop, volta pro frame 0
      }
    }
    return;
  }

  // // morreu, nada pode acontecer depois, ou seja, andar, pular, aparecer inimigo
  // if (configInimigos.chao.hp <= 0) {
  //   trocarSprite("death");

  //   // sabe qual animacao esta
  //   const animAtualObj = animacoesEnemy[enemySprite.animAtual];
  //   // isso aqui vai acumulando o tempo que aquele frame da animcao ficou na tela
  //   enemySprite.timer += quantoPassou;
  //   // isso aqui pergunta "hmm, ja posso trocar pro proximo frame?"
  //   // usa o tempo que coloquei lá em cima em cada uma das cenas, 0.1 pra tudo
  //   // se o timer for menor que isso, continua, caso seja maior TROCA e zera o cronometro pra proxima
  //   if (enemySprite.timer >= animAtualObj.duracaoFrame) {
  //     enemySprite.timer = 0;
  //     // isso aqui é um for falso, ve se esta no ultimo frame, enquanto nao tiver lá fica somando +1 frame, passando pro proximo
  //     if (enemySprite.frameAtual < animAtualObj.totalFrames - 1) {
  //       enemySprite.frameAtual++;
  //       // ai se for o ultimo, ve se a animacao é de loop, tambem configurado lá em cima
  //       // se for loop, volta pro frame 0
  //     }
  //   }
  //   return;
  // }

  // decide qual animação deveria tocar
  // sempre volta pra ela parada
  let animDesejada = "idle";
  if (!player.noChao) {
    animDesejada = "jump";
  } else if (
    keysPressed["ArrowLeft"] ||
    keysPressed["a"] ||
    keysPressed["ArrowRight"] ||
    keysPressed["d"]
  ) {
    animDesejada = "walk";
  }

  // essa tem que sobrepor qualquer outra
  const emAnimacaoBloqueante =
    (playerSprite.animAtual === "attack" ||
      playerSprite.animAtual === "death") &&
    !playerSprite.terminou;

  if (!emAnimacaoBloqueante) {
    trocarSprite(animDesejada);
  }

  // // essa tem que sobrepor qualquer outra
  // const emAnimacaoBloqueanteInimigo =
  //   (enemySprite.animAtual === "attack" || enemySprite.animAtual === "death") &&
  //   !enemySprite.terminou;

  // if (!emAnimacaoBloqueanteInimigo) {
  //   trocarSprite(animDesejada);
  // }

  // sabe qual animacao esta
  const animAtualObj = animacoesPlayer[playerSprite.animAtual];
  // isso aqui vai acumulando o tempo que aquele frame da animcao ficou na tela
  playerSprite.timer += quantoPassou;
  // isso aqui pergunta "hmm, ja posso trocar pro proximo frame?"
  // usa o tempo que coloquei lá em cima em cada uma das cenas, 0.1 pra tudo
  // se o timer for menor que isso, continua, caso seja maior TROCA e zera o cronometro pra proxima
  if (playerSprite.timer >= animAtualObj.duracaoFrame) {
    playerSprite.timer = 0;
    // isso aqui é um for falso, ve se esta no ultimo frame, enquanto nao tiver lá fica somando +1 frame, passando pro proximo
    if (playerSprite.frameAtual < animAtualObj.totalFrames - 1) {
      playerSprite.frameAtual++;
      // ai se for o ultimo, ve se a animacao é de loop, tambem configurado lá em cima
      // se for loop, volta pro frame 0
    } else if (animAtualObj.loop) {
      playerSprite.frameAtual = 0;
      // caso nao seja de loop, finaliza
      // precisei por para os de morte e ataque, se nao ela ia ficar morrendo um monte de vez, foi engracado kkkkk
    } else {
      playerSprite.terminou = true;
    }
  }

  // config inimigos
  spawnTimer += quantoPassou;
  if (spawnTimer >= spawn) {
    spawnTimer = 0;
    spawnInimigo();
  }

  inimigos.forEach((inimigo) => {
    if (inimigo.tipo === "chao") {
      const distancia = configInimigos.chao.velocityY * quantoPassou;

      // segue o player só no chao, sempre grudado
      if (inimigo.x < player.x) inimigo.x += distancia;
      else if (inimigo.x > player.x) inimigo.x -= distancia;

      inimigo.y = FLOOR_Y + 10; // sempre no chao
    }

    // sabe qual animacao esta
    const animInimigoObj = animacoesEnemy[inimigo.animAtual];
    // isso aqui vai acumulando o tempo que aquele frame da animcao ficou na tela
    inimigo.timer += quantoPassou;
    // isso aqui pergunta "hmm, ja posso trocar pro proximo frame?"
    // usa o tempo que coloquei lá em cima em cada uma das cenas, 0.1 pra tudo
    // se o timer for menor que isso, continua, caso seja maior TROCA e zera o cronometro pra proxima
    if (inimigo.timer >= animInimigoObj.duracaoFrame) {
      inimigo.timer = 0;
      // isso aqui é um for falso, ve se esta no ultimo frame, enquanto nao tiver lá fica somando +1 frame, passando pro proximo
      if (inimigo.frameAtual < animInimigoObj.totalFrames - 1) {
        inimigo.frameAtual++;
        // ai se for o ultimo, ve se a animacao é de loop, tambem configurado lá em cima
        // se for loop, volta pro frame 0
      } else if (animInimigoObj.loop) {
        inimigo.frameAtual = 0;
        // caso nao seja de loop, finaliza
        // precisei por para os de morte e ataque, se nao ela ia ficar morrendo um monte de vez, foi engracado kkkkk
      } else {
        inimigo.terminou = true;
      }
    }

    // fazer se der tempo
    // else if (inimigo.tipo === "voador")
  });

  // config ataque inimigos
  ataqueTimer += quantoPassou;
  if (
    ataqueTimer >= configAtaqueInimigos.cooldownAtaque &&
    inimigos.length > 0
  ) {
    ataqueTimer = 0;
    const inimigoQueAtira =
      inimigos[Math.floor(Math.random() * inimigos.length)];
    spawnAtaqueInimigo(inimigoQueAtira);
  }

  ataqueInimigo = ataqueInimigo.filter((ataque) => {
    ataque.x += ataque.velocidadeX * quantoPassou;
    ataque.y += ataque.velocidadeY * quantoPassou;

    // avança o frame da animação do efeito
    ataque.timer += quantoPassou;
    if (ataque.timer >= spriteAtaque.duracaoFrame) {
      ataque.timer = 0;
      if (ataque.frameAtual < spriteAtaque.totalColunas - 1) {
        ataque.frameAtual++;
      }
    }

    const distanciaX = Math.abs(ataque.x - player.x);
    const distanciaY = Math.abs(ataque.y - player.y);
    const acertou = distanciaX <= 15 && distanciaY <= 50; // hitbox do boneco

    if (acertou) {
      player.hp = Math.max(0, player.hp - configAtaqueInimigos.dano);
      return false; // some da tela se deu dano
    }

    // ele tem que sumir se estver fora da tela, se nao acumula no array e explode meu pc da xuxa
    const foraDaTela =
      ataque.x < -50 ||
      ataque.x > canvas.width + 50 ||
      ataque.y < -50 ||
      ataque.y > canvas.height + 50;

    return !foraDaTela; // continua so se nao saiu da tela
  });

  // anda pra frente e pra tras
  if (keysPressed["ArrowLeft"] || keysPressed["a"]) player.x -= distancia;
  if (keysPressed["ArrowRight"] || keysPressed["d"]) player.x += distancia;

  // precisa sempre ao inicio de cada quadro verificar se o personagem está no chão
  // entao assumi que ele sempre está no ar, caindo e quando colide com alguma plataforma ou o choa principal, ele da noChao = true
  player.noChao = false;

  // personagem na plataforma
  plataformas.forEach((plat) => {
    // o 15 é a distancia do centro do personagem até a borda que eu quero que ele clida com a plataforma
    // 40 é a altura da colisao dos pés da bonequinha com o chao da plataforma
    const colidiuX =
      player.x + 15 > plat.x && player.x - 15 < plat.x + plat.largura;
    const noTopo = player.y + 40 >= plat.y && player.y + 40 <= plat.y + 15;

    if (colidiuX && noTopo && player.velocityY >= 0) {
      player.y = plat.y - 40;
      player.velocityY = 0;
      player.noChao = true;
    }
  });

  if (player.y >= FLOOR_Y) {
    player.y = FLOOR_Y;
    player.velocityY = 0;
    player.noChao = true;
  }

  // pulo
  if (
    (keysPressed[" "] || keysPressed["ArrowUp"] || keysPressed["w"]) &&
    player.noChao
  ) {
    player.velocityY = JUMP_FORCE;
    player.noChao = false;
  }

  // gravidade e variavel Y
  if (!player.noChao) {
    player.velocityY += GRAVITY * quantoPassou; // Aumenta a velocidade de queda
    player.y += player.velocityY * quantoPassou; // Atualiza a posição Y
  }

  // não deixa o personagem sair da tela que defini
  player.x = Math.max(35, Math.min(canvas.width - 35, player.x));
}

function desenhaCena(gl) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  // DESENHA CENARIO DE FUNDO
  gl.bindVertexArray(groundVao);
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.uniform2f(playerPosLocation, canvas.width / 2, canvas.height / 2);

  // 1. Desenha todas as camadas uma em cima da outra
  camadasCenario.forEach((camada) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, camada.texture);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

  // 2. Desenha plataformas
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, groundTexture);

  plataformas.forEach((plat, idx) => {
    gl.bindVertexArray(plataformasVaos[idx]);
    gl.uniform2f(playerPosLocation, plat.x, plat.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

  // 3. Desenha personagem
  gl.bindVertexArray(vao);

  const animAtual = animacoesPlayer[playerSprite.animAtual];

  // Ativa a unidade de textura 0 e liga a textura
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, animAtual.texture);

  const uvCoords = montarSprite(playerSprite.frameAtual, animAtual.totalFrames);

  gl.bindBuffer(gl.ARRAY_BUFFER, playerTexcoordBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvCoords);

  // Atualiza as uniforms
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.uniform2f(playerPosLocation, player.x, player.y);

  // Desenha os dois triangulos
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // 4. Desenha inimigos
  gl.bindVertexArray(inimigoVao);
  gl.activeTexture(gl.TEXTURE0);

  inimigos.forEach((inimigo) => {
    const animInimigoObj = animacoesEnemy[inimigo.animAtual];

    gl.bindTexture(gl.TEXTURE_2D, animInimigoObj.texture);

    const uvCoords = montarSprite(
      inimigo.frameAtual,
      animInimigoObj.totalFrames,
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, inimigoTexcoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvCoords);

    gl.uniform2f(playerPosLocation, inimigo.x, inimigo.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

  // 5. Desenha ataque inimigos reaproveitando a textura do inimigo
  gl.bindVertexArray(ataqueInimigoVao);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, spriteAtaque.texture);

  ataqueInimigo.forEach((ataque) => {
    const uvCoords = montarSpriteGrid(
      ataque.frameAtual,
      spriteAtaque.totalColunas,
      spriteAtaque.linha,
      spriteAtaque.totalLinhas,
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, ataqueTexcoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvCoords);

    gl.uniform2f(playerPosLocation, ataque.x, ataque.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });
}

gl = configuraTudo();
let logoAntes = 0;

function loopPrincipal(agora) {
  const quantoPassou = (agora - logoAntes) / 1000;
  logoAntes = agora;

  if (gl) {
    atualizaLogica(quantoPassou);
    desenhaCena(gl);
  }

  requestAnimationFrame(loopPrincipal);
}

requestAnimationFrame(loopPrincipal);
