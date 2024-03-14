const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "F8_PLAYER";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const songs = [
  {
    name: "Âm thầm bên em",
    singer: "Sơn Tùng M-TP",
    path: "./access/music/AmThamBenEm-SonTungMTP-4066476.mp3",
    image: "./access/img/am_tham_ben_em.jpg",
  },
  {
    name: "Chúng ta rồi sẽ hạnh phúc",
    singer: "Tama",
    path: "./access/music/ChungTaRoiSeHanhPhucCover-Tama-13170356.mp3",
    image: "./access/img/chung_ta_roi_se_hanh_phuc.jpg",
  },
  {
    name: "Sau chia tay ai cũng khác",
    singer: "TRI",
    path: "./access/music/SauChiaTayAiCungKhac-TRI-6968722.mp3",
    image: "./access/img/chung_ta_cua_hien_ta.jpg",
  },
];

const app = {
  isRandom: false,
  isRepeat: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Âm thầm bên em",
      singer: "Sơn Tùng M-TP",
      path: "./access/music/AmThamBenEm-SonTungMTP-4066476.mp3",
      image: "./access/img/am_tham_ben_em.jpg",
    },
    {
      name: "Chúng ta rồi sẽ hạnh phúc",
      singer: "Tama",
      path: "./access/music/ChungTaRoiSeHanhPhucCover-Tama-13170356.mp3",
      image: "./access/img/chung_ta_roi_se_hanh_phuc.jpg",
    },
    {
      name: "Sau chia tay ai cũng khác",
      singer: "TRI",
      path: "./access/music/SauChiaTayaiCungKhac-TRIItsHuy-6412918.mp3",
      image: "./access/img/chung_ta_cua_hien_ta.jpg",
    },
    {
      name: "Những lời hứa bỏ quên",
      singer: "Vũ.",
      path: "./access/music/nhung_loi_hua_bo_quen.mp3",
      image: "./access/img/nhung_loi_hua_bo_quen.jpg",
    },
    {
      name: "Anh nhớ ra",
      singer: "Vũ. ft Trang",
      path: "./access/music/buoc-qua-mua-co-don-vu.mp3",
      image: "./access/img/buoc_qua_mua_co_don.jpg",
    },
  ],
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    playlist.innerHTML = html.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWith = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity, // loop vô hạng lần
    });
    cdThumbAnimate.pause();
    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWith - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWith;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (audio.paused) {
        audio.play();
        player.classList.add("playing");
        cdThumbAnimate.play();
      } else {
        audio.pause();
        cdThumbAnimate.pause();
        player.classList.remove("playing");
      }
    };

    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Khi next song
    nextSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      player.classList.add("playing");
      _this.render();
      _this.scrollToActiveSong();
    };

    //Khi prev song
    prevSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      player.classList.add("playing");
      _this.render();
      _this.scrollToActiveSong();
    };

    //Xử lý random bật tắt
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //Xử lý lặp lại một bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextSong.click();
      }
    };

    //Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
          player.classList.add("playing");
        }
        // Xử lý khi click vào song option
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    repeatBtn.classList.toggle("active", this.isRepeat);
    randomBtn.classList.toggle("active", this.isRandom);
  },
};

app.start();
