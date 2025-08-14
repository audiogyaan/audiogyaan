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
  "Rich Dad Poor Dad": ["assets/frichdad1.m4a", "assets/frichdad2.m4a", "assets/frichdad3.m4a", ],
  "The Psychology of Money": ["assets/", "assets/" , "assets/"],
  "Think And Grow Rich": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "Atomic Habits": ["assets/", "assets/", "assets/"],
  "The Subtle Art of Not Giving A Fuck": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "How To Win Friends And Influence Pwople": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "The Power of Now": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "The 48 Law of Power": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"]
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
