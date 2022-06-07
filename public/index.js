const initSize = 600
const phi = 0.618

let wedges = []

function setup() {
    for (let i = 0; i < 10; ++i) {
        const u = new p5.Vector(initSize*cos((i - 1)*2*PI/10), initSize*sin((i - 1)*2*PI/10))
        const v = new p5.Vector(initSize*cos(i*2*PI/10), initSize*sin(i*2*PI/10))
        
        const a = new p5.Vector(0, 0)
        const b = p5.Vector.add(a, u)
        const c = p5.Vector.add(a, v)
        
        const points = (i%2 == 0) ? [a, b, c] : [a, c, b]

        wedges.push(subdivide(...points, true, 6))
    }
    
    createCanvas(700, 700, WEBGL)
    frameRate(60)
    background(255)
}

function draw() {
    for (const wedge of wedges) {
        try {
            const [a, b, c, isNarrow] = wedge.next().value
        
            strokeWeight(1)
            if (isNarrow) fill(255, 200, 150)
            else fill(150, 255, 200)
            beginShape()
            vertex(b.x, b.y)
            vertex(a.x, a.y)
            vertex(c.x, c.y)
            endShape()
        } catch (TypeError) {
            console.log("end")
        }
    }
}

function* subdivide(a, b, c, isNarrow, depth) {
    // Base case
    if (depth == 0) yield [a, b, c, isNarrow]
    else if (isNarrow) {
            const p = p5.Vector.add(p5.Vector.mult(a, (1 - phi)), p5.Vector.mult(b, phi))
    
            yield* subdivide(p, c, a, false, depth - 1)
            yield* subdivide(c, p, b, true, depth - 1)
    }
    else {
        const q = p5.Vector.add(p5.Vector.mult(b, (1 - phi)), p5.Vector.mult(a, phi))
        const r = p5.Vector.add(p5.Vector.mult(b, (1 - phi)), p5.Vector.mult(c, phi))
        
        yield* subdivide(q, r, b, false, depth - 1)
        yield* subdivide(r, q, a, true, depth - 1)
        yield* subdivide(r, c, a, false, depth - 1)
    }
}
