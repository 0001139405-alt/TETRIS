let gameOver = false;
let gameLoopTimeout= '';
let score = 0; // variavel para guardar a pontuação

const CORES = [ // vetores que definem as cores dos blocos (usado no vetor de bloco)
  null, // 0 - espaco vazio
  "blue", // Azul
  "blue", // Azul2
  "green", // Verde
  "green", // Verde2
  "yellow", // Amarelo
  "yellow", // Amarelo2
  "red", // Vermelho
  "red", // Vermelho2
];

const Chroblocks = [ // cria vetores/matrizes com blocos definidos
  [],
  [ // Azul
    [1,0,0],
    [1,0,0],
    [1,1,0]
  ],
  [ // Azul2
    [0,2,0],
    [2,2,0],
    [0,2,0]
  ],
  [ // Verde
    [3,0,0],
    [3,0,0],
    [3,3,0]
  ],
  [ // Verde2
    [4,4,0],
    [0,4,0],
    [0,4,0]
  ],
  [ // Amarelo
    [5,5,0],
    [5,5,0],
    [0,0,0]
  ],
  [ // Amarelo2
    [6,6,0],
    [0,6,0],
    [0,6,0]
  ],
   [ // Vermelho
    [7,7,0],
    [0,7,0],
    [0,7,0]
  ],
   [ // Vermelho2
    [8,0,0],
    [8,8,0],
    [8,8,0]
  ],
];

const LIN = 20; // linhas da area do jogo
const COL = 10; // colunas da area do jogo
let jogo = Array.from({ length: LIN }, function() { // cria um vetor com a quantidade de linhas definidas
  return Array(COL).fill(0); // cria um vetor para as colunas e preenche com 0
  }
);
 
 
 
let BlocoSave = ''; // variavel vazia para armazenar o bloco
let posX = 0, posY = 0; // cria variavel onde vai definir em que posicao o bloco ira spawnar



function drawTela(){
  const canvas = document.getElementById('CanvasJogo'); // defne uma constante para o canvas referenciado no id
  const chro = canvas.getContext('2d'); // coloca o contexto de 2d para desenhar no canvas
  chro.clearRect(0, 0, canvas.width, canvas.height); // limpa a area do canvas

  for (let y = 0; y < LIN; y++){ // percorre as linhas do canvas
    for (let x = 0; x < COL; x++){ // percorre as colunas
      if (jogo[y][x]){ //verifica se o espaco x e y esta preenchido e desenha um bloco da cor
        chro.fillStyle = CORES[jogo[y][x]];
        chro.fillRect(x * 20, y * 20, 20, 20);
      }
    }
  }
  if (BlocoSave){
    for (let i = 0; i < BlocoSave.length; i++){ // percorre as linhas de blocos ativos
      for (let j = 0; j < BlocoSave[i].length; j++){ // percorre as colunas com blocos
        if (BlocoSave[i][j]) { // verifica se o bloco ativo (em movimento) nao passou em alguma area q ja tenha um bloco e a desenha
          chro.fillStyle = CORES[BlocoSave[i][j]];
          chro.fillRect((posX + j) * 20, (posY + i) * 20, 20, 20);
        }
      }
    }
  }
}




function canMove(offsetX, offsetY, block) {
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      if (block[i][j]) {
        let x = posX + j + offsetX;
        let y = posY + i + offsetY;
        if (x < 0 || x >= COL || y >= LIN || (y >= 0 && jogo[y][x])) {
          return false;
        }
      }
    }
  }
  return true;
}


function fixBlock(){
  for (let i = 0; i < BlocoSave.length; i++) {
    for (let j = 0; j < BlocoSave[i].length; j++) {
      if (BlocoSave[i][j]) {
        let x = posX + j;
        let y = posY + i;

        if (y < 0) {
          gameOver = true;
          break;
        }

        jogo[y][x] = BlocoSave[i][j];
      }
    }
    if (gameOver) break;
  }

  if (gameOver) {
    BlocoSave = null;
    drawTela();
    alert("Game Over!");
    clearTimeout(gameLoopTimeout);
    return;
  }

  clearFullLines();
  spawnBloco();
}


