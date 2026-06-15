document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Hero slider: cycles slides, restarts text animation, supports arrows/dots
  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.hero-slide');
    var dots = slider.querySelectorAll('.hero-dots button');
    var prevBtn = slider.querySelector('.hero-arrow--prev');
    var nextBtn = slider.querySelector('.hero-arrow--next');
    var current = 0;
    var timer = null;
    var typeTimer = null;

    // Type out a slide's heading one character at a time
    function typeTitle(slide) {
      var h1 = slide.querySelector('h1');
      if (!h1) return;
      if (!h1.dataset.fullText) h1.dataset.fullText = h1.textContent;
      var text = h1.dataset.fullText;

      clearTimeout(typeTimer);
      h1.textContent = '';
      var cursor = document.createElement('span');
      cursor.className = 'typed-cursor';
      cursor.textContent = '|';
      h1.appendChild(cursor);

      var i = 0;
      function step() {
        h1.textContent = text.slice(0, i);
        h1.appendChild(cursor);
        if (i < text.length) {
          i++;
          typeTimer = setTimeout(step, 35);
        } else {
          setTimeout(function () { cursor.remove(); }, 1200);
        }
      }
      step();
    }

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      typeTitle(slides[current]);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      timer = setInterval(next, 6000);
    }
    function restartAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); restartAutoplay(); });
    });

    typeTitle(slides[current]);
    startAutoplay();
  }

  // Show a success/error banner after contact-handler.php redirects back
  var params = new URLSearchParams(window.location.search);
  var sentType = params.get('sent');
  var errorType = params.get('error');
  if (sentType || errorType) {
    var target = window.location.hash
      ? document.querySelector(window.location.hash)
      : null;
    var form = target ? target.querySelector('form') : document.querySelector('form');
    if (form) {
      var alertBox = document.createElement('div');
      if (sentType) {
        alertBox.className = 'form-alert form-alert--success';
        alertBox.textContent = 'Thank you! Your message has been sent — we\'ll get back to you shortly.';
      } else {
        alertBox.className = 'form-alert form-alert--error';
        alertBox.textContent = 'Sorry, something went wrong sending your message. Please call or email us directly.';
      }
      form.parentNode.insertBefore(alertBox, form);
    }

    // Clean the query string so refreshing the page doesn't re-show the banner
    var cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, '', cleanUrl);
  }
});
