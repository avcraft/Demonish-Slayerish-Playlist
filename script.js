// --- ELEMENTS ---
const audioSource = document.getElementById("audioSource");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const fileInput = document.getElementById("fileInput");
const playlistList = document.getElementById("playlistList");
const albumArt = document.getElementById("art");

let playlist = [];
let currentSongIndex = 0;
let isPlaying = false;

// --- FILE LOADING ---
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const blobURL = URL.createObjectURL(file);
    playlist.push({
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove .mp3 etc
      url: blobURL,
    });
  });

  updatePlaylistUI();

  // Auto-load first song if empty
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

  updateMediaMetadata(); // Update Windows Media Info
  updatePlaylistUI();
}

function togglePlay() {
  if (playlist.length === 0) return;
  isPlaying ? pauseSong() : playSong();
}

function playSong() {
  isPlaying = true;
  playBtn.innerText = "Pause"; // Or use your ⏸ icon
  albumArt.style.animation = "spin 10s linear infinite"; // Start spinning
  audioSource.play();
  updateMediaMetadata();
}

function pauseSong() {
  isPlaying = false;
  playBtn.innerText = "Play"; // Or use your ▶ icon
  albumArt.style.animationPlayState = "paused"; // Stop spinning
  audioSource.pause();
}

function nextSong() {
  currentSongIndex++;
  if (currentSongIndex >= playlist.length) currentSongIndex = 0;
  loadSong(currentSongIndex);
  playSong();
}

function prevSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) currentSongIndex = playlist.length - 1;
  loadSong(currentSongIndex);
  playSong();
}

// --- WINDOWS MEDIA SESSION (Action Center Controls) ---
function updateMediaMetadata() {
  if ("mediaSession" in navigator && playlist[currentSongIndex]) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playlist[currentSongIndex].name,
      artist: "AV Music Slayer",
      album: "Hinokami Kagura Collection",
      artwork: [
        { src: "images/av-icon.png", sizes: "512x512", type: "image/png" },
      ],
    });

    // Enable Windows buttons
    navigator.mediaSession.setActionHandler("play", playSong);
    navigator.mediaSession.setActionHandler("pause", pauseSong);
    navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  }
}

// --- AUTOMATION & PROGRESS ---

// Auto-Next Logic
audioSource.addEventListener("ended", () => {
  nextSong();
});

// Progress Bar Update
audioSource.addEventListener("timeupdate", () => {
  if (audioSource.duration) {
    const pct = (audioSource.currentTime / audioSource.duration) * 100;
    progress.value = pct;
  }
});

// Seek Logic
progress.addEventListener("input", () => {
  const seekTime = (progress.value / 100) * audioSource.duration;
  audioSource.currentTime = seekTime;
});

// Keyboard Support
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});
