const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'A-PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const optionBtn = $('.option')

const titleHeading = $('head title')

const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isOpen: false,
    isHeart: [false, false, false, false, false, false, false, false, false, false],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Bad Boy',
            singer: 'BIGBANG',
            path: './assets/music/song1.mp3',
            youtube: 'https://youtu.be/1qnV55LUFVM',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Blue',
            singer: 'BIGBANG',
            path: './assets/music/song2.mp3',
            youtube: 'https://youtu.be/2GRP1rkE4O0',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'My Heaven',
            singer: 'BIGBANG',
            path: './assets/music/song3.mp3',
            youtube: 'https://youtu.be/Hjc03nySrbw',
            image: './assets/img/cover.jpg'
        },
        {
            name: 'Ms. Liar',
            singer: 'BIGBANG',
            path: './assets/music/song4.mp3',
            youtube: '#',
            image: './assets/img/cover.jpg'
        },
        {
            name: 'Let Me Hear Your Voice',
            singer: 'BIGBANG',
            path: './assets/music/song5.mp3',
            youtube: 'https://youtu.be/oQjcJBGIFsA',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Haru Haru',
            singer: 'BIGBANG',
            path: './assets/music/song6.mp3',
            youtube: 'https://youtu.be/MzCbEdtNbJ0',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Missing You',
            singer: 'BIGBANG',
            path: './assets/music/song7.mp3',
            youtube: '#',
            image: './assets/img/song10.jpg'
        },
        {
            name: 'Eyes, Nose, Lips',
            singer: 'TAEYANG',
            path: './assets/music/song8.mp3',
            youtube: 'https://youtu.be/UwuAPyOImoI',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Ego',
            singer: 'BIGBANG',
            path: './assets/music/song9.mp3',
            youtube: '#',
            image: './assets/img/cover.jpg'
        },
        {
            name: 'Crooked',
            singer: 'G-DRAGON',
            path: './assets/music/song10.mp3',
            youtube: 'https://youtu.be/RKhsHGfrFmY',
            image: './assets/img/song10.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                    style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option" data-index="${index}">
                        <i class="fas fa-ellipsis-h"></i>
                        <ul class="option-list">
                            <li class="option-item">
                                <div href="#" class="option-link option-item-share">
                                    <i class="fas fa-share-alt"></i>
                                </div>
                            </li>
                            <li class="option-item">
                                <a ${song.youtube !== '#' ? 'target="popup"' : '' } href="${song.youtube}" class="option-link option-item-youtube">
                                    <i class="fab fa-youtube"></i>
                                </a>
                            </li>
                            <li class="option-item">
                                <div class="option-link option-item-heart">
                                ${song.heart === true ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
                                </div>
                            </li>
                            <li class="option-item">
                                <div class="option-link option-item">
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
        
        this.setConfig('currentIndex', this.currentIndex)
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex]
            }
        });
    },
    handleEvents: function() {
        const _this = this

        // X??? l?? CD quay v?? d???ng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //X??? l?? ph??ng to / thu nh??? khi cu???n
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const newCdWidth = cdWidth - window.scrollY;
            cd.style.width = newCdWidth > 0 ?newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // X??? l?? khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song ???????c play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            titleHeading.innerHTML = _this.songs.map((song,index) => {
                return `${index === _this.currentIndex ? `${song.name.toUpperCase()} - ${song.singer}` : ''}`
            }).join('')
        }
        // Khi song b??? pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
            titleHeading.innerHTML = `BIGBANG PLAYLIST`
        }
        // Ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        // X??? l?? khi tua song
        progress.oninput = function(e) {
            audio.currentTime = e.target.value / 100 * audio.duration;
        }
        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) _this.playRandomSong()
            else _this.nextSong();
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) _this.playRandomSong()
            else _this.prevSong();
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Random b??i h??t
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        // Khi b???m repeat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        // Khi k???t th??c b??i h??t
        audio.onended = function() {
            if (_this.isRepeat) audio.play()
            else nextBtn.click()
        }
        // L???ng nghe h??nh vi click ??? playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song')
            const optionNode = e.target.closest('.option')
            if (e.target.closest('.option')) {
                _this.isOpen = !_this.isOpen
                optionNode.classList.toggle('active',_this.isOpen)
                if (e.target.closest('.option-list')) {
                    if (e.target.closest('.option-item-heart')) {
                        _this.isHeart[Number(songNode.dataset.index)] = !_this.isHeart[Number(songNode.dataset.index)]
                        _this.setConfig('isHeart', _this.isHeart)
                        if (_this.isHeart[Number(songNode.dataset.index)]) 
                            e.target.closest('.option-item-heart').innerHTML = `<i class="fas fa-heart"></i>`;
                        else 
                            e.target.closest('.option-item-heart').innerHTML = `<i class="far fa-heart"></i>`;
                    } else if (e.target.closest('.option-item-share')) {
                        alert('Coming soon..')
                    }
                }
            } else {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        // C??ch 1 l???i do nh???ng d??? ki???n ban ?????u s??? kh??ng ???????c config (khi ch???y l???n ?????u)
        // this.isRandom = this.config.isRandom
        // this.isRepeat = this.config.isRepeat
        // if (typeof this.config.currentIndex !== "undefined") this.currentIndex = this.config.currentIndex
        // this.isHeart = this.config.isHeart
        // C??ch 2: nh??ng kh??ng ?????m b???o v?? sau n??y config nhi???u
        Object.assign(this, this.config)
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex > (this.songs.length - 1))
            this.currentIndex = 0;
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if (this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong()
    },
    playRandomSong : function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200)
    },
    start: function () {
        // G??n c???u h??nh t??? config v??o app
        this.loadConfig();

        // ?????nh ngh??a c??c thu???c t??nh cho object
        this.defineProperties();

        // L???ng nghe / x??? l?? c??c s??? ki???n (DOM events)
        this.handleEvents()

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y
        this.loadCurrentSong()

        // Render playlist
        this.render()
        
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()