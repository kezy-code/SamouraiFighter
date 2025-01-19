const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.3

const background  = new Sprite({
    position:{
        x:0,
        y:0,
    },
    imageSrc:'./assets/background.png',
})

const shop  = new Sprite({
    position:{
        x:620,
        y:128,
    },
    imageSrc:'./assets/shop.png',
    scale: 2.75,
    framesMax: 6,
})

//PLAYER
const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity:{
        x:0,
        y:10,

    },
    offset :{
        x:0,
        y:0,
    },
    imageSrc:'./assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale : 2,
    offset : {
        x: 180,
        y: 96,
    },
    sprites : {
        idle : {
            imageSrc : './assets/samuraiMack/Idle.png',
            framesMax : 8,
        },
        run : {
            imageSrc : './assets/samuraiMack/Run.png',
            framesMax : 8,
            image : new Image(),
        },
        jump : {
            imageSrc : './assets/samuraiMack/Jump.png',
            framesMax : 2,
            image : new Image(),
        },
        fall : {
            imageSrc : './assets/samuraiMack/Fall.png',
            framesMax : 2,
            image : new Image(),
        },
        attack1 : {
            imageSrc : './assets/samuraiMack/Attack1.png',
            framesMax : 6,
        },
        takeHit : {
            imageSrc : './assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax : 4,
        },
        death : {
            imageSrc : './assets/samuraiMack/Death.png',
            framesMax : 6,
        },
    },
    attackBox : {
        offset : {
            x: 60,
            y: 50
        },
        width : 135,
        height: 50
    }
});

//ENEMY
const enemy = new Fighter({
    position:{
        x: 800,
        y: 100
    },
    velocity:{
        x:0,
        y:0
    },
    color : 'blue',
    offset :{
        x:-50,
        y:0,
    },
    imageSrc:'./assets/kenji/Idle.png',
    framesMax: 4,
    scale : 2,
    offset : {
        x: 180,
        y: 106,
    },
    sprites : {
        idle : {
            imageSrc : './assets/kenji/Idle.png',
            framesMax : 4,
        },
        run : {
            imageSrc : './assets/kenji/Run.png',
            framesMax : 8,
            image : new Image(),
        },
        jump : {
            imageSrc : './assets/kenji/Jump.png',
            framesMax : 2,
            image : new Image(),
        },
        fall : {
            imageSrc : './assets/kenji/Fall.png',
            framesMax : 2,
            image : new Image(),
        },
        attack1 : {
            imageSrc : './assets/kenji/Attack1.png',
            framesMax : 4,
        },
        takeHit : {
            imageSrc : './assets/kenji/Take hit.png',
            framesMax : 3,
        },
        death : {
            imageSrc : './assets/kenji/Death.png',
            framesMax : 7,
        },
    },
    attackBox : {
        offset : {
            x: -150,
            y: 50
        },
        width : 135,
        height: 50
    }
})

enemy.draw()

const keys = {

    //PLAYER KEYS
    q:{
        pressed: false
    },
    d:{
        pressed: false
    },
    z:{
        pressed: false
    },

    //ENEMY KEYS
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
}
decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()

    player.update()
    enemy.update()

    enemy.velocity.x  = 0
    player.velocity.x  = 0

    // PLAYER MOUVEMENT
    if(keys.q.pressed && player.lastKey === 'q'){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //ENEMY MOUVEMENT
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //DETECT COLLISION BY PLAYER
    if(
        rectangularCollision({
            rectangle1 : player, 
            rectangle2 : enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ){
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    //DETECT COLLISION BY ENEMY
    if(
        rectangularCollision({
            rectangle1 : enemy, 
            rectangle2 : player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2 
    ){
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    // END OF GAME
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})

    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead){
    switch (event.key){
        //PLAYER KEY
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'q' :
            keys.q.pressed = true
            player.lastKey = 'q'
            break
        case 'z' :
            player.velocity.y = - 12
            player.lastKey = 'z'
            break
        case 'v':
            player.attack()
            break
    }}

    
    //ENEMY KEY
    if (!enemy.dead){
    switch (event.key){
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            enemy.velocity.y = - 12
            enemy.lastKey = 'ArrowUp'
            break
        case '!':
            enemy.attack()
            break
    }}
})

window.addEventListener('keyup', (event) => {
    switch (event.key){

        //PLAYER KEY
        case 'd' :
            keys.d.pressed = false
            break
        case 'q' :
            keys.q.pressed = false
            break
        case 'z' :
            keys.q.pressed = false
            lastKey = 'z'
            break

        //ENEMY KEY
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false 
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp' :
            break
    }
})