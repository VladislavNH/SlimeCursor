const { sin, cos, abs, PI, hypot, max, min } = Math;
let w = (canvas.width = innerWidth);
let h = (canvas.height = innerHeight);
const ctx = canvas.getContext("2d");
ctx.translate(w / 2, h / 2);
ctx.scale(w, w);

const things = many(1, thing);

requestAnimationFrame(function frame(t) {
    t /= 1000;
    ctx.fillStyle = "#00000057";
    ctx.fillRect(-1, -1, 2, 2);
    ctx.fillStyle = "#fff";
    things.forEach((thing) => thing.tick(t));
    requestAnimationFrame(frame);
});

addEventListener("pointermove", (e) => {
    const x = (e.clientX - w / 2) / w;
    const y = (e.clientY - h / 2) / w;
    things.forEach((thing) => thing.follow(x, y));
});

function thing() {
    let x = rnds(),
        y = rnds(),
        kx = rnd(1, 1),
        ky = rnd(1, 1),
        rx = rnd(0.1, 0.02),
        ry = rnd(0.1, 0.02),
        targetX = rnds(0.5),
        targetY = rnds(0.5),
        r = rnd(0.02, 0.02),
        pts = many(222, () => ({
            da: rnd()*PI*2,
            n: rnd(3,3) | 0,
            x: rnds(),
            y: rnds(),
            t: 0
        }));

    return {
        follow(x, y) {
            targetX = x;
            targetY = y;
        },
        tick(t) {
            x += (targetX + cos(t / kx) * rx - x) / 30;
            y += (targetY + sin(t / ky) * ry - y) / 30;
            let c = pt(x, y);
            pts.forEach((p) => {
                let dist = hypot(p.x - x, p.y - y);
                let grow = dist < 0.1;
                let dt = grow ? 0.05 : -0.1;
                p.t = max(min(3, p.t + dt), 0);
                p.t && tentacle(c, p, min(1, p.t));
                // p.t && grow && many(p.n, i => {
                //     let t = max( 0, (p.t - 1)/2 );
                //     let r = (sin(i)*0.5+0.5)*0.01
                //     let p1 = translate(p, polar(i/p.n*PI*2, r*t));
                //     //circle(p1, t*0.003);
                //     t&&tentacle(p, p1, t)
                // })
            });
        }
    };
}

function tentacle(from, to, t) {
    
    let count = 100;
    t = smoothstep(t);
    many(count, (i) => {
        let x = i / count;
        if (x > t) return;
        let p = lerpPt(from, to, x);
        x -= 0.5;
        let r = (x * x + 0.2) ** 2 * 0.02;
        circle(p, r);
    });
    
}

function circle(pt, r) {
    ctx.beginPath();
    ctx.ellipse(pt.x, pt.y, r, r, 0, 0, PI * 2);
    ctx.fill();
}

function many(x, f) {
    return [...Array(x)].map((_, i) => f(i));
}
function lerpPt(a, b, t) {
    return pt(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function rnd(x, dx = 0) {
    return Math.random() * x + dx;
}
function rnds(x = 1) {
    return rnd(x, -x / 2);
}
function translate(a, b) {
    return pt(a.x + b.x, a.y + b.y);
}
function smoothstep(t) {
    return 3 * t * t - 2 * t * t;
}
function pt(x, y) {
    return { x, y };
}
function polar(a, r) {
    return pt(cos(a) * r, sin(a) * r);
}
