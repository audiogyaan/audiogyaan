const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll(".book-card").forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(filter) ? "grid" : "none";
  });
});

function filterBooks(category) {
  document.querySelectorAll(".book-card").forEach(card => {
    const match = category === "All" || card.dataset.category === category;
    card.style.display = match ? "grid" : "none";
  });
}

// -----------------------
// CENTRAL PLAYER ELEMENTS
// -----------------------
const centralPlayer = document.getElementById("centralPlayer");
const playPauseBtn = document.getElementById("playPause");
const forwardBtn = document.getElementById("forward");
const backwardBtn = document.getElementById("backward");
const nowPlaying = document.getElementById("nowPlaying");
const centralSeekbar = document.getElementById("centralSeekbar");
const closePlayer = document.getElementById("closePlayer");

let currentAudio = null;
let seekInterval = null;

// -----------------------
// FUNCTION TO OPEN CENTRAL PLAYER
// -----------------------
function openCentralPlayer(audio, title) {
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = audio;
  centralPlayer.style.display = "flex";
  nowPlaying.textContent = `Now Playing: ${title}`;
  audio.play();
  playPauseBtn.textContent = "⏸";

  clearInterval(seekInterval);
  seekInterval = setInterval(() => {
    if (!isNaN(audio.duration)) {
      centralSeekbar.value = (audio.currentTime / audio.duration) * 100;
    }
  }, 500);
}

// -----------------------
// PLAY/PAUSE BUTTON
// -----------------------
playPauseBtn.addEventListener("click", () => {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    currentAudio.pause();
    playPauseBtn.textContent = "▶";
  }
});

// -----------------------
// FORWARD / BACKWARD BUTTONS
// -----------------------
forwardBtn.addEventListener("click", () => {
  if (currentAudio) currentAudio.currentTime += 10;
});

backwardBtn.addEventListener("click", () => {
  if (currentAudio) currentAudio.currentTime -= 10;
});

// -----------------------
// SEEKBAR DRAG
// -----------------------
centralSeekbar.addEventListener("input", () => {
  if (currentAudio && !isNaN(currentAudio.duration)) {
    currentAudio.currentTime = (centralSeekbar.value / 100) * currentAudio.duration;
  }
});

// -----------------------
// CLOSE PLAYER
// -----------------------
closePlayer.addEventListener("click", () => {
  if (currentAudio) currentAudio.pause();
  centralPlayer.style.display = "none";
  clearInterval(seekInterval);
  centralSeekbar.value = 0;
  playPauseBtn.textContent = "▶";
});

// -----------------------
// BOOK CARD & LIBRARY BUTTON LOGIC
// -----------------------
const booksData = {
  "Rich Dad Poor Dad": ["assets/frichdad1.m4a", "assets/frichdad2.m4a", "assets/frichdad3.m4a"],
  "The Psychology Of Money": ["assets/fpsy1.m4a", "assets/fpsy2.m4a", "assets/fpsy3.m4a"],
  "Think And Grow Rich": ["assets/ftr1.m4a", "assets/ftr2.m4a", "assets/ftr3.m4a"],
  "Atomic Habits": ["assets/fatomic1.m4a", "assets/fatomic2.m4a", "assets/fatomic3.m4a"],
  "The Subtle Art of Not Giving A Fuck": ["assets/fuck1.m4a", "assets/fuck2.m4a", "assets/fuck3.m4a"],
  "How To Win Friends And Influence People": ["assets/friend1.m4a", "assets/friend2.m4a", "assets/friend3.m4a"],
  "The Power of Now": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "The 48 Laws of Power": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "Zero To One": ["assets/zero2one1.m4a", "assets/zero2one2.m4a", "assets/zero2one3.m4a"],

  // ✅ missing comma fixed here
  "Eat That Froge": ["assets/froge1.mp3", "assets/froge2.mp3", "assets/froge3.mp3"],
  "Dopamin Detox": ["assets/detox1.mp3", "assets/detox2.mp3", "assets/detox3.mp3"],
  "Bhagwat Geeta": ["assets/geeta1.mp3", "assets/geeta2.mp3", "assets/geeta3.mp3"],
  "The Quran": ["assets/quran1.mp3", "assets/quran2.mp3", "assets/quran3.mp3"]
};


document.querySelectorAll(".book-card").forEach(card => {
  const audio = card.querySelector("audio");
  const playBtn = card.querySelector(".play-button");
  const title = card.querySelector("h3").textContent;
  const libraryContainer = card.querySelector(".library-container");

  // MAIN PLAY BUTTON
  playBtn.addEventListener("click", () => {
    openCentralPlayer(audio, title);

    // CLOSE OTHER LIBRARIES
    document.querySelectorAll(".library-container").forEach(lib => {
      if (lib !== libraryContainer) lib.style.display = "none";
    });

    // TOGGLE CURRENT LIBRARY
    if (libraryContainer.style.display === "flex") {
      libraryContainer.style.display = "none";
      return;
    }

    libraryContainer.innerHTML = ""; // CLEAR PREVIOUS

    const parts = booksData[title] || [audio.src]; // fallback to single part
    parts.forEach((src, index) => {
      const btn = document.createElement("button");
      btn.textContent = `Part ${index + 1}`;
      btn.addEventListener("click", () => {
        audio.src = src;
        openCentralPlayer(audio, `${title} - Part ${index + 1}`);
      });
      libraryContainer.appendChild(btn);
    });

    libraryContainer.style.display = "flex";
  });

  // SEEKBAR SYNC FOR EACH CARD
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      centralSeekbar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  audio.addEventListener("ended", () => {
    playPauseBtn.textContent = "▶";
    centralPlayer.style.display = "none";
  });
});

