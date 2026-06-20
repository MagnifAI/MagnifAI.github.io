/* ============================================================
   main.js — interactions for the portfolio
   vanilla JS, no dependencies
   ============================================================ */
(function () {
  "use strict";

  /* ---- year ---- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav scrolled state ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { navLinks.classList.remove("open"); });
    });
  }

  /* ---- hero typing effect ---- */
  var phrases = [
    "I ship production AI agents.",
    "I build RAG pipelines that hold.",
    "I wire MCP fleets into Claude Code.",
    "I orchestrate agents, not just prompt them.",
    "One engineer, team throughput."
  ];
  var heroType = document.getElementById("heroType");
  if (heroType && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var pi = 0, ci = 0, deleting = false;
    var cur = '<span class="cur">▊</span>';
    function tick() {
      var full = phrases[pi];
      ci += deleting ? -1 : 1;
      if (ci < 0) ci = 0;
      if (ci > full.length) ci = full.length;
      requestAnimationFrame(function () { heroType.innerHTML = "$ " + full.slice(0, ci) + cur; });
      var delay = deleting ? 38 : 70;
      if (!deleting && ci === full.length) { delay = 1900; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 320; }
      setTimeout(tick, delay);
    }
    tick();
  } else if (heroType) {
    heroType.innerHTML = "$ " + phrases[0] + '<span class="cur">▊</span>';
  }

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- animated stat counters ---- */
  function animateStat(el) {
    var to = parseInt(el.getAttribute("data-to"), 10) || 0;
    var suf = el.querySelector(".suf");
    var sufHTML = suf ? suf.outerHTML : "";
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.round(eased * to) + sufHTML;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statsWrap = document.getElementById("stats");
  if (statsWrap && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          statsWrap.querySelectorAll(".val").forEach(animateStat);
          so.disconnect();
        }
      });
    }, { threshold: 0.4 });
    so.observe(statsWrap);
  } else if (statsWrap) {
    statsWrap.querySelectorAll(".val").forEach(animateStat);
  }

  /* ---- active nav link on scroll ---- */
  var sections = ["whoami", "systems", "infra", "ai", "capabilities", "career", "contact"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  var linkMap = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var h = a.getAttribute("href");
    if (h && h.charAt(0) === "#") linkMap[h.slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var ao = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove("active"); });
          if (linkMap[e.target.id]) linkMap[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { ao.observe(s); });
  }
})();
