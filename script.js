/*
 
1. O básico que é desenhar um quadrado colorido na tela e conseguir mover ele com o teclado (ja foi dificil) ✅
 
2. Trocar o quadrado por uma textura -> PNG qualquer ✅
 
3. Inimigos, spawn, movimento na direção do personagem, dano
 
4. Ataque automático do personagem, cooldown, projétil, dano no inimigo mais próximo
Quero ataque automatico *por enquanto*, se der tempo colocamos atque com M1
 
5. HUD — HP e pontuação na tela
 
6. Game over + restart !!!!sem alert().
 
7. trocar os placeholders por personagens lindos e bonitos
 
8. Animação do jogo, bombinha, sons, tela bonitinha...
 
*/

// SEÇÃO 01 - VARIAVEIS GLOBAIS E CONFIGURAÇÕES DO JOGO

// Configurações e estado do jogo
// precisa colocar gravidade (?) e verificar se ela está ou não n chão 
const player = { x: 50, y: 500, velocityY: 0, noChao: true };
const playerSpeed = 200; // pixels por segundo
const keysPressed = {};

// Grandezas fisicas em pixels/segundo
const GRAVITY = 1200; // gravidade
const JUMP_FORCE = -550; // forca do pulo, negativo pq o topo da tela no webgl é y = 0
const FLOOR_Y = 500; // chao da tela

// Essas variaveis são criadas no configuraTudo e usadas no desenhaCena
let gl;
let program;
let vao;
let playerPosLocation;
let resolutionLocation;
let canvas;
let playerTexture;
let groundTexture;
let groundVao;

// plataformas do cenario
// ordem de cima pra baixo da esquerda pra direita
// x, y = canto superior esquerdo;
const plataformas = [
  { x: 300, y: 100, largura: 120, altura: 30 },
  { x: 100, y: 200, largura: 120, altura: 30 },
  { x: 450, y: 300, largura: 120, altura: 30 },
  { x: 550, y: 200, largura: 120, altura: 30 },
  { x: 200, y: 400, largura: 120, altura: 30 },
  { x: 680, y: 400, largura: 120, altura: 30 },
];

// Array que ira guardar o VAO de cada plataforma
const plataformasVaos = [];

// coloquei na ordem, de tras pra frente
// texture comeca null e é preenchhida em configuraTudo
const camadasCenario = [
  { src: "assets/cenario/camadas/Files/Sky.png", texture: null },
  { src: "assets/cenario/camadas/Files/Clouds.png", texture: null },
  { src: "assets/cenario/camadas/Files/Mountain_Back.png", texture: null },
  { src: "assets/cenario/camadas/Files/Mountain_Middle.png", texture: null },
  { src: "assets/cenario/camadas/Files/Mountain_Front.png", texture: null },
  { src: "assets/cenario/camadas/Files/BackgroundTrees.png", texture: null },
  //{ src: "assets/cenario/camadas/Files/Trees.png", texture: null },
  { src: "assets/cenario/camadas/Files/Ground.png", texture: null },
  { src: "assets/cenario/camadas/Files/Gras.png", texture: null },
];

// SEÇÃO 02 - FUNCAO AUXILIAR QUE COMPILA SHADERS

// compila os shaders uma vez só
function createShader(gl, type, source) {
  const shader = gl.createShader(type); // cria o obj do shader vazio
  gl.shaderSource(shader, source);
  gl.compileShader(shader); // compila na placa de vídeo
  return shader;
}

// SEÇÃO 03 - RODA UMA VEZ SÓ
// Prepara canvas, teclado, shaders, VAOs e texturas

