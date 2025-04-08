let items = Array.from(document.querySelectorAll('.item'));
let draggedItem = null;

shuffleArray(items);
items.forEach(item => {
  item.addEventListener('dragstart', e => {
    draggedItem = item;
    e.dataTransfer.setData("text/plain", item.id);
  });
});

const dropzones = document.querySelectorAll('.dropzone');

dropzones.forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedItem) {
      const existingItem = zone.querySelector('.item');
      if (existingItem) {
        document.getElementById('items').appendChild(existingItem);
      }
      zone.appendChild(draggedItem);
      draggedItem = null;
    }
  });
});

function checkAnswers() {
  let score = 0;
  dropzones.forEach(zone => {
    const correct = zone.dataset.answer;
    const placed = zone.querySelector('.item');
    if (placed && placed.id === correct) {
      score++;
    }
  });

  const result = document.getElementById("result");
  if (score === 5) {
    result.textContent = "🎉 Vous avez gagné 5 points, félicitations !";
    launchConfetti();
  } else {
    result.textContent = `Tu as ${score}/5 bonnes réponses. Réessaie !`;
  }
}


function resetGame() {
  const itemContainer = document.getElementById('items');
  const allItems = document.querySelectorAll('.item');

  allItems.forEach(item => {
    itemContainer.appendChild(item);
  });

  document.getElementById("result").textContent = "";
}


function showCorrectAnswers() {
  dropzones.forEach(zone => {
    const correct = zone.dataset.answer;
    let answerElem = zone.querySelector('.correct-answer');

    if (!answerElem) {
      answerElem = document.createElement('div');
      answerElem.className = 'correct-answer';
      answerElem.style.marginTop = '5px';
      answerElem.style.fontSize = '12px';
      answerElem.style.color = '#555';
      zone.appendChild(answerElem);
    }

    answerElem.textContent = "✔ Réponse : " + correct;
  });
}

// Modifier checkAnswers pour appeler showCorrectAnswers
function checkAnswers() {
  let score = 0;
  dropzones.forEach(zone => {
    const correct = zone.dataset.answer;
    const placed = zone.querySelector('.item');
    if (placed && placed.id === correct) {
      score++;
    }
  });

  const result = document.getElementById("result");
  if (score === 5) {
    result.textContent = "🎉 Vous avez gagné 5 points, félicitations !";
    launchConfetti();
  } else {
    result.textContent = `Tu as ${score}/5 bonnes réponses. Réessaie !`;
  }

  showCorrectAnswers();
}


// Modification de resetGame pour supprimer aussi les réponses
function resetGame() {
  const itemContainer = document.getElementById('items');
  const allItems = document.querySelectorAll('.item');

  allItems.forEach(item => {
    itemContainer.appendChild(item);
  });

  document.getElementById("result").textContent = "";

  // Supprimer les éléments de réponses
  const answerElems = document.querySelectorAll('.correct-answer');
  answerElems.forEach(elem => elem.remove());
}

// Confettis simples avec canvas
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 100,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    tilt: Math.random() * 10 - 10
  }));

  let angle = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.01;
    confettis.forEach(c => {
      c.y += Math.cos(c.d) + 2 + c.r / 2;
      c.x += Math.sin(angle);
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.ellipse(c.x, c.y, c.r, c.r * 0.6, c.tilt, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const interval = setInterval(draw, 20);
  setTimeout(() => {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const descContainer = document.getElementById("descriptions-container");
  if (descContainer) descContainer.style.display = "none";
});

function showCorrectAnswers() {
  dropzones.forEach(zone => {
    const correct = zone.dataset.answer;
    let answerElem = zone.querySelector('.correct-answer');

    if (!answerElem) {
      answerElem = document.createElement('div');
      answerElem.className = 'correct-answer';
      answerElem.style.marginTop = '5px';
      answerElem.style.fontSize = '12px';
      answerElem.style.color = '#555';
      zone.appendChild(answerElem);
    }

    answerElem.textContent = "✔ Réponse : " + correct;
  });

  const descContainer = document.getElementById("descriptions-container");
  if (descContainer) descContainer.style.display = "block";
}


// Mélangeur de tableaux
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
