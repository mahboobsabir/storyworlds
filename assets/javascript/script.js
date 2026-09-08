// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Mobile dropdown toggle (tap to expand submenu)
document.querySelectorAll('.nav-dropdown > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 860) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

// Close mobile menu when a normal link is clicked
document.querySelectorAll('.nav-links > a:not(.nav-dropdown a)').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Carousel
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function scrollAmount() {
  const card = track.querySelector('.book-card');
  return card ? card.offsetWidth + 22 : 200;
}

nextBtn.addEventListener('click', () => {
  track.scrollBy({ left: scrollAmount() * 2, behavior: 'smooth' });
});
prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -scrollAmount() * 2, behavior: 'smooth' });
});

// Subscribe form
const subscribeForm = document.getElementById('subscribeForm');
const toast = document.getElementById('toast');

subscribeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toast.classList.add('show');
  subscribeForm.reset();
  setTimeout(() => toast.classList.remove('show'), 3000);
});

// Back to top
document.getElementById('backToTop').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Navbar shrink on scroll
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 40) {
    navbar.style.boxShadow = '0 6px 24px rgba(0,0,0,0.25)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  lastScroll = current;
});
