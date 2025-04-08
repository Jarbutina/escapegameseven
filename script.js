
function initDragAndDrop() {
  let draggedItem = null;

  const items = document.querySelectorAll('.item');
  const dropzones = document.querySelectorAll('.dropzone');

  items.forEach(item => {
    item.addEventListener('dragstart', e => {
      draggedItem = item;
      e.dataTransfer.setData("text/plain", item.id);
    });
  });

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedItem) {
        const existingItem = zone.querySelector('.item');
        if (existingItem) document.getElementById('items').appendChild(existingItem);
        zone.appendChild(draggedItem);
        draggedItem = null;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("items");
  const items = Array.from(container.children);
  items.sort(() => Math.random() - 0.5);
  items.forEach(item => container.appendChild(item));

  initDragAndDrop();
});

function checkAnswers() {
  let score = 0;
  const dropzones = document.querySelectorAll('.dropzone');
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
  document.getElementById("descriptions-container").style.display = "block";
}

function showCorrectAnswers() {
  const dropzones = document.querySelectorAll('.dropzone');
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

function resetGame() {
  location.reload();
}



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


// === MODE TACTILE POUR MOBILE ===
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function initTouchMode() {
  let selectedItem = null;
  const items = document.querySelectorAll('.item');
  const dropzones = document.querySelectorAll('.dropzone');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('selected'));
      selectedItem = item;
      item.classList.add('selected');
    });
  });

  dropzones.forEach(zone => {
    zone.addEventListener('click', () => {
      if (selectedItem) {
        const existingItem = zone.querySelector('.item');
        if (existingItem) {
          document.getElementById('items').appendChild(existingItem);
        }
        zone.appendChild(selectedItem);
        selectedItem.classList.remove('selected');
        selectedItem = null;
      }
    });
  });
}

// Appliquer le bon mode à la fin du DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("items");
  const items = Array.from(container.children);
  items.sort(() => Math.random() - 0.5);
  items.forEach(item => container.appendChild(item));

  if (isMobileDevice()) {
    initTouchMode();
  } else {
    initDragAndDrop();
  }
});
