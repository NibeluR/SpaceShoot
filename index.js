const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720

var backmusic = new Audio('sound/loop.mp3');
backmusic.volume = 0.5;
backmusic.play();

class Player {
    constructor () {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1
        
        const image = new Image()
        image.src = './img/spaceship.png' //player image model
        image.onload = () => {
            const scale = 0.05 //player image size
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }
    

    draw () {
        //c.fillStyle = 'red' //debug lines only
        //c.fillRect (this.position.x, this.position.y, this.width, this.height)
        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        )

        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
        c.restore()
    }

    update() {
        if (this.image) {
        this.draw()
        this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 5 //Projectile size when shooting
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = "red"
        c.fill()
        c.closePath()
        
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
} 

class Particle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius //Particle radius after killing invaders
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
        
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades)
        this.opacity -= 0.01
    }
} 

class invaderProjectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.width = 6 //enemy invader projectile size horizontal
        this.height = 15 //enemy invader projectile size vertical
    }

    draw() {
        c.fillStyle = 'yellow'  //color for enemy invader projectiles
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
} 

class Invader {
    constructor ( {position} ) {
        this.velocity = {
            x: 0,
            y: 0
        }
        
        const image = new Image()
        image.src = './img/spaceinvader.png' //player image model
        image.onload = () => {
            const scale = 0.04 //invader image size
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    

    draw () {
        //c.fillStyle = 'red' //debug lines only
        //c.fillRect (this.position.x, this.position.y, this.width, this.height)

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
    }

    update({velocity}) {
        if (this.image) {
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
        }
    }
    
    shoot(invaderProjectiles){
        invaderProjectiles.push(new invaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 50 // horizontal edges for Invaders not to leave screen

        for (let x = 0; x < columns; x++) {
        
            for (let y = 0; y < rows; y++) {
                this.invaders.push (
                    new Invader({
                        position: {
                            x: x * 50, //Horizontal Interval between Invaders
                            y: y * 50  //Vertical Interval between Invaders
                        }
                    })
                )
            }
        }
        console.log(this.invaders)
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = - this.velocity.x
            this.velocity.y = 50  //position to lower invaders after touching edges
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

const keys = {
    a: {
        pressed:false
    },
    d: {
        pressed:false
    },
    z: {
        pressed:false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true
}
let score = 0

for (let i = 0; i < 150; i++) { //amount of stars for background
    particles.push
        (new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 0.5 //stars speed for background
            },
            radius: Math.random() * 3,
            color: 'white' //Particle color for background stars
        })
    )
}

function createParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            }, 
            radius: Math.random() * 2, 
            color: color || 'purple', //Particle color after killing invader
            fades
        }))
        }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black' //background texture is BLACK
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius 
        }

        if (particle.opacity <= 0) {
            setTimeout (() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
        
    })

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()

        // projectile hits player
        if (invaderProjectile.position.y + invaderProjectile.height >= 
            player.position.y && invaderProjectile.position.x + invaderProjectile.width >= 
            player.position.x && invaderProjectile.position.x <= player.position.x + player.width) {

            console.log('your ship is destroyed')
                
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true

                //play death-sound when hit by projectile
                document.getElementById('p-death').play();
                audio.volume = 0.2; //volume
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 2000)

            createParticles({
                object: player,
                color: 'red',
                fades: true
            })
        }
        //show restart button on death
        if (game.over) {
            showButton();
        }
    })

    //show restart button on death
    function showButton() {
        // Get the button element
        var button = document.getElementById("restart-button");
        button.addEventListener("click", function() {
            location.reload();
        });
        // Set the display style of the button to "block"
        button.style.display = "block";
    }
    
    projectiles.forEach ((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }   else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
            //spawn projectiles for Invaders
    if (frames % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        //play sound when invader shoot projectile
        document.getElementById('e-shoot').play();
 
    }


        

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <= 
                        invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= 
                        invader.position.x && 
                    projectile.position.x - projectile.radius <= 
                        invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= 
                        invader.position.y
                    ) {


                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )
                        //killing invaders and projectiles
                        if (invaderFound && projectileFound) {
                            score += 50
                            scoreEl.innerHTML = score

                            createParticles({
                                object: invader,
                                fades: true
                            })


                        grid.invaders.splice(i, 1)
                        projectiles.splice(j, 1)

                        //play death-sound for invaders when hit
                        document.getElementById('e-death').play();
                        audio.volume = 0.2; //volume
                        
                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders [grid.invaders.length - 1]

                            grid.width = 
                                lastInvader.position.x - 
                                firstInvader.position.x + 
                                lastInvader.width
                            grid.position.x = firstInvader.position.x
                        }   else {
                            grids.splice(gridIndex, 1)
                        }
                    }

                    }, 0)

                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -8 //Speed player value LEFT
        player.rotation = -0.10 //Rotation when moving LEFT
    }else if (keys.d.pressed && player.position.x +player.width <= canvas.width) {
        player.velocity.x = 8 //Speed player value RIGHT
        player.rotation = 0.10 //Rotation when moving RIGHT
    }else {                    //idle position
        player.velocity.x = 0
        player.rotation = 0
    }

    console.log(frames)
    //Spawn invaders for grids
    if (frames % randomInterval  === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }

    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
    if (game.over) return

    switch (key) {
        case 'a': //move left
            console.log ('left')
            keys.a.pressed = true
            break
        case 'd': //move right
            console.log ('right')
            keys.d.pressed = true
            break
        case ' ': //shoot rockets space
            console.log (' ')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                })
            )
            keys.z.pressed = true
            break
        }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a': //move left
            console.log ('left')
            keys.a.pressed = false
            break
        case 'd': //move right
            console.log ('right')
            keys.d.pressed = false
            break
        case ' ': //shoot rockets space
            console.log (' ')
            keys.z.pressed = false
            
            //SHOOT SOUND EFFECT WHEN PRESSING SPACE BUTTON
            var playersound = document.getElementById('shoot').play();
            break
    }
})