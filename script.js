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

const centralPlayer = document.getElementById("centralPlayer");
const playPauseBtn = document.getElementById("playPause");
const forwardBtn = document.getElementById("forward");
const backwardBtn = document.getElementById("backward");
const nowPlaying = document.getElementById("nowPlaying");

let currentAudio = null;
let currentSeekbar = null;

document.querySelectorAll(".book-card").forEach(card => {
  const audio = card.querySelector("audio");
  const playBtn = card.querySelector(".play-button");
  const seekbar = card.querySelector(".seekbar");
  const title = card.querySelector("h3").textContent;

  playBtn.addEventListener("click", () => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = audio;
    currentSeekbar = seekbar;
    audio.play();
    playPauseBtn.textContent = "⏸";
    nowPlaying.textContent = `Now Playing: ${title}`;
    centralPlayer.style.display = "flex";
  });

  // Seekbar Sync
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      seekbar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  // Drag to Seek
  seekbar.addEventListener("input", () => {
    if (!isNaN(audio.duration)) {
      audio.currentTime = (seekbar.value / 100) * audio.duration;
    }
  });
});

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

forwardBtn.addEventListener("click", () => {
  if (currentAudio) currentAudio.currentTime += 10;
});

backwardBtn.addEventListener("click", () => {
  if (currentAudio) currentAudio.currentTime -= 10;
});
const booksData = {
  "Rich Dad Poor Dad": ["assets/", "assets/", "assets/", "assets/richdad3.mp3"],
  "The Psychology of Money": ["assets/", "assets/" , "assets/"],
  "Think And Grow Rich": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "Atomic Habits": ["assets/", "assets/", "assets/"],
  "The Subtle Art of Not Giving A Fuck": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "How To Win Friends And Influence Pwople": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "The Power of Now": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  "The 48 Law of Power": ["assets/grow1.mp3", "assets/grow2.mp3", "assets/grow3.mp3"],
  // Add for all books...
};

document.querySelectorAll(".book-card").forEach(card => {
  const audio = card.querySelector("audio");
  const playBtn = card.querySelector(".play-button");
  const seekbar = card.querySelector(".seekbar");
  const title = card.querySelector("h3").textContent;
  const libraryContainer = card.querySelector(".library-container");

  playBtn.addEventListener("click", () => {
    // Close other libraries
    document.querySelectorAll(".library-container").forEach(lib => {
      if (lib !== libraryContainer) lib.style.display = "none";
    });

    // Toggle current library
    if (libraryContainer.style.display === "flex") {
      libraryContainer.style.display = "none";
      return;
    }

    libraryContainer.innerHTML = ""; // Clear previous

    const parts = booksData[title] || [audio.src]; // fallback to single part

    parts.forEach((src, index) => {
      const btn = document.createElement("button");
      btn.textContent = `Part ${index + 1}`;
      btn.addEventListener("click", () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }

        audio.src = src;
        audio.play();
        currentAudio = audio;
        currentSeekbar = seekbar;
        nowPlaying.textContent = `Now Playing: ${title} - Part ${index + 1}`;
        centralPlayer.style.display = "flex";
        playPauseBtn.textContent = "⏸";
      });
      libraryContainer.appendChild(btn);
    });

    libraryContainer.style.display = "flex";
  });

  // existing timeupdate and input listeners
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      seekbar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  seekbar.addEventListener("input", () => {
    if (!isNaN(audio.duration)) {
      audio.currentTime = (seekbar.value / 100) * audio.duration;
    }
  });

  audio.addEventListener("ended", () => {
    playPauseBtn.textContent = "▶";
    centralPlayer.style.display = "none";
  });
});
