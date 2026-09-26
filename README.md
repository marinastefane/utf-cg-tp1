# 🗡️ The Odyssey

Um jogo de ação 2D feito em **WebGL**, onde uma jovem guerreira precisa sobreviver a ondas de cogumelos hostis lançadores de bolas de fogo em uma floresta, usando espada, ataques manuais e um poder especial que carrega com o tempo.


## (a) O Jogo

**The Odyssey** é um jogo de ação/sobrevivência 2D em que o jogador controla uma personagem armada com espada em um cenário de floresta com plataformas. Inimigos (cogumelos) surgem aleatoriamente nas bordas da tela, decidem por onde andar no cenário e atacam a personagem à distância (quanto maior a distância, maior a velocidade do ataque). O jogador pode se defender com ataque corpo a corpo automático (quando se aproxima do inimigo), "dedadas" com o clique do mouse, e um poder especial que adiciona um pouquinho mais de força a sua espada, carregado ao longo do tempo. O objetivo é sobreviver o máximo possível (5 *looongos* minutos) e derrotar o maior número de inimigos, acumulando pontuação, antes que o HP da personagem chegue a zero.

O projeto foi desenvolvido inteiramente com **WebGL**, incluindo shaders customizados, sprite sheets animados, sistema de câmera/canvas responsivo e uma HUD sobreposta em HTML/CSS.


## (b) Criador(es)

### **Marina Stefane Candido Delfino**  
marinadelfino03@gmail.com  
[github.com/marinastefane](https://github.com/marinastefane) - [linkedin.com/in/marinastefane](https://www.linkedin.com/in/marinastefane)

### **Sophia Ferreira Corrêa da Silva**  
sophiasilva@gmail.com  
[github.com/sophiasilva](link) - [linkedin.com/in/sophiasilva](link)


## (c) Media Kit

<img width="237" height="181" alt="image" src="https://github.com/user-attachments/assets/33654cb2-2ac1-41ff-8091-f01dae10974f" />  
<img width="260" height="229" alt="image" src="https://github.com/user-attachments/assets/6884220e-72e7-45f3-84b8-281fafdd6008" />  
<img width="451" height="282" alt="image" src="https://github.com/user-attachments/assets/6c62edf9-a46f-49c7-b7c9-bf1449100844" />

## (d) Opcionais

Itens opcionais implementados neste projeto, conforme lista do enunciado:

### Relativas à apresentação do jogo e gráficos

- ⭐ **Texturas animadas**: *"você pode criar animações de personagens ou cenário. Por exemplo, para inimigo andando, atacando... uma explosão, para os projéteis etc"*.  
**Implementado:** A personagem principal (idle, andando, correndo, pulando, ataque, morte), para os inimigos (idle, correndo, ataque, dano, morte) e para o efeito de impacto do ataque inimigo (sprite sheet em grade).

- ⭐ **Telas**: *"faça um jogo completo, ou seja, implemente telas de splash screen, menu inicial, créditos, opções, game over, etc"*.  
**Implementado:** Splash screen, menu inicial, tela de opções (com controle de volume), tela de créditos, tela de game over com pontuação final e botões de reiniciar/voltar ao menu.

- 🌟 **Sons**: *"Colocar efeitos sonoros e música de fundo no seu jogo"*  
**Implementado:** Música de fundo no menu, efeito sonoro de ataque com espada, efeito sonoro de ataque do inimigo, e efeito sonoro de game over.

- **Tela cheia**: *"faça com que seja possível colocar em tela cheia... mas que o jogo ocupe a maior área possível da janela e ficando centralizado"*  
**Implementado:** Suporte a alternância de tela cheia via botão dedicado.

### Relativas aos recursos do jogador

- 🍔 **Herói**: *"além da(s) torre(s), o jogador poderá controlar (mouse? teclado?) um pequeno personagem que anda pelo cenário e ataca os inimigos próximos de forma automática (como se fosse uma torre móvel)"*  
**Implementado:** Conceito central do jogo: a personagem é controlada via teclado (movimento e pulo), ataca automaticamente por corpo a corpo quando um inimigo está próximo, e possui um poder especial ativável (tecla E) que dobra o dano causado, recarregando com o tempo de sobrevivência.

## (e) Checklist dos obrigatórios

- [x] **Torre que atira** - reinterpretado como a personagem/herói, que ataca automaticamente por corpo a corpo quando um inimigo está próximo.
- [x] **Condição de derrota com mensagem de game over** - tela de Game Over dedicada, sem uso de `alert()`
- [x] **Inimigos surgindo, andando, atacando torre e sendo derrotados** - inimigos nascem aleatoriamente nas bordas, decidem o movimento próprio, atacam a personagem à distância e são derrotados por espada ou clique.
- [x] **Clique "dedada" nos inimigos** - clique do mouse sobre um inimigo causa dano e pode derrotá-lo.
- [x] **HUD com vida da torre e pontuação** - barra de HP, barra de energia/poder e tempo de jogo, todos atualizados em tempo real.
- [x] **Loop de reinício do jogo** - botão de reiniciar na tela de Game Over, que reseta todo o estado do jogo.
- [x] **Uso de texturas** - todos os elementos visuais (personagem, inimigos, cenário, plataformas, efeitos) usam texturas carregadas via WebGL.


## (f) Créditos

Todos os recursos visuais e sonoros de terceiros usados neste projeto:

| Recurso | Autor | Link |
|---|---|---|
| 🧝 Personagem (Red Cape Knight) | jumpbutton | [itch.io/red-cape-knight](https://jumpbutton.itch.io/red-cape-knight) |
| 🍄 Inimigos (Forest Monsters) | monopixelart | [itch.io/forest-monsters-pixel-art](https://monopixelart.itch.io/forest-monsters-pixel-art) |
| 🌳 Cenário (Parallax Background) | The Pixel Nook | [itch.io/parallax-backgrounds-demo](https://the-pixel-nook.itch.io/parallax-backgrounds-demo) |
| 🌸 Cenário (Tiny Pixel Japan) | Lynia Design | [itch.io/tiny-pixel-japan-parallax-background](https://lyniadesign.itch.io/tiny-pixel-japan-parallax-background) |
| 🔊 Som de espada | ci.itch.io | [400 Sounds Pack](https://ci.itch.io/400-sounds-pack) |
| 💥 Efeito de ataque inimigo | bdragon1727 | [Retro Impact Effect Pack 5](https://bdragon1727.itch.io/retro-impact-effect-pack-5) |

> Todos os recursos foram utilizados conforme as licenças disponibilizadas por seus respectivos autores nas páginas do itch.io.

---

<p align="center">Feito com 💜 (sangue, suor e lágrimas) e muito WebGL.</p>