function filterBooks(category) {
  const books = document.querySelectorAll(".book-card");

  books.forEach(book => {
    const categories = book.getAttribute("data-category").split(" ");

    if (category === "All" || categories.includes(category)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}
// ====== FAVORITES / PLAYLIST (drop-in) ======
(function(){
  const LS_KEY = 'ag_favorites_v1';
  const modal = document.getElementById('favoritesModal');
  const favoritesList = document.getElementById('favoritesList');
  const openBtn = document.getElementById('openFavorites');
  const closeBtn = document.querySelector('.close-fav');
  const clearBtn = document.getElementById('favClearAll');

  // load favorites (array of objects {id,title,audio,image})
  let favorites = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

  // helper: slugify title -> id
  function slugify(s){
    return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  // get canonical card data from a .book-card element
  function cardData(card){
    const titleEl = card.querySelector('h3');
    const title = titleEl ? titleEl.innerText.trim() : 'Untitled';
    const id = card.dataset.id || slugify(title);
    const audioEl = card.querySelector('audio');
    const audio = audioEl ? (audioEl.src || audioEl.getAttribute('src')) : (card.dataset.audio || '');
    const imgEl = card.querySelector('img');
    const image = imgEl ? (imgEl.src || imgEl.getAttribute('src')) : '';
    return { id, title, audio, image };
  }

  function save(){ localStorage.setItem(LS_KEY, JSON.stringify(favorites)); }
  function isFav(id){ return favorites.some(f => f.id === id); }

  // update all favorite buttons UI
  function markButtons(){
    document.querySelectorAll('.book-card').forEach(card => {
      const btn = card.querySelector('.favorite-btn');
      if(!btn) return;
      const id = card.dataset.id || slugify(card.querySelector('h3').innerText);
      if(isFav(id)){
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');
        btn.textContent = '❤️';
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed','false');
        btn.textContent = '🤍';
      }
    });
  }

  // render favorites modal list
  function renderList(){
    favoritesList.innerHTML = '';
    if(favorites.length === 0){
      favoritesList.innerHTML = '<p style="opacity:.8; text-align:center;">No favorites yet.</p>';
      return;
    }
    favorites.forEach(item => {
      const row = document.createElement('div');
      row.className = 'favorite-item';
      row.innerHTML = `
        <div class="meta">
          <img class="fav-thumb" src="${item.image || 'assets/default-thumb.png'}" alt="${item.title}">
          <div class="fav-title">${item.title}</div>
        </div>
        <div class="row-actions">
          <button class="icon-btn fav-play" data-id="${item.id}" title="Play">▶</button>
          <button class="icon-btn fav-remove" data-id="${item.id}" title="Remove">❌</button>
        </div>
      `;
      favoritesList.appendChild(row);
    });
  }

  // toggle favorite for a card
  function toggleFavForCard(card){
    const data = cardData(card);
    if(isFav(data.id)){
      favorites = favorites.filter(f => f.id !== data.id);
    } else {
      favorites.push(data);
    }
    save();
    markButtons();
    renderList();
  }

  // play book from favorites (tries to find existing audio element, fallback to new Audio())
  function playFromFavorite(id){
    const book = favorites.find(f => f.id === id);
    if(!book) return;
    // find matching card's audio element first
    const card = [...document.querySelectorAll('.book-card')].find(c => (c.dataset.id || slugify(c.querySelector('h3').innerText)) === id);
    if(card){
      const audioEl = card.querySelector('audio');
      if(audioEl){
        openCentralPlayer(audioEl, book.title);
        modal.style.display = 'none';
        return;
      }
    }
    // fallback: create temporary Audio element and play
    const tmp = new Audio(book.audio);
    // append to DOM so openCentralPlayer's interval etc can work (optional)
    tmp.style.display = 'none';
    document.body.appendChild(tmp);
    openCentralPlayer(tmp, book.title);
    modal.style.display = 'none';
  }

  // remove favorite by id
  function removeFavorite(id){
    favorites = favorites.filter(f => f.id !== id);
    save();
    renderList();
    markButtons();
  }

  // Delegated click handling (favorite toggle on cards + modal play/remove)
  document.addEventListener('click', (e) => {
    // favorite button on card
    const favBtn = e.target.closest('.favorite-btn');
    if(favBtn){
      const card = favBtn.closest('.book-card');
      if(!card) return;
      toggleFavForCard(card);
      return;
    }

    // play from favorites
    const playBtn = e.target.closest('.fav-play');
    if(playBtn){
      playFromFavorite(playBtn.dataset.id);
      return;
    }

    // remove from favorites
    const remBtn = e.target.closest('.fav-remove');
    if(remBtn){
      removeFavorite(remBtn.dataset.id);
      return;
    }
  });

  // open/close modal
  if(openBtn) openBtn.addEventListener('click', () => {
    renderList();
    modal.style.display = 'block';
  });
  if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

  // clear all
  if(clearBtn) clearBtn.addEventListener('click', () => {
    if(!confirm('Clear all favorites?')) return;
    favorites = [];
    save();
    renderList();
    markButtons();
  });

  // init UI on load
  markButtons();
  renderList();

})();