function gameLoop() {
  clearTimeout(gameLoopTimeout); // Limpa timeout anterior

  if (gameOver) return; // Para o jogo imediatamente

  if (canMove(0, 1, BlocoSave)) {
    posY++;
  } else {
    fixBlock();
    if (gameOver) return; // Se acabou dentro de fixBlock, pare aqui também!
  }

  drawTela();
  drawScore(); 
  gameLoopTimeout = setTimeout(gameLoop, 500); // Salva o timeout
}


function rotateBlock() {
  const newBlock = [];
  const size = BlocoSave.length;

  // Criando a matriz transposta
  for (let i = 0; i < size; i++) {
    newBlock[i] = [];
    for (let j = 0; j < size; j++) {
      newBlock[i][j] = BlocoSave[size - j - 1][i]; // Rotaciona a matriz 90 graus
    }
  }

  // Verifica se o bloco rotacionado pode se mover para a posição atual
  if (canMove(0, 0, newBlock)) {
    BlocoSave = newBlock; // Se puder, aplica a rotação
  }
}




document.addEventListener('keydown', function(e) {
  if (e.key === 'a' && canMove(-1, 0, BlocoSave)) posX--;
  else if (e.key === 'd' && canMove(1, 0, BlocoSave)) posX++;
  else if (e.key === 's' && canMove(0, 1, BlocoSave)) posY++;
  else if (e.key === 'w') rotateBlock();
  drawTela();
});




// PROXIMO BLOCO
let nextBlock = null;

function spawnBloco() {
  // Se já tem um próximo bloco sorteado, usa ele. Senão, sorteia.
  if (nextBlock === null) {
    let idx = Math.floor(Math.random() * (Chroblocks.length - 1)) + 1;
    nextBlock = JSON.parse(JSON.stringify(Chroblocks[idx]));
  }
  BlocoSave = nextBlock;
  posX = 3; 
  posY = 0;
  // Sorteia o novo próximo bloco 
  let idx = Math.floor(Math.random() * (Chroblocks.length - 1)) + 1;
  nextBlock = JSON.parse(JSON.stringify(Chroblocks[idx]));
  drawNext();
}

function drawNext() {
  const canvas = document.querySelector('.coluna3 canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!nextBlock) return;
  // Centraliza o bloco no canvas .coluna3 (tem 150x150)
  let offsetX = 2;
  let offsetY = 2;
  for (let i = 0; i < nextBlock.length; i++) {
    for (let j = 0; j < nextBlock[i].length; j++) {
      if (nextBlock[i][j]) {
        ctx.fillStyle = CORES[nextBlock[i][j]];
        ctx.fillRect((offsetX + j) * 20, (offsetY + i) * 20, 20, 20);
      }
    }
  }
}

spawnBloco();
drawNext();
gameLoop();

document.getElementById('restart').onclick = function() {
  clearTimeout(gameLoopTimeout);
  jogo = Array.from({ length: LIN }, () => Array(COL).fill(0));
  gameOver = false;
  spawnBloco();
  drawTela();
  gameLoop();
};

// SISTEMA DE PONTUACAO

// Função para verificar e limpar as linhas completas
function clearFullLines() {
  for (let y = LIN - 1; y >= 0; y--) {
    // Se a linha estiver completa (não tiver 0)
    if (jogo[y].every(cell => cell !== 0)) {
      // Aumenta a pontuação (100 pontos por linha completa)
      score += 100;

      // Remove a linha completa, movendo as linhas acima para baixo
      jogo.splice(y, 1);
      jogo.unshift(Array(COL).fill(0)); // Adiciona uma linha vazia no topo

      // Verifica novamente essa linha, pois ela pode ter ficado incompleta após o movimento
      y++; 
    }
  }
}

function drawScore() {
  const scoreCanvas = document.getElementById('CanvasPontos'); // Seleciona o canvas da pontuação
  const ctx = scoreCanvas.getContext('2d'); // Cria o contexto para desenhar no canvas de pontuação

  ctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height); // Limpa o canvas de pontuação
  ctx.fillStyle = "white"; // Cor da fonte
  ctx.font = "20px Arial"; // Estilo da fonte
  ctx.fillText(score, 10, 30); // Exibe a pontuação
}
