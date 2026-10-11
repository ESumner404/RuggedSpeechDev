// The "Have a go" board. It uses the app's own starter words, folders and
// drawn symbols (board-data.js, made by scripts/generate-website-board.mjs),
// and behaves the way the app does: buttons stay in the same place, folders
// open a page with Back and Home in the same corner, and nothing is said
// unless something is pressed. Nothing is saved, and nothing leaves this page.
(function () {
  'use strict';

  var DATA = window.RS_BOARD;
  var gridEl = document.getElementById('grid');
  if (!DATA || !gridEl) return;

  var $ = function (id) { return document.getElementById(id); };
  var stripEl = $('strip');
  var titleEl = $('page-title');
  var noteEl = $('try-note');
  var synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  var MAX_WORDS = 10;

  var state = {
    page: DATA.root,
    trail: [],
    sentence: [],
    press: 'both', // both | say | add
    read: 'lit', // all | gaps | lit
    pics: 'drawn', // drawn | emoji
    rate: 0.95,
    voice: '',
    lit: -1,
    token: 0,
  };

  // ---------- speech ----------
  function voices() {
    if (!synth) return [];
    return (synth.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang); });
  }

  function chosenVoice() {
    var list = voices();
    if (state.voice) {
      for (var i = 0; i < list.length; i += 1) if (list[i].voiceURI === state.voice) return list[i];
    }
    var gb = list.filter(function (v) { return /^en[-_]GB/i.test(v.lang); });
    var pool = gb.length ? gb : list;
    for (var j = 0; j < pool.length; j += 1) if (pool[j].localService) return pool[j];
    return pool[0] || null;
  }

  function noVoice() {
    noteEl.textContent = 'Your browser has no voice, so the words show here but cannot be said out loud. In the app, Rugged Speech says them using the voices on your computer.';
  }

  function utter(text, rate, done) {
    var u = new SpeechSynthesisUtterance(text);
    var v = chosenVoice();
    u.lang = v ? v.lang : 'en-GB';
    if (v) u.voice = v;
    u.rate = rate;
    var finished = false;
    var finish = function () { if (finished) return; finished = true; if (done) done(); };
    u.onend = finish;
    u.onerror = finish;
    synth.speak(u);
  }

  function setLit(i) {
    state.lit = i;
    var chips = stripEl.querySelectorAll('.w');
    Array.prototype.forEach.call(chips, function (chip, n) { chip.classList.toggle('lit', n === i); });
  }

  function stopSpeaking() {
    state.token += 1;
    setLit(-1);
    if (synth) { try { synth.cancel(); } catch { /* nothing to stop */ } }
  }

  function sayNow(text) {
    if (!synth) { noVoice(); return; }
    stopSpeaking();
    try { utter(text, state.rate); } catch { noVoice(); }
  }

  function readSentence() {
    if (!state.sentence.length) return;
    if (!synth) { noVoice(); return; }
    stopSpeaking();
    var words = state.sentence.slice();
    var token = state.token;
    try {
      if (state.read === 'all') {
        utter(words.join(' '), state.rate);
      } else if (state.read === 'gaps') {
        utter(words.join(', '), state.rate * 0.9);
      } else {
        // One word at a time, lighting each word as it is said.
        var step = function (i) {
          if (token !== state.token) return;
          if (i >= words.length) { setLit(-1); return; }
          setLit(i);
          utter(words[i], state.rate, function () { step(i + 1); });
        };
        step(0);
      }
    } catch { noVoice(); }
  }

  // ---------- drawing ----------
  function pictureFor(item) {
    var holder = document.createElement('span');
    holder.className = 'pic';
    holder.setAttribute('aria-hidden', 'true');
    var uri = state.pics === 'drawn' && item.s ? DATA.symbols[item.s] : '';
    if (uri) {
      var img = document.createElement('img');
      img.className = 'sym';
      img.src = uri;
      img.alt = '';
      img.draggable = false;
      holder.appendChild(img);
    } else {
      holder.textContent = item.e || '';
      holder.className = 'pic pic--emoji';
    }
    return holder;
  }

  function renderStrip() {
    stripEl.textContent = '';
    if (!state.sentence.length) {
      var ph = document.createElement('span');
      ph.className = 'ph';
      ph.textContent = 'Press words to build a sentence';
      stripEl.appendChild(ph);
      return;
    }
    state.sentence.forEach(function (word, i) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'w' + (i === state.lit ? ' lit' : '');
      chip.textContent = word;
      chip.setAttribute('aria-label', 'Take out ' + word);
      chip.addEventListener('click', function () {
        stopSpeaking();
        state.sentence.splice(i, 1);
        renderStrip();
      });
      stripEl.appendChild(chip);
    });
  }

  function renderGrid() {
    var board = DATA.boards[state.page];
    var rows = board.g[0];
    var cols = board.g[1];
    titleEl.textContent = board.n;
    gridEl.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    gridEl.style.gridTemplateRows = 'repeat(' + rows + ', minmax(0, 1fr))';
    gridEl.setAttribute('aria-label', board.n + ' page');
    gridEl.textContent = '';
    board.o.forEach(function (row) {
      row.forEach(function (id) {
        if (!id || !board.i[id]) {
          var gap = document.createElement('div');
          gap.className = 'tile tile--empty';
          gap.setAttribute('aria-hidden', 'true');
          gridEl.appendChild(gap);
          return;
        }
        var item = board.i[id];
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tile' + (item.f ? ' tile--folder' : '');
        b.style.background = item.c;
        b.setAttribute('aria-label', item.f ? item.l + ', opens a page of words' : item.l);
        b.appendChild(pictureFor(item));
        var label = document.createElement('span');
        label.className = 'tile-label';
        label.textContent = item.l;
        b.appendChild(label);
        b.addEventListener('click', function () { pressItem(item, board); });
        gridEl.appendChild(b);
      });
    });
    $('nav-home').disabled = state.page === DATA.root;
    $('nav-back').disabled = state.trail.length === 0;
  }

  function render() {
    renderStrip();
    renderGrid();
  }

  // ---------- pressing ----------
  function say(text) { sayNow(text); }

  function pressItem(item, board) {
    if (item.f) { // a folder opens a page and says nothing
      stopSpeaking();
      state.trail.push(state.page);
      state.page = item.f;
      renderGrid();
      return;
    }
    if (board.h) { // Help speaks the phrase and stops
      say(item.l);
      return;
    }
    if (state.press !== 'add') say(item.l);
    if (state.press !== 'say') {
      if (state.sentence.length < MAX_WORDS) state.sentence.push(item.l);
      renderStrip();
    }
  }

  function goHome() {
    stopSpeaking();
    state.page = DATA.root;
    state.trail = [];
    renderGrid();
  }

  function goBack() {
    if (!state.trail.length) return;
    stopSpeaking();
    state.page = state.trail.pop();
    renderGrid();
  }

  $('q-home').addEventListener('click', goHome);
  $('nav-home').addEventListener('click', goHome);
  $('nav-back').addEventListener('click', goBack);
  $('q-help').addEventListener('click', function () {
    if (state.page === 'help') return;
    stopSpeaking();
    state.trail.push(state.page);
    state.page = 'help';
    renderGrid();
  });
  $('q-yes').addEventListener('click', function () { say('yes'); });
  $('q-no').addEventListener('click', function () { say('no'); });
  $('gmt').addEventListener('click', function () { say('I know what I want to say. Please give me a moment.'); });
  $('speak').addEventListener('click', readSentence);
  $('clear').addEventListener('click', function () {
    stopSpeaking();
    state.sentence = [];
    renderStrip();
  });

  // ---------- the settings an adult would choose in Parent Mode ----------
  $('opt-press').addEventListener('change', function (e) { state.press = e.target.value; });
  $('opt-read').addEventListener('change', function (e) { state.read = e.target.value; });
  $('opt-pics').addEventListener('change', function (e) { state.pics = e.target.value; render(); });
  $('opt-voice').addEventListener('change', function (e) { state.voice = e.target.value; });
  $('opt-rate').addEventListener('input', function (e) {
    state.rate = Number(e.target.value);
    $('opt-rate-out').textContent = state.rate.toFixed(2).replace(/0$/, '') + '×';
  });

  function fillVoices() {
    var select = $('opt-voice');
    var list = voices();
    var keep = state.voice;
    select.textContent = '';
    var auto = document.createElement('option');
    auto.value = '';
    auto.textContent = list.length ? 'Automatic (English)' : 'No voices found';
    select.appendChild(auto);
    list.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v.voiceURI;
      o.textContent = v.name + ' (' + v.lang + ')' + (v.localService ? '' : ', needs the internet');
      select.appendChild(o);
    });
    select.value = keep;
    select.disabled = !list.length;
    if (!synth) noVoice();
  }
  if (synth) {
    fillVoices();
    if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', fillVoices);
  } else {
    fillVoices();
  }

  render();
})();
