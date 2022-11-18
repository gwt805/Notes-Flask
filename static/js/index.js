// 页脚波浪
//得到标签
var myCanvas = document.querySelector("canvas");
//设置画布的宽高为浏览器的宽高
myCanvas.width = document.documentElement.clientWidth;
myCanvas.height = document.documentElement.clientHeight;
//得到canvas的上下文
var ctx = myCanvas.getContext("2d");
//自适应浏览器的宽高
window.onresize = function () {
    //设置画布的宽高为浏览器的宽高
    myCanvas.width = document.documentElement.clientWidth;
    myCanvas.height = document.documentElement.clientHeight;
}
// particle粒子构造函数
function Particle() {
    // 随机生成粒子距离原点的x，y距离用dotx和doty来表示
    this.dotx = Math.random() * myCanvas.width;
    this.doty = Math.random() * myCanvas.height;
    // 随机生成x,和y方向的运动信号量
    do {
        this.idx = (Math.random() * 2) - 1;
        this.idy = (Math.random() * 2) - 1;
        // 当生成的信号量为零重新生成
    } while (this.idx == 0 && this.idy == 0);
    // 两点之间最大距离的平方
    this.max = 6000;
    // 渲染粒子
    this.render();
    // 粒子放进数组
    dotsArr.push(this);
}
// 初始化粒子
Particle.prototype.render = function () {
    ctx.beginPath();
    ctx.fillRect(this.dotx, this.doty, 1, 1);
}
// 定时器更新粒子的状态
Particle.prototype.update = function () {
    // 改变每个粒子的x,y值，让粒子运动起来
    this.dotx += this.idx;
    this.doty += this.idy;
    // 碰撞检测，防止粒子运动出浏览器
    if (this.dotx > myCanvas.width || this.dotx < 0) {
        this.idx = -this.idx;
    }
    if (this.doty > myCanvas.height || this.doty < 0) {
        this.idy = - this.idy;
    }
    // 渲染粒子
    this.render();
    // 鼠标的中心值，当没在窗口移动鼠标，或鼠标移出窗口，鼠标的mouse.mouse_x
    // 为null不进行渲染
    if (mouse.mouse_x != null) {
        // 鼠标与各个粒子之间的x和y的距离
        var mousex = this.dotx - mouse.mouse_x;
        var mousey = this.doty - mouse.mouse_y;
        //运用直角三角形公式 x² + y² = z²求出两点距离的平方
        var mousez = mousex * mousex + mousey * mousey;
        // 当粒子距离鼠标在10000~20000之间，向鼠标靠拢
        if (mousez > mouse.max / 2 && mousez < mouse.max) {

            this.dotx -= mousex * 0.03;
            this.doty -= mousey * 0.03;
        }
        // 距离鼠标平方两万以内的全部和鼠标连线
        if (mousez < mouse.max) {
            // 调用连线功能
            this.toline(mouse.mouse_x, mouse.mouse_y, mousez);
        }
    }
    // 某一粒子实例与所有粒子距离的判断
    for (let j = 0; j < dotsArr.length; j++) {
        // 不等于本身
        if (dotsArr[j] != this) {
            // 实例与各个粒子之间的x和y的距离
            var dx = this.dotx - dotsArr[j].dotx;
            var dy = this.doty - dotsArr[j].doty;
            //运用直角三角形公式 x² + y² = z²求出两点距离的平方
            var dz = dx * dx + dy * dy;
            // 距离鼠标平方六千以内的全部和鼠标连线
            if (this.max > dz) {
                // 调用连线函数
                this.toline(dotsArr[j].dotx, dotsArr[j].doty, dz);
            }
        }
    }
}
// 连线函数
Particle.prototype.toline = function (x, y, z) {
    // 传来的鼠标与粒子距离平方大于粒子之间的距离的平方
    // 确保能够得到各自的rate
    if (z > this.max) {
        var rate = (mouse.max - z) / mouse.max;
    } else {
        var rate = (this.max - z) / this.max;
    }
    // 开始划线
    ctx.beginPath();
    // 线宽
    ctx.lineWidth = rate / 2;
    // 线的颜色
    ctx.strokeStyle = "rgba(255,255,255," + (rate + 0.2) + ")";
    // 线的起点
    ctx.moveTo(this.dotx, this.doty);
    // 线的终点
    ctx.lineTo(x, y);
    // 划线
    ctx.stroke();
}
// 定义一个数组存放所有的粒子
var dotsArr = [];
// 向浏览器里面放入两百五十个粒子
for (let i = 0; i < 500; i++) {
    // 调用实例
    new Particle();
}
var mouse = { "mouse_x": null, "mouse_y": null, "max": 20000 }
// 监测鼠标的移动
document.onmousemove = function (event) {
    mouse.mouse_x = event.clientX;
    mouse.mouse_y = event.clientY;
}
document.onmouseout = function (event) {
    mouse.mouse_x = null;
    mouse.mouse_y = null;
}
// 定时器让粒子动起来
callback();
function callback() {
    // 画布清屏
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    // 更新每个粒子
    for (let i = 0; i < dotsArr.length; i++) {
        dotsArr[i].update();
    }
    requestAnimationFrame(callback);
}

// 跳转笔记或者API介绍页面
function goNotes(id) {
    window.open("/notes?id=" + id, "_black");
}