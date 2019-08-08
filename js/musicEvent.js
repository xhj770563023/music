let musicList = [
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

function Music(data, opt) {
    this.data = data;
    this.keySrc = opt.keySrc;
    this.currentMusicIdx = 0;
    // 第一首歌曲
    this.currentMusic = this.data[0][this.keySrc];

    this.initAudio();
}



Music.prototype = {
    constructor: Music,
    initAudio() {
        // 实例化音乐播放器

        this.audio = new Audio(this.currentMusic);
        // 预加载为自动
        this.audio.preload = 'auto';

        this.audio.volume = .5;

        // 数据加载完成
        let _self = this;
        this.audio.onloadeddata = function () {
            console.log(_self.audio);
        }
    },

    // 播放或暂停
    play(flag) {
        !flag ? this.audio.play() : this.audio.pause();
    },

    // 设置音量
    setVolume(vol) {
        this.audio.volume = vol;
    },

    setCurTime(time) {
        this.audio.currentTime = time;
    },

    // 切换曲目
    changeMusic(flag) {
        // 判断是否为下一首
        if (flag) {
            this.currentMusicIdx++;
            this.currentMusicIdx %= this.data.length;
        } else {
            this.currentMusicIdx--;
            this.currentMusicIdx = this.currentMusicIdx < 0 ? this.data.length - 1 : this.currentMusicIdx;
        }

        this.audio.src = this.data[this.currentMusicIdx][this.keySrc];
    },

    // 获取时间
    getTime() {
        let endTime = this.audio.duration;
        let curTime = this.audio.currentTime;

        return {
            // 结束时间
            endTime,
            // 当前时间
            curTime,
            // 时间所占百分比
            precent: (curTime / endTime).toFixed(2),
            // 时间格式化的方法
            formatTime(second) {
                let mm = Math.floor(second / 60);
                let ss = Math.floor(second % 60);

                mm = mm < 10 ? '0' + mm : mm;
                ss = ss < 10 ? '0' + ss : ss;
                return {
                    mm,
                    ss
                }

            }
        }
    }
}



let music = new Music(musicList, {
    keySrc: 'src'
});