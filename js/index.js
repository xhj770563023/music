

// 获取元素(通过ID)
function $(id) {
    return document.getElementById(id);
}

window.addEventListener('load', load);


function load() {


    // 封装
    let musicControl = {
        getNode() {
            console.log(this);
            // 播放进度条
            this.proBar = $('pro-bar');
            // 播放小按钮
            this.proBtn = $('pro-btn');

            this.flagX = false;

            // 音量进度条
            this.volBar = $('vol-bar');
            // 音量小按钮
            this.volBtn = $('vol-btn');

            this.flagY = false;


            // 播放按钮
            this.playBtn = $('play');
            // 是否正在播放
            this.isPlaying = false;

            // 上一曲、下一曲
            this.prevMusic = $('prev');
            this.nextMusic = $('next');

            // 当前时间、结束时间
            this.currentTime = $('cur-time');
            this.endTime = $('end-time');

        },

        addEvent() {
            let _self = this;
            //声音
            volume.addEventListener('click',function(){
                progress_bar_v.classList.toggle('active')
            })
            // 进度条
            _self.proBtn.addEventListener('touchstart', function () {
                _self.flagX = true;
                // 进度小按钮被摸到的时候需要将定时器清除
                _self.clearTime();
                // 如果处于播放的状态则将其暂停
                _self.isPlaying && music.play(true);
                _self.isPlaying = false;
                _self.changePlayIcon();
            });

            // 音量
            _self.volBtn.addEventListener('touchstart', function () {
                _self.flagY = true;
            });

            // window监听移动状态
            window.addEventListener('touchmove', function (e) {
                if (_self.flagX) {
                    // 进度条
                    _self.movePrecent(e, _self.proBar, function (w, h, wP) {
                        _self.proBar.style.width = w + 'px';
                        let {endTime, formatTime} = music.getTime();
                        endTime * wP
                        music.setCurTime(endTime * wP);
                        endTime * wP
                        _self.currentTime.innerText = formatTime(endTime * wP).mm + ':' + formatTime(endTime * wP).ss;
                    });
                }

                if (_self.flagY) {
                    // 音量条
                    _self.movePrecent(e, _self.volBar, function (w, h, wP, hP) {
                        _self.volBar.style.height = h + 'px';
                        // 调用设置音量的方法
                        music.setVolume(hP);
                    });
                }
            });

            // 手指离开
            window.addEventListener('touchend', function () {
                if (_self.flagX) {
                    _self.isPlaying = true;
                    music.play();
                    _self.changePlayIcon();
                    _self.setTimer();
                }

                _self.flagX = false;
                _self.flagY = false;
            });

            // 播放按钮事件
            _self.playBtn.addEventListener('click', function () {
                music.play(_self.isPlaying);
                _self.isPlaying = !_self.isPlaying;
                _self.changePlayIcon();
                _self.isPlaying ? _self.setTimer() : _self.clearTime();
            });

            // 上一曲、下一曲
            _self.prevMusic.addEventListener('click', function () {
                console.log('切换至上一曲');
                // 清除定时器
                _self.clearTime();

                if (_self.isPlaying) {
                    music.play(true);
                    _self.isPlaying = false;
                    _self.changePlayIcon();
                }

                // 切换歌曲
                music.changeMusic(false);
                
                // 假设延迟
                setTimeout(() => {
                    // 开始播放
                    music.play();
                    // 切换为正在播放
                    _self.isPlaying = true;
                    // 更改图标
                    _self.changePlayIcon();
                    _self.setTimer();
                }, 2000);
            });

            _self.nextMusic.addEventListener('click', function () {
                console.log('切换至下一曲');
                // 清除定时器
                _self.clearTime();

                // 当音乐正在播放是时候，则需要先暂停一下，再切换至下一曲
                if (_self.isPlaying) {
                    music.play(true);
                    _self.isPlaying = false;
                    _self.changePlayIcon();
                }

                // 切换音乐
                music.changeMusic(true);
                // 假设延迟一下
                setTimeout(() => {
                    music.play();
                    _self.isPlaying = true;
                    _self.changePlayIcon();
                    _self.setTimer();
                }, 1000);
            });
        },

        movePrecent(e, ele, callBack) {
            // 当前鼠标的X坐标
            let moveX = e.touches[0].clientX;
            // 判断鼠标Y的坐标
            let moveY = e.touches[0].clientY;


            // 获取进度条父元素距离左侧的距离 或 // 获取音量进度条父元素距离顶部的距离
            let rect = ele.parentNode.getBoundingClientRect();

            // 进度条的宽度
            let w = moveX - rect.x;

            // 进度条的高度
            let h = rect.height - (moveY - rect.y);

            // 判断边界
            w = w <= 0 ? 0 : w;
            w = w >= rect.width ? rect.width : w;

            h = h <= 0 ? 0 : h;
            h = h >= rect.height ? rect.height : h;

            // 所占比例
            let wP = (w / rect.width).toFixed(2);
            let hP = (h / rect.height).toFixed(2);

            // 宽度、高度、 宽度百分比、高度百分比
            callBack(w, h, wP, hP);
        },

        // 改变播放的图标
        changePlayIcon() {
            if (this.isPlaying) {
                this.playBtn.children[1].classList.add('show');
                this.playBtn.children[0].classList.remove('show');
            } else {
                this.playBtn.children[0].classList.add('show');
                this.playBtn.children[1].classList.remove('show');
            }
        },
        // 设置定时器
        setTimer() {
            let _self = this;
            this.timer = setInterval(function () {
                let {curTime, endTime, precent, formatTime} = music.getTime();
                _self.proBar.style.width = (precent * _self.proBar.parentNode.clientWidth).toFixed(2) + 'px';

                console.log(formatTime(endTime))
                // 格式化时间将其渲染到页面上
                _self.endTime.innerText = formatTime(endTime).mm + ':' + formatTime(endTime).ss;
                _self.currentTime.innerText = formatTime(curTime).mm + ':' + formatTime(curTime).ss;
            }, 1000);
        },

        // 清除定时器
        clearTime() {
            clearInterval(this.timer);
        }

 
    }
    musicControl.getNode();
    musicControl.addEvent();
}



// 1. 进度条实现原理

    // 1.1 布局
        // 进度条的宽度默认为0
        // 进度小按钮定位在进度条的右边
        // 只有改变了进度条的宽度，那么按钮也会跟着改变
    // 1.2 移动
        // 手指开始触摸时：打开开关
        // window监听手指触摸移动
            // width = 移动的clientX (手指在可视区域内的X坐标) - 进度条父元素 离可视区域内左侧的距离
            // width 如果大于了 进度条父元素的宽度 是不可取 则以进度条父元素的宽度作为最大值， 以0作为最小值
            // 然后将width赋给进度条，进度条的宽度变大，则按钮会随之移动



    // 2. 给其他功能绑定事件
        // 2.1 给播放按钮绑定事件
        //     注意播放状态： 正在播放与暂停 
        //         使用了isPlaying 的真假来判断是否正在播放
        // 将isPlaying 传入至music.play方法内，其功能里面判断是否为真，如果为真说明正在播放，则执行暂停，反之则播放
        // 2.2 给上一曲、下一曲绑定切换歌曲的事件