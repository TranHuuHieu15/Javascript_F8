const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
            path: "./access/music/SauChiaTayAiCungKhac-TRI-6968722.mp3",
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
            path: "./access/music/anh_nho_ra.mp3",
            image: "./access/img/anh_nho_ra.jpg",
        }
    ],
    render: function () {
        const html = this.songs.map((song) => {
            return `
            <div class="song">
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
        $(".playlist").innerHTML = html.join("");
    },
    handleEvents: function () {
        const cd = $(".cd");
        const cdWith = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWith - scrollTop;
            console.log(newCdWidth);
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        };
    },
    start: function () {
        this.handleEvents();
        this.render();
    },
};

app.start();
