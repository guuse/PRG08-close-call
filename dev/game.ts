class Game {

    // Fields
    private gameObjects: gameObject[] = [];
    private score: number = 0;
    private request: number = 0;
    private gameover: boolean = false;

    constructor() {
        for (let i = 0; i < 6; i++) {
            this.addCarWithRock(i)
        }

        this.gameLoop()
    }

    private addCarWithRock(index: number) {
        this.gameObjects.push(new Car(index, this));
        this.gameObjects.push(new Rock(index));
    }

    private gameLoop() {
        for (let gameObject of this.gameObjects) {
            gameObject.move()
        }

        this.checkCollision();

        this.request = requestAnimationFrame(() => this.gameLoop())
    }

    private checkCollision() {
        //carGameObject is a generic gameobject but instantly filtered, name is for clarity
        for (let carGameObject of this.gameObjects) {
            if (carGameObject instanceof Car) {
                //rockGameObject is a generic gameobject but instantly filtered, name is for clarity
                for (let rockGameObject of this.gameObjects) {
                    if (rockGameObject instanceof Rock) {
                        if (rockGameObject.checkCollision(carGameObject)){
                            carGameObject.onCollision(carGameObject);
                            rockGameObject.onCollision(carGameObject);
                            this.gameOver();
                        }
                    }
                }
            }
        }
    }

    private gameOver(): void {
        this.gameover = true;
        document.getElementById("score").innerHTML = "Game Over";
        cancelAnimationFrame(this.request)
    }

    public addScore(x: number) {
        if (!this.gameover) {
            this.score += Math.floor(x);
            this.draw();
        }
    }

    private draw() {
        document.getElementById("score").innerHTML = "Score : " + this.score;
    }
}

// load
window.addEventListener("load", () => new Game());
