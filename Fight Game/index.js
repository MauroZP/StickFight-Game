const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576
const gravity = 0.8

c.fillRect(0, 0, canvas.width, canvas.height);

//Personajes
class Sprite {
    constructor({position, velocity, color, offset} ){
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBoxUp = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.attackBoxDown = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttackingUp
        this.isAttackingDown
    }

    draw(){
        //Creación de jugadores
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //Creación de ataques
        if(this.isAttackingUp){
            c.fillStyle = 'red'
            c.fillRect(this.attackBoxUp.position.x, this.attackBoxUp.position.y, this.attackBoxUp.width, this.attackBoxUp.height)
        }
        if(this.isAttackingDown){
            c.fillStyle = 'white'
            c.fillRect(this.attackBoxDown.position.x, this.attackBoxDown.position.y + 70, this.attackBoxDown.width, this.attackBoxDown.height)
        }
    }

    //Logica de los movimientos
    update(){
        this.draw()
        //Ataque 1
        this.attackBoxUp.position.x = this.position.x + this.attackBoxUp.offset.x
        this.attackBoxUp.position.y = this.position.y
        //Ataque 2
        this.attackBoxDown.position.x = this.position.x + this.attackBoxDown.offset.x
        this.attackBoxDown.position.y = this.position.y

        //Movimientos izq derecha
        this.position.x += this.velocity.x
        //Movimiento de salto
        this.position.y += this.velocity.y

        //Se agrega un efecto de gravedad del jugador que cuando está por encima de la altura del canva caiga hasta llegar a 0
        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else this.velocity.y += gravity
    }

    attackUp(){
        this.isAttackingUp = true
        setTimeout(() => {
            this.isAttackingUp = false
        }, 100)
    }
    attackDown(){
        this.isAttackingDown = true
        setTimeout(() => {
            this.isAttackingDown = false
        }, 100)
    }
    
}

//Constantes
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 973,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'green',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },    
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
}

function collitionRectUp({collRect1, collRect2}){
    return(
        collRect1.attackBoxUp.position.x + collRect1.attackBoxUp.width >= collRect2.position.x
        && collRect1.attackBoxUp.position.x <= collRect2.position.x + collRect2.width
        && collRect1.attackBoxUp.position.y + collRect1.attackBoxUp.height >= collRect2.position.y
        && collRect1.attackBoxUp.position.y <= collRect2.position.y + collRect2.height
    )
}
//FIXME: Error golpe bajo no registrandose
function collitionRectDown({collRect1, collRect2}){
    return(
        collRect1.attackBoxDown.position.x + collRect1.attackBoxDown.width >= collRect2.position.x
        && collRect1.attackBoxDown.position.x <= collRect2.position.x + collRect2.width
        && collRect1.attackBoxDown.position.y + collRect1.attackBoxDown.height >= collRect2.position.y
        && collRect1.attackBoxDown.position.y <= collRect2.position.y + collRect2.height
    )
}

//Animacion de movimientos
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }

    //Second Player
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }

    //Colisiones
    //Player
    //Golpe alto
    if(collitionRectUp({collRect1: player, 
                        collRect2: enemy}) 
        && player.isAttackingUp){
            
        player.isAttackingUp = false
        console.log('attack')
    }
    //Golpe bajo
    if(collitionRectDown({collRect1: player, 
                          collRect2: enemy})
        && player.isAttackingDown){

        player.isAttackingDown = false
        console.log('attack')
    }

    //Player 2
    if(collitionRectUp({collRect1: enemy, 
                        collRect2: player}) 
        && enemy.isAttackingUp){
            
        enemy.isAttackingUp = false
        console.log('attack')
    }
    //Golpe bajo
    if(collitionRectDown({collRect1: enemy, 
                          collRect2: player})
        && enemy.isAttackingDown){

        enemy.isAttackingDown = false
        console.log('attack')
    }
}

animate()

//Chequeo de las teclas
window.addEventListener('keydown', (event) => {
    switch(event.key){
//Player
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -15
            break
        case 's':
            //
            break
        case 'g':
            player.attackUp()
            break
        case 'h':
            player.attackDown()
            break

//Second Player
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case 'ArrowDown':
            //
            break
        case '4':
            enemy.attackUp()
            break
        case '5':
            enemy.attackDown()
            break
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key){
//Player
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            //
            break
    }

//Second Player
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowDown':
            //
            break
    }
})