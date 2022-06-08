const INIT_SIZE = 600
const PHI = 0.618
const THETA = 3.14159/5

let piePieces
let aabb

function setup() {
    piePieces = [...Array(10).keys()].map(piePiece)

    // for (const piece of piePieces) {
    //     for (const fragment of piece) {
    //         console.log(fragment)
    //     }
    // }
    
    createCanvas(700, 700, WEBGL)
    frameRate(60)
    background(255)
}

function draw() {
    // console.log(mouseX, mouseY)

    for (const piece of piePieces) {
        // for (const subWedge of wedge) {
        //     const [a, b, c, isNarrow] = subWedge
        
        //     orangeAndGreen(isNarrow)
        //     beginShape()
        //     vertex(b.x, b.y)
        //     vertex(a.x, a.y)
        //     vertex(c.x, c.y)
        //     endShape()
        // }
        const [a, b, c, isNarrow] = piece.next().value
    
        // grid()
        // orangeAndGreen(isNarrow)
        // onlyNarrows(isNarrow)
        // onlyWides(isNarrow)
        // crumpledPaper()
        // beginShape()
        // vertex(b.x, b.y)
        // vertex(a.x, a.y)
        // vertex(c.x, c.y)
        // endShape()

        noFill()
        stroke(0, 0, 0)
        // circles1(a, b, c)
        circles2(a, b, c, isNarrow)
    }
}

function piePiece(i) {
    const alpha = (i - 1)*THETA
    const beta = i*THETA

    const a = new p5.Vector(0, 0)
    const b = new p5.Vector(INIT_SIZE*cos(alpha), INIT_SIZE*sin(alpha))
    const c = new p5.Vector(INIT_SIZE*cos(beta), INIT_SIZE*sin(beta))
    
    const points = (i%2 == 0) ? [a, b, c] : [a, c, b]

    return subdivide(...points, true, 7)
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

function grid() {
    strokeWeight(1)
    noFill()
}

function orangeAndGreen(isNarrow) {
    strokeWeight(1)
    if (isNarrow) fill(255, 200, 150)
    else fill(150, 255, 200)
    stroke(100, 100, 50)
}

function onlyNarrows(isNarrow) {
    if (isNarrow) {
        strokeWeight(1)
        fill(150, 255, 200)
        stroke(100, 100, 50)
    } else {
        noStroke()
        noFill()
    }
}

function onlyWides(isNarrow) {
    if (!isNarrow) {
        strokeWeight(1)
        fill(150, 255, 200)
        stroke(100, 100, 50)
    } else {
        noFill()
        noStroke()
    }
}

function crumpledPaper() {
    const p = Math.random()

    noStroke()
    fill((1 - p)*100 + p*200)
}

function circles1(a, b, c) {
    const r = sqrt(pow(b.x - a.x, 2) + pow(b.y - a.y, 2))

    arcBetween(a, b, c, r)
}

function circles2(a, b, c, isNarrow) {
    const r = sqrt(pow(b.x - a.x, 2) + pow(b.y - a.y, 2))
    
    if (isNarrow) {
        arcBetween(a, b, c, r)
    }
    else {
        arcBetween(b, a, c, r)
        arcBetween(c, a, b, r)
    }
}

function arcBetween(a, b, c, r) {
    let alpha = atan2(c.y - a.y, c.x - a.x)
    let beta = atan2(b.y - a.y, b.x - a.x)

    if (alpha < 0) alpha += 2*PI
    if (beta < 0) beta += 2*PI
    
    if (max(alpha, beta) - min(alpha, beta) > PI) {
        arc(a.x, a.y, r, r, max(alpha, beta), min(alpha, beta))
    } else {
        arc(a.x, a.y, r, r, min(alpha, beta), max(alpha, beta))
    }
}
