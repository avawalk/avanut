const canvas = document.getElementById('effect');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animationId = null;

// ----- SNOW -----

const snowflakes = [];

function createSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 1,
            speed: Math.random() * 2 + 1
        });
    }
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateSnowflakes() {
    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        if (flake.y > canvas.height) {
            flake.y = -flake.radius;
            flake.x = Math.random() * canvas.width;
        }
    });
}

function animateSnowflakes() {
    drawSnowflakes();
    updateSnowflakes();
    animationId = requestAnimationFrame(animateSnowflakes);
}

function resizeSnowflakes() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    snowflakes.length = 0;
    createSnowflakes();
}

function startSnowflakes() {
  createSnowflakes();
  animateSnowflakes();
  window.addEventListener('resize', resizeSnowflakes);
}

function stopSnowflakes() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snowflakes.length = 0;
  window.removeEventListener('resize', resizeSnowflakes);
}

// ----- FIGHT -----

const particles = [];
const maxParticles = 300;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedY = Math.random() * -2 - 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.color = `rgba(${Math.random() * 255}, ${Math.random() * 50}, 0, ${Math.random() * 0.5 + 0.5})`;
        this.life = Math.random() * 100 + 50;
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
        this.opacity -= 0.01;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();
    }
}

function createParticle() {
    const x = canvas.width / 2 + (Math.random() - 0.5) * 100;
    const y = canvas.height - 50;
    particles.push(new Particle(x, y));
}

function animateFire() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < maxParticles) {
        createParticle();
    }

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.life <= 0 || particle.opacity <= 0) {
            particles.splice(index, 1);
        }
    });

    // Draw smoke
    for (let i = 0; i < particles.length / 3; i++) {
        const smokeParticle = particles[i];
        ctx.beginPath();
        ctx.arc(smokeParticle.x, smokeParticle.y - 50, smokeParticle.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 100, 100, ${smokeParticle.opacity})`;
        ctx.globalAlpha = smokeParticle.opacity * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();
    }

    animationId = requestAnimationFrame(animateFire);
}

function resizeFire() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function startFire() {
  animateFire();
  window.addEventListener('resize', resizeFire);
}

function stopFire() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.length = 0;
  window.removeEventListener('resize', resizeFire);
}

// ----- EDM -----

const spotlights = [
    document.getElementById('spotlight1'),
    document.getElementById('spotlight2'),
    document.getElementById('spotlight3')
];

function randomPosition(element) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
}

function randomColor(element) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    element.style.background = `radial-gradient(circle, ${color} 0%, rgba(0, 0, 0, 0) 80%)`;
}

function moveSpotlights() {
    spotlights.forEach(spotlight => {
        randomPosition(spotlight);
        randomColor(spotlight);
    });
}

// Resize handling
function resizeEDM() {
    spotlights.forEach(spotlight => {
        randomPosition(spotlight);
    });
}

function startEDM() {
  // Change spotlight position and color every 300ms
  animationId = setInterval(moveSpotlights, 300);

  // Initialize spotlights
  spotlights.forEach(spotlight => {
    spotlight.classList.remove('paused');
    spotlight.style.position = 'absolute';
    randomPosition(spotlight);
    randomColor(spotlight);
  });
  window.addEventListener('resize', resizeEDM);
}

function stopEDM() {
  clearInterval(animationId);
  spotlights.forEach(spotlight => {
    spotlight.classList.add('paused');
    spotlight.style.top = `${canvas.height + 100}px`;
  });
  window.removeEventListener('resize', resizeFire);
}
