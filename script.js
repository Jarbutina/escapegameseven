
function initDragAndDrop() {
  let draggedItem = null;
  let touchMoved = false;

  const items = document.querySelectorAll('.item');
  const dropzones = document.querySelectorAll('.dropzone');
  const startZone = document.getElementById('items');

  function makeItemDraggable(item) {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', e => {
      draggedItem = item;
      e.dataTransfer.setData("text/plain", item.id);
    });

    item.addEventListener('touchstart', e => {
      draggedItem = item;
      touchMoved = false;
    });

    item.addEventListener('touchmove', e => {
      touchMoved = true;
    });

    item.addEventListener('touchend', e => {
      if (!touchMoved && item.parentElement !== startZone) {
        startZone.appendChild(item);
        draggedItem = null;
      }
    });

    item.addEventListener('click', () => {
      // Pour les clics souris classiques (PC)
      if (item.parentElement !== startZone) {
        startZone.appendChild(item);
      }
    });
  }

  items.forEach(item => makeItemDraggable(item));

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

    zone.addEventListener('touchend', e => {
      if (draggedItem) {
        const existingItem = zone.querySelector('.item');
        if (existingItem) startZone.appendChild(existingItem);
        e.currentTarget.appendChild(draggedItem);
        draggedItem = null;
      }
    });
  });

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
