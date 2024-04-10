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
const canvas = $("#canvas");


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
    
    // Mảng chứa lời bài hát và thời gian tương ứng
    var lyrics = [
      { time: 0, text: "..." },
      {
        time: 16,
        text: "Khi bên anh em thấy điều chi", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "chi" },
        ]
      },
      {
        time: 20, text: "Khi bên anh em thấy điều gì", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "gì" },
        ]
      },
      {
        time: 22, text: "Nước mắt rơi, gần kề làn mi", 
        key: [
          { currentTime: 22.000, keyword: "Nước" },
          { currentTime: 22.500, keyword: "mắt" },
          { currentTime: 23.434, keyword: "rơi," },
          { currentTime: 24.404, keyword: "gần" },
          { currentTime: 25.334, keyword: "kề" },
          { currentTime: 26.234, keyword: "làn" },
          { currentTime: 27.234, keyword: "mi" },
        ]
      },
      {
        time: 29, text: "chẳng còn những  giây phút", 
        key: [
          { currentTime: 29.234, keyword: "Khi" },
          { currentTime: 29.834, keyword: "bên" },
          { currentTime: 30.034, keyword: "anh" },
          { currentTime: 30.504, keyword: "em" },
          { currentTime: 31.134, keyword: "thấy" },
          { currentTime: 31.734, keyword: "chi" },
        ]
      },
      {
        time: 32, text: "chẳng còn những  ân tình", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "chi" },
        ]
      },
      {
        time: 36, text: "Gió mang em rời xa nơi đây", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "chi" },
        ]
      },
      {
        time: 44, text: "Khi xa anh em nhớ về ai", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "chi" },
        ]
      },
      {
        time: 48, text: "Khi xa anh em nhớ một người", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "chi" },
        ]
      },
      {
        time: 50, text: " chắc không phải một người như anh", 
        key: [
          { currentTime: 16.234, keyword: "Khi" },
          { currentTime: 16.834, keyword: "bên" },
          { currentTime: 17.434, keyword: "anh" },
          { currentTime: 17.904, keyword: "em" },
          { currentTime: 18.334, keyword: "thấy" },
          { currentTime: 19.234, keyword: "chi" },
        ]
      },
    ];

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";

    //TODO: Hàm để vẽ lời bài hát lên canvas (Lyric hat tung hang)
    function drawLyrics(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ
      var currentLine = -1;
      for (var i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= time) {
          currentLine = i;
        } else {
          break;
        }
      }
      if (currentLine != -1) {
        ctx.textAlign = "center"; // Căn lề text ở giữa
        ctx.textBaseline = "middle"; // Căn lề text ở giữa

        // Vẽ 3 dòng lời bài hát
        for (var j = Math.max(0, currentLine - 1); j <= Math.min(lyrics.length - 1, currentLine + 1); j++) {
          var offsetY = canvas.height / 2 + (j - currentLine) * 20;
          ctx.font = j === currentLine ? "bold 16px Arial" : "16px Arial";
          ctx.fillStyle = j === currentLine ? "red" : "black";
          ctx.fillText(lyrics[j].text, canvas.width / 2, offsetY);
        }
      }
    }

    // Sự kiện cập nhật lời bài hát khi thời gian nhạc thay đổi
    audio.ontimeupdate = function () {
      drawLyrics(this.currentTime);
    };

  },
};

app.start();