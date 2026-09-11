/*

1. O básico que é desenhar um quadrado colorido na tela e conseguir mover ele com o teclado (ja foi dificil) ✅

2. Trocar o quadrado por uma textura -> PNG qualquer ✅

3. Inimigos, spawn, movimento na direção do personagem, dano

4. Ataque automático do personagem, cooldown, projétil, dano no inimigo mais próximo
Quero ataque automatico *por enquanto*, se der tempo colocamos atque com M1

5. HUD — HP e pontuação na tela

6. Game over + restart  !!!!sem alert().

7. trocar os placeholders por personagens lindos e bonitos

8. Animação do jogo, bombinha, sons, tela bonitinha...

*/

// Configurações e estaod do jogo
// testando pra ver se consigo por pra ela pular,
// precisa colocar gravidade (?) e verificar se ela está ou não n chão
const player = { x: 50, y: 500, velocityY: 0, noChao: true};
const playerSpeed = 200; // pixels por segundo
const keysPressed = {};

// Grandezas fisicas em pixels/segundo
const GRAVITY = 1200;    // gravidade
const JUMP_FORCE = -450;  // forca do pulo, negativo pq o topo da tela no webgl é y = 0
const FLOOR_Y = 500;     // chao da tela

let gl;
let program;
let vao;
let playerPosLocation;
let resolutionLocation;
let canvas;
let playerTexture;

// compila os shaders uma vez só
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

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

  // Vertices do quadrado do personagem (2 triângulos)
  const vertices = new Float32Array([
    -25, -25, 25, -25, -25, 25, -25, 25, 25, -25, 25, 25,
  ]);

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

  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.useProgram(program);

  return gl;
}

function atualizaLogica(quantoPassou) {
  const distancia = playerSpeed * quantoPassou;

  // pode andar com wasd ou com as setinhas
  // if (keysPressed["ArrowUp"] || keysPressed["w"]) player.y -= distancia;
  // if (keysPressed["ArrowDown"] || keysPressed["s"]) player.y += distancia;

  // pulo
  if ((keysPressed[" "] || keysPressed["ArrowUp"] || keysPressed["w"]) && player.noChao) {
    player.velocityY = JUMP_FORCE;
    player.noChao = false;
  }
  
  // anda pra frente e pra tras
  if (keysPressed["ArrowLeft"] || keysPressed["a"]) player.x -= distancia;
  if (keysPressed["ArrowRight"] || keysPressed["d"]) player.x += distancia;

  // gravidade e variavel Y
  if (!player.noChao) {
    player.velocityY += GRAVITY * quantoPassou; // Aumenta a velocidade de queda
    player.y += player.velocityY * quantoPassou; // Atualiza a posição Y
  }

  // personagem volta pro chão
  if (player.y >= FLOOR_Y) {
    player.y = FLOOR_Y;
    player.velocityY = 0;
    player.noChao = true;
  }


  // não deixa o personagem sair da tela que defini
  player.x = Math.max(25, Math.min(canvas.width - 25, player.x));

  // player.x = Math.max(25, Math.min(canvas.width - 25, player.x));
  // player.y = Math.max(25, Math.min(canvas.height - 25, player.y));
}

function desenhaCena(gl) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
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
