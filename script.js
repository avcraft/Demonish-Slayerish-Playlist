// --- ELEMENTS ---
const audioSource = document.getElementById("audioSource");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const fileInput = document.getElementById("fileInput");
const playlistList = document.getElementById("playlistList");

let playlist = [];
let currentSongIndex = 0;
let isPlaying = false;

// --- FILE LOADING ---
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const blobURL = URL.createObjectURL(file);
    playlist.push({
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      url: blobURL,
    });
  });

  updatePlaylistUI();

  // Auto-play the first song if nothing is playing
  if (playlist.length > 0 && audioSource.src === "") {
    loadSong(0);
  }
});

function updatePlaylistUI() {
  playlistList.innerHTML = "";
  playlist.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerText = song.name;
    if (index === currentSongIndex) li.classList.add("active");

    li.onclick = () => {
      loadSong(index);
      playSong();
    };
    playlistList.appendChild(li);
  });
}

// --- PLAYER CONTROLS ---
function loadSong(index) {
  if (playlist.length === 0) return;

  currentSongIndex = index;
  audioSource.src = playlist[index].url;
  songTitle.innerText = playlist[index].name;
  artistName.innerText = "AV Music Slayer - Active Scroll";

  updatePlaylistUI();
}

function togglePlay() {
  if (playlist.length === 0) return;
  isPlaying ? pauseSong() : playSong();
}

function playSong() {
  isPlaying = true;
  playBtn.innerText = "⏸"; // Change icon to pause
  audioSource.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.innerText = "▶"; // Change icon to play
  audioSource.pause();
}

function nextSong() {
  currentSongIndex++;
  if (currentSongIndex >= playlist.length) {
    currentSongIndex = 0; // Loop back to start
  }
  loadSong(currentSongIndex);
  playSong();
}

function prevSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = playlist.length - 1; // Loop to end
  }
  loadSong(currentSongIndex);
  playSong();
}

// --- AUTOMATION & PROGRESS ---

// 1. AUTO-NEXT: This fixes your issue!
audioSource.addEventListener("ended", () => {
  nextSong();
});

// 2. Update Progress Bar
audioSource.addEventListener("timeupdate", () => {
  if (audioSource.duration) {
    const pct = (audioSource.currentTime / audioSource.duration) * 100;
    progress.value = pct;
  }
});

// 3. Seek functionality
progress.addEventListener("input", () => {
  const seekTime = (progress.value / 100) * audioSource.duration;
  audioSource.currentTime = seekTime;
});

// --- KEYBOARD SHORTCUTS (Space to Play/Pause) ---
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Stop page from scrolling
    togglePlay();
  }
});
