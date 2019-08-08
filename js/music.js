var data = [
    {
        title: '陈奕迅-好久不见',
        src: './audio/陈奕迅-好久不见.mp3'
    },
    {
        title: '李健-贝加尔湖畔',
        src: './audio/李健-贝加尔湖畔.mp3'
    },
    {
        title: '李克勤 - 月半小夜曲',
        src: './audio/李克勤 - 月半小夜曲.mp3'
    },
    {
        title: '薛之謙 - 木偶人',
        src: './audio/薛之謙 - 木偶人.m4a'
    }
];


// 播放列表
// 前后歌曲切换
// 播放暂停
// 播放模式：随机、单曲循环、列表循环
// 进度,
// 音量


function Music(data, controls) {
    this.data = data;
    // 控制面板的所有按钮
    // this.controls = controls;
    this.srcKey = controls.srcKey;

    this.init(controls);
}

Music.prototype = {
    constructor: Music,
    init(controls) {
        this.addElem(controls);
        this.initAudio();
        this.addPlayEvent();
        this.addPreNextEvent();
    },
    $(node) {
        return document.querySelector(node);
    },
    // 挂载元素
    addElem(controls) {


        // 播放
        this.play = this.$(controls.play);
        // 上一曲
        this.prev = this.$(controls.prev);
        // 下一曲
        this.next = this.$(controls.next);

    },
    initAudio() {
        this.curIndex = 0;
        this.curSrc = this.data[this.curIndex][this.srcKey];
        this.aduio = new Audio(this.curSrc);
    },
    // 播放暂停
    addPlayEvent() {
        var _self = this;

        // 是否正在播放
        this.playing = false;
        this.play.addEventListener('click', function () {
            !_self.playing ? _self.aduio.play() : _self.aduio.pause();
            _self.playing = !_self.playing;
        });
    },
    // 上一曲，下一曲
    addPreNextEvent() {
        var _self = this;
        this.prev.addEventListener('click', changeMusic);
        this.next.addEventListener('click', changeMusic);

        function changeMusic(next) {
            if (next) {
                _self.curIndex++;
                _self.curIndex %= _self.data.length;
            } else {
                _self.curIndex = _self.curIndex - 1 <= -1 ? _self.data.length - 1 : _self.curIndex - 1;
            }
            _self.aduio.src = _self.data[_self.curIndex][_self.srcKey];
            console.log(_self.data[_self.curIndex][_self.srcKey]);
            // 播放音乐，
            _self.aduio.play();
            // 状态这是为正在播放
            _self.playing = true;
        }
    }
}


new Music(data, {
    srcKey: 'src',
    play: '#play',
    prev: '#prev',
    next: '#next'
});



