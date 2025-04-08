
document.addEventListener("DOMContentLoaded", () => {
  const plats = [
    "Poutargue",
    "Aligot",
    "Kig ha farz",
    "Piperade",
    "Quenelle de brochet"
  ];
  const regions = {
    "Poutargue": "Provence",
    "Aligot": "Occitanie",
    "Kig ha farz": "Bretagne",
    "Piperade": "Pays Basque",
    "Quenelle de brochet": "Rhône-Alpes"
  };

  shuffleArray(plats);
  shuffleArray(Object.keys(regions));

  const itemsContainer = document.getElementById("items");
  const regionsContainer = document.getElementById("regions");

  plats.forEach(p => {
    const item = document.createElement("div");
    item.className = "item";
    item.textContent = p;
    item.setAttribute("draggable", "true");
    item.setAttribute("id", p);
    itemsContainer.appendChild(item);
  });

  Object.entries(regions).forEach(([plat, region]) => {
    const drop = document.createElement("div");
    drop.className = "dropzone";
    drop.dataset.answer = plat;

    const label = document.createElement("div");
    label.className = "region-title";
    label.textContent = region;

    drop.appendChild(label);
    regionsContainer.appendChild(drop);
  });

  initDrag();
});

function initDrag() {
  let items = document.querySelectorAll('.item');
  let dropzones = document.querySelectorAll('.dropzone');
  let draggedItem = null;

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
        const existing = zone.querySelector('.item');
        if (existing) document.getElementById('items').appendChild(existing);
        zone.appendChild(draggedItem);
        draggedItem = null;
      }
    });
  });
}

function checkAnswers() {
  let score = 0;
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(zone => {
    const correct = zone.dataset.answer;
    const placed = zone.querySelector('.item');
    if (placed && placed.id === correct) score++;
  });

  const result = document.getElementById("result");
  if (score === 5) {
    result.textContent = "🎉 Vous avez gagné 5 points, félicitations !";
    launchConfetti();
  } else {
    result.textContent = `Tu as ${score}/5 bonnes réponses. Réessaie !`;
  }

  showCorrectAnswers();
  const desc = document.getElementById("descriptions-container");
  if (desc) desc.style.display = "block";
}

function resetGame() {
  const allItems = document.querySelectorAll('.item');
  const itemContainer = document.getElementById("items");

  allItems.forEach(item => {
    itemContainer.appendChild(item);
  });

  const result = document.getElementById("result");
  result.textContent = "";

  document.querySelectorAll('.correct-answer').forEach(e => e.remove());
  const desc = document.getElementById("descriptions-container");
  if (desc) desc.style.display = "none";
}

function showCorrectAnswers() {
  document.querySelectorAll('.dropzone').forEach(zone => {
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Confetti animation

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