function configuraTudo() {
  canvas = document.querySelector("#glcanvas");
  gl = canvas.getContext("webgl2");

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
  const vertices = new Float32Array([-25, -25, 25, -25, -25, 25, -25, 25, 25, -25, 25, 25]);

  // Mapeamento das coordenadas UV da textura
  const texcoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

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
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);

  const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordLoc);

  // Configuracao da tela, ele via buscar o tamnho da tela e dividir por 2
  // PORQUE?
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

  //   //SOPHIA
  //   // ===============================
  //   // TEXTURA DO CHÃO
  //   // ===============================

    groundTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, groundTexture);

    // pixel temporário enquanto a imagem carrega
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 255, 0, 255]),
    );

    const groundImage = new Image();
    groundImage.src = "assets/cenario/camadas/Files/Ground_plat.png";
    groundImage.texture = null;

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

  // groundImage.onerror = () => {
  //   console.error(
  //     "ERRO: não foi possível carregar a textura do chão:",
  //     groundImage.src,
  //   );
  // };

  // variáveis uniform no shader
  playerPosLocation = gl.getUniformLocation(program, "u_playerPos");
  resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // transparência pro ong
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Cria a textura e deixa um pixel roxo enquanto a personagem nao carrega
  playerTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, playerTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 0, 255, 255]),
  );

  // Carrega a personagemm
  const image = new Image();
  image.src = "assets/placeholder-character.png";
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, playerTexture);
    // envia os pixels da personagem para a placa de video
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Filtro pixel art (vi que sem isso fica tudo pixelaod feio)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  //definindo a cor de fundo do jogo : R,G,B,A
  //gl.clearColor(0.1, 0.1, 0.1, 1.0); //fundo cinza bem escuro
  gl.clearColor(0.97, 0.87, 0.94, 1.0); //fundo rosa claro conforme nossa inspiração
  gl.useProgram(program);

  return gl;
}

function atualizaLogica(quantoPassou) {
  const distancia = playerSpeed * quantoPassou;

  // precisa sempre ao inicio de cada quadro verificar se o personagem está no chão
  // entao assumi que ele sempre está no ar, caindo e quando colide com alguma plataforma ou o choa principal, ele da noChao = true
  player.noChao = false;

  // personagem volta pro chão
  // ou seja, o personagem para no limite do canvas floor_Y e não continua descendo a página
  // aqui é como se ele estivesse pisando em uma linha invisível. Tem que alterar

  // personagem na plataforma
  plataformas.forEach((plat) => {
    const colidiuX =
      player.x + 25 > plat.x && player.x - 25 < plat.x + plat.largura;
    const noTopo = player.y + 25 >= plat.y && player.y + 25 <= plat.y + 15;

    if (colidiuX && noTopo && player.velocityY >= 0) {
      player.y = plat.y - 25;
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

  // pode andar com wasd ou com as setinhas
  // if (keysPressed["ArrowUp"] || keysPressed["w"]) player.y -= distancia;
  // if (keysPressed["ArrowDown"] || keysPressed["s"]) player.y += distancia;

  // gravidade e variavel Y
  if (!player.noChao) {
    player.velocityY += GRAVITY * quantoPassou; // Aumenta a velocidade de queda
    player.y += player.velocityY * quantoPassou; // Atualiza a posição Y
  }

  // anda pra frente e pra tras
  if (keysPressed["ArrowLeft"] || keysPressed["a"]) player.x -= distancia;
  if (keysPressed["ArrowRight"] || keysPressed["d"]) player.x += distancia;

  // não deixa o personagem sair da tela que defini
  player.x = Math.max(25, Math.min(canvas.width - 25, player.x));

  // player.x = Math.max(25, Math.min(canvas.width - 25, player.x));
  // player.y = Math.max(25, Math.min(canvas.height - 25, player.y));
}

function desenhaCena(gl) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //SOPHIA
  // ===============================
  // DESENHA O CHÃO
  // ===============================

  gl.useProgram(program);
  gl.bindVertexArray(groundVao);
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  gl.uniform2f(playerPosLocation, canvas.width / 2, canvas.height / 2);

  // Desenha todas as camadas uma em cima da outra
  camadasCenario.forEach((camada) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, camada.texture);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

  //   // Preenche o chão com tijolos até o final do canvas
  //   for (let y = FLOOR_Y + 57; y < canvas.height + 32; y += 64) {
  //     for (let x = 32; x < canvas.width + 32; x += 64) {
  //       gl.uniform2f(playerPosLocation, x, y);

  //       gl.drawArrays(gl.TRIANGLES, 0, 6);
  //     }
  //   }

  // desenha plataformas
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, groundTexture);

  plataformas.forEach((plat, idx) => {
    gl.bindVertexArray(plataformasVaos[idx]);
    gl.uniform2f(playerPosLocation, plat.x, plat.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

  // Desenha personagem
  gl.bindVertexArray(vao);

  // Ativa a unidade de textura 0 e liga a textura
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, playerTexture);

  // Atualiza as uniforms
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.uniform2f(playerPosLocation, player.x, player.y);

  // Desenha os dois triangulos
  gl.drawArrays(gl.TRIANGLES, 0, 6);
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
