console.log(game)
game.height = 800
game.width = 800
const ctx = game.getContext("2d")
const BACK = "#101010"
const FORE = "#50FF50"
const ACC = "#FF5050"
const linesize = document.getElementById("lineWidth").value;
const renderV = document.getElementById("vr").checked;
const movZ = document.getElementById("movZ").valueAsNumber;
const movX = document.getElementById("movX").valueAsNumber;
const movY = document.getElementById("movY").valueAsNumber;

console.log(ctx)
function clear(){
    ctx.fillStyle = BACK
    ctx.fillRect(0,0,game.width,game.height)
}

function point({x,y}){
    const s = 10
    ctx.fillStyle = ACC
    ctx.fillRect(x-s/2,y-s/2,s,s)
}

function line(p1,p2){
    ctx.lineWidth = linesize
    ctx.strokeStyle = FORE
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke();
}

function screen(p){
    // -1..1 => 0..1 => 0..1 => 0..w
    return{
        x: (p.x+1)/2*game.width,
        y: (1 - (p.y +1)/2)*game.height,
    }
}

function project({x,y,z}){
    return{
        x: x/z,
        y: y/z,
    }
}

function rotate({x,y,z},angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return{
        x: x*c-z*s,
        y,
        z: x*s+z*c,
    };
}

const vs = [
    {x:  .5, y:  .5, z: .5},
    {x: -.5, y:  .5, z: .5},
    {x: -.5, y: -.5, z: .5},
    {x:  .5, y: -.5, z: .5},

    {x:  .5, y:  .5, z: -.5},
    {x: -.5, y:  .5, z: -.5},
    {x: -.5, y: -.5, z: -.5},
    {x:  .5, y: -.5, z: -.5},
]

const fs = [
    [0,1,2,3],
    [4,5,6,7],
    [1,5],
    [0,4],
    [2,6],
    [3,7],
]

function translate_z({x,y,z}, dz){
    return {x,y,z: z+ dz}
}

const FPS = 60;
let dz = movZ;
let angle = 0;
function frame(){
    const dt = 1/FPS;
    //dz += 1*dt
    angle += Math.PI*dt
    clear()
    if (renderV) {
    for (const v of vs){
        point(screen(project(translate_z(rotate(v,angle), dz))))
    }
    }
    for (const f of fs){
        for (let i = 0; i < f.length; i++){
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(
            screen(project(translate_z(rotate(a,angle), dz))),
            screen(project(translate_z(rotate(b,angle), dz))),
            )
        }
    }
    setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);