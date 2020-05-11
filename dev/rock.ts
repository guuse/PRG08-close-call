/// <reference path="gameObject.ts"/>

class Rock extends gameObject {

    private speed: number = 0;
    private g: number = 0; // gravity
    private rotation: number = 0;
    private rotationSpeed: number = 0;

    constructor(index) {
        super();

        this.X = Math.random() * 400 + 400;
        this.Y = (70 * index) + 80;

        let parent: HTMLElement = document.getElementById("container");
        parent.appendChild(this)
    }

    public move(): void {
        // speed optellen zo lang we niet de bodem raken
        // speed wordt hoger dan 0 zodra de auto de rots raakt
        this.X += this.speed;
        this.Y += this.g;
        this.speed *= 0.98;
        this.rotation += this.rotationSpeed;

        if (this.Y + this.clientHeight > document.getElementById("container").clientHeight) {
            this.speed = 0;
            this.g = 0;
            this.rotationSpeed = 0
        }

        //teken de div op de juiste positie
        super.move()
    }

    private crash(gameObject: Car) {
        this.g = 9.81;
        this.speed = gameObject.Speed;
        this.rotationSpeed = 5
    }

    public onCollision(gameObject: Car): void {
        this.crash(gameObject);
    }
}

window.customElements.define("rock-component", Rock as any)
