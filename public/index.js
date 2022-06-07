const INIT_SIZE = 600
const PHI = 0.618
const THETA = 3.14159/5

let piePieces
let aabb

function setup() {
    piePieces = [...Array(10).keys()].map(piePiece)

    createCanvas(700, 700, WEBGL)
    frameRate(60)
}

function draw() {
    background(255)
    for (const piece of piePieces) {
        for (const fragment of piece) {
            const [a, b, c, isNarrow] = fragment
        
            orangeAndGreen(isNarrow)
            beginShape()
            vertex(b.x, b.y)
            vertex(a.x, a.y)
            vertex(c.x, c.y)
            endShape()
        }
    }
}

function piePiece(i) {
    const alpha = (i - 1)*THETA
    const beta = i*THETA

    const a = new p5.Vector(0, 0)
    const b = new p5.Vector(INIT_SIZE*cos(alpha), INIT_SIZE*sin(alpha))
    const c = new p5.Vector(INIT_SIZE*cos(beta), INIT_SIZE*sin(beta))
    
    const points = (i%2 == 0) ? [a, b, c] : [a, c, b]

    return Array.from(subdivide(...points, true, 6))
}

function* subdivide(a, b, c, isNarrow, depth) {
    // Base case
    if (depth == 0) yield [a, b, c, isNarrow]
    else if (isNarrow) {
        const p = p5.Vector.add(p5.Vector.mult(a, (1 - PHI)), p5.Vector.mult(b, PHI))

        yield* subdivide(p, c, a, false, depth - 1)
        yield* subdivide(c, p, b, true, depth - 1)
    }
    else {
        const q = p5.Vector.add(p5.Vector.mult(b, (1 - PHI)), p5.Vector.mult(a, PHI))
        const r = p5.Vector.add(p5.Vector.mult(b, (1 - PHI)), p5.Vector.mult(c, PHI))
        
        yield* subdivide(q, r, b, false, depth - 1)
        yield* subdivide(r, q, a, true, depth - 1)
        yield* subdivide(r, c, a, false, depth - 1)
    }
}

function orangeAndGreen(isNarrow) {
    strokeWeight(1)
    if (isNarrow) fill(255, 200, 150)
    else fill(150, 255, 200)
    stroke(100, 100, 50)
}

function crumpledPaper() {
    const p = Math.random()

    noStroke()
    fill((1 - p)*100 + p*200)
}
