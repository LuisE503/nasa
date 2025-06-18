document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show-menu');
    });
  }
  
  const path = window.location.pathname;
  if (path.endsWith('apod.html')) {
    loadAPOD();
  } else if (path.endsWith('mars.html')) {
    loadMarsPhotos();
  }
});

async function loadAPOD() {
  const container = document.getElementById('apod-container');
  try {
    const apiKey = "xZbQn3mN5ucY6ur324bACSo4wkqw1RbbQ0iJs4cG";
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = await res.json();
    container.innerHTML = `
      <h3>${data.title}</h3>
      <p><em>${data.date}</em></p>
      <img src="${data.url}" alt="${data.title}" loading="lazy">
      <p>${data.explanation}</p>
    `;
  } catch (error) {
    console.error('Error loading APOD:', error);
    container.innerHTML = '<p>Error loading data. Please try again later.</p>';
  }
}

function getRandomRover() {
  const rovers = ["curiosity", "opportunity", "spirit"];
  return rovers[Math.floor(Math.random() * rovers.length)];
}

function getRandomSol(rover) {
  if (rover === "curiosity") {
    return Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000;
  } else {
    return Math.floor(Math.random() * (500 - 100 + 1)) + 100;
  }
}

async function loadMarsPhotos() {
  const container = document.getElementById('mars-container');
  try {
    const apiKey = "xZbQn3mN5ucY6ur324bACSo4wkqw1RbbQ0iJs4cG";
    const rover = getRandomRover();
    const sol = getRandomSol(rover);
    const res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}`);
    const data = await res.json();
    let photos = data.photos;
    if (photos.length >= 12) {
      photos = photos.sort(() => Math.random() - 0.5).slice(0, 12);
    }
    const itemsHtml = photos.map(photo => {
      return `
      <div class="photo-item" data-id="${photo.id}">
        <img src="${photo.img_src}" alt="${photo.camera.full_name}" loading="lazy">
        <div class="photo-info">
          <p><strong>ID:</strong> ${photo.id}</p>
          <p><strong>Rover:</strong> ${photo.rover.name}</p>
          <p><strong>Sol:</strong> ${photo.sol}</p>
          <p><strong>Date:</strong> ${photo.earth_date}</p>
          <p><strong>Camera:</strong> ${photo.camera.full_name}</p>
          <p><strong>Landing:</strong> ${photo.rover.landing_date}</p>
          <p><strong>Launch:</strong> ${photo.rover.launch_date}</p>
          <p><strong>Status:</strong> ${photo.rover.status}</p>
        </div>
      </div>
      `;
    }).join('');
    container.innerHTML = itemsHtml;
    
    // Asignar acción al hacer clic en cada tarjeta para abrir el modal
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
      item.addEventListener('click', () => showModal(item));
    });
  } catch (error) {
    console.error('Error loading Mars photos:', error);
    container.innerHTML = '<p>Error loading Mars photos. Please try again later.</p>';
  }
}

function showModal(item) {
  const img = item.querySelector("img");
  const imgSrc = img.src;
  const details = item.querySelector('.photo-info').innerHTML;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <img src="${imgSrc}" alt="Mars photo" class="modal-image">
      <div class="modal-details">${details}</div>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.querySelector('.close-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

export { loadAPOD, loadMarsPhotos };
