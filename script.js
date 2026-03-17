let songs = [];
let songIndex = 0;

const audio = document.getElementById("audioSource");
const playBtn = document.getElementById("playBtn");
const title = document.getElementById("songTitle");
const artist = document.getElementById("artistName");
const progress = document.getElementById("progress");
const fileInput = document.getElementById("fileInput");
const list = document.getElementById("playlistList");

// Handle File Picking
fileInput.addEventListener("change", function (e) {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const fileURL = URL.createObjectURL(files[i]);
    songs.push({
      title: files[i].name.replace(/\.[^/.]+$/, ""),
      path: fileURL,
    });
  }
  if (songs.length > 0 && audio.src === "") {
    loadSong(0);
  }
  updatePlaylistUI();
});

function loadSong(index) {
  songIndex = index;
  title.innerText = songs[songIndex].title;
  artist.innerText = "Nichirin Records";
  audio.src = songs[songIndex].path;
  updatePlaylistUI();
}

function togglePlay() {
  if (songs.length === 0) return alert("Select your scrolls first! ⚔️");
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶";
  }
}

function nextSong() {
  if (songs.length === 0) return;
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  audio.play();
  playBtn.innerText = "⏸";
}

function prevSong() {
  if (songs.length === 0) return;
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  audio.play();
  playBtn.innerText = "⏸";
}

// Update Progress
audio.ontimeupdate = () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

// Update Playlist
function updatePlaylistUI() {
  list.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerText = song.title;
    if (index === songIndex) li.classList.add("active");
    li.onclick = () => {
      loadSong(index);
      audio.play();
      playBtn.innerText = "⏸";
    };
    list.appendChild(li);
  });
}
