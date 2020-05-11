class gameObject extends HTMLElement {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    get X() {
        return this.x;
    }
    set X(value) {
        this.x = value;
    }
    get Y() {
        return this.y;
    }
    set Y(value) {
        this.y = value;
    }
    get width() {
        return this.clientWidth;
    }
    get height() {
        return this.clientHeight;
    }
    move() {
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this.X}px,${this.Y}px)`;
    }
    checkCollision(gameObject) {
        return (gameObject.X < this.X + this.width &&
            gameObject.X + gameObject.width > this.X &&
            gameObject.Y < this.Y + this.height &&
            gameObject.Y + gameObject.height > this.Y);
    }
}
window.customElements.define("gameobject-component", gameObject);
class Wheel extends gameObject {
    constructor(car, offsetCarX) {
        super();
        this.style.transform = `translate(${offsetCarX}px, 30px)`;
        car.appendChild(this);
    }
    onCollision(gameObject) {
    }
}
window.customElements.define("wheel-component", Wheel);
class Car extends gameObject {
    constructor(yIndex, game) {
        super();
        this.speed = Math.random() * 2 + 1;
        this.braking = false;
        this.stopped = false;
        this.game = game;
        this.X = 0;
        this.Y = (70 * yIndex) + 80;
        new Wheel(this, 105);
        new Wheel(this, 20);
        document.addEventListener("keydown", (e) => this.handleKeyDown(e));
        this.addEventListener("click", (e) => this.handleMouseClick(e));
        let parent = document.getElementById("container");
        parent.appendChild(this);
    }
    get Speed() {
        return this.speed;
    }
    handleMouseClick(e) {
        this.braking = true;
        this.changeColor(80);
    }
    handleKeyDown(e) {
        if (e.key == ' ') {
            this.braking = true;
        }
    }
    move() {
        this.X += this.speed;
        if (this.braking)
            this.speed *= 0.98;
        if (this.speed < 0.5)
            this.speed = 0;
        if (this.speed == 0 && this.braking && !this.stopped) {
            this.changeColor(80);
            this.game.addScore(this.X);
            this.braking = false;
            this.stopped = true;
        }
        super.move();
    }
    changeColor(deg) {
        this.style.filter = `hue-rotate(${deg}deg)`;
    }
    crash() {
        this.speed = 0;
        this.braking = false;
        this.changeColor(300);
    }
    onCollision(gameObject) {
        this.crash();
    }
}
window.customElements.define("car-component", Car);
class Game {
    constructor() {
        this.gameObjects = [];
        this.score = 0;
        this.request = 0;
        this.gameover = false;
        for (let i = 0; i < 6; i++) {
            this.addCarWithRock(i);
        }
        this.gameLoop();
    }
    addCarWithRock(index) {
        this.gameObjects.push(new Car(index, this));
        this.gameObjects.push(new Rock(index));
    }
    gameLoop() {
        for (let gameObject of this.gameObjects) {
            gameObject.move();
        }
        this.checkCollision();
        this.request = requestAnimationFrame(() => this.gameLoop());
    }
    checkCollision() {
        for (let carGameObject of this.gameObjects) {
            if (carGameObject instanceof Car) {
                for (let rockGameObject of this.gameObjects) {
                    if (rockGameObject instanceof Rock) {
                        if (rockGameObject.checkCollision(carGameObject)) {
                            carGameObject.onCollision(carGameObject);
                            rockGameObject.onCollision(carGameObject);
                            this.gameOver();
                        }
                    }
                }
            }
        }
    }
    gameOver() {
        this.gameover = true;
        document.getElementById("score").innerHTML = "Game Over";
        cancelAnimationFrame(this.request);
    }
    addScore(x) {
        if (!this.gameover) {
            this.score += Math.floor(x);
            this.draw();
        }
    }
    draw() {
        document.getElementById("score").innerHTML = "Score : " + this.score;
    }
}
window.addEventListener("load", () => new Game());
class Rock extends gameObject {
    constructor(index) {
        super();
        this.speed = 0;
        this.g = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.X = Math.random() * 400 + 400;
        this.Y = (70 * index) + 80;
        let parent = document.getElementById("container");
        parent.appendChild(this);
    }
    move() {
        this.X += this.speed;
        this.Y += this.g;
        this.speed *= 0.98;
        this.rotation += this.rotationSpeed;
        if (this.Y + this.clientHeight > document.getElementById("container").clientHeight) {
            this.speed = 0;
            this.g = 0;
            this.rotationSpeed = 0;
        }
        super.move();
    }
    crash(gameObject) {
        this.g = 9.81;
        this.speed = gameObject.Speed;
        this.rotationSpeed = 5;
    }
    onCollision(gameObject) {
        this.crash(gameObject);
    }
}
window.customElements.define("rock-component", Rock);
//# sourceMappingURL=main.js.map