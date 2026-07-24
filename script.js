/* ---------------------------------------------------
   storyworlds.ink — under construction
   Background: drifting "story world" constellation
   Form: local-only notify capture (no backend wired up)
--------------------------------------------------- */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------
     Constellation background
  ----------------------------- */

  var canvas = document.getElementById("constellation");

  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var nodes = [];
    var NODE_COUNT = 46;
    var LINK_DISTANCE = 130;
    var width, height, dpr;
    var rafId;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // update positions
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // draw links between nearby nodes
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DISTANCE) {
            var alpha = (1 - dist / LINK_DISTANCE) * 0.35;
            ctx.strokeStyle = "rgba(184, 145, 47, " + alpha + ")";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }

      // draw nodes
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        ctx.beginPath();
        ctx.fillStyle = "rgba(241, 232, 211, 0.75)";
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    step();

    var resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        cancelAnimationFrame(rafId);
        resize();
        makeNodes();
        step();
      }, 150);
    });
  } else if (canvas) {
    // reduced motion: hide canvas entirely (handled in CSS too)
    canvas.remove();
  }

  /* -----------------------------
     Notify form
     NOTE: there is no backend behind this yet.
     Submissions are only kept in this browser's
     localStorage so the page has something honest
     to show. Wire this up to a real mailing list
     (e.g. Buttondown, Mailchimp, a serverless
     function) before relying on it.
  ----------------------------- */

  var form = document.getElementById("notify-form");
  var status = document.getElementById("notify-status");

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var input = document.getElementById("email");
      var value = input.value.trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!isValid) {
        status.textContent = "That doesn't look like a full email address yet.";
        status.classList.remove("is-success");
        input.focus();
        return;
      }

      try {
        var saved = JSON.parse(localStorage.getItem("storyworlds_notify_list") || "[]");
        if (saved.indexOf(value) === -1) {
          saved.push(value);
          localStorage.setItem("storyworlds_notify_list", JSON.stringify(saved));
        }
      } catch (err) {
        // localStorage unavailable (private mode, etc.) — fail quietly,
        // the confirmation message below still reflects intent, not delivery.
      }

      status.textContent = "Saved on this device — we'll write soon.";
      status.classList.add("is-success");
      form.reset();
    });
  }
})();
