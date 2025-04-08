
function initDragAndDrop() {
  let draggedItem = null;

  const items = document.querySelectorAll('.item');
  const dropzones = document.querySelectorAll('.dropzone');
  const startZone = document.getElementById('items');

  // Drag and drop classique
  items.forEach(item => {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', e => {
      draggedItem = item;
      e.dataTransfer.setData("text/plain", item.id);
    });

    // Gestion tactile
    item.addEventListener('touchstart', e => {
      draggedItem = item;
    });
  });

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());

    zone.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedItem) {
        const existingItem = zone.querySelector('.item');
        if (existingItem) startZone.appendChild(existingItem);
        zone.appendChild(draggedItem);
        draggedItem = null;
      }
    });

    // Support tactile
    zone.addEventListener('touchend', e => {
      if (draggedItem) {
        const existingItem = zone.querySelector('.item');
        if (existingItem) startZone.appendChild(existingItem);
        zone.appendChild(draggedItem);
        draggedItem = null;
      }
    });
  });

  // Zone de départ (replacer les plats)
  startZone.addEventListener('dragover', e => e.preventDefault());
  startZone.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedItem) {
      startZone.appendChild(draggedItem);
      draggedItem = null;
    }
  });

  startZone.addEventListener('touchend', e => {
    if (draggedItem) {
      startZone.appendChild(draggedItem);
      draggedItem = null;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("items");
  const items = Array.from(container.children);
  items.sort(() => Math.random() - 0.5);
  items.forEach(item => container.appendChild(item));
  initDragAndDrop();
});
