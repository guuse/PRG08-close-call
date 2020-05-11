/// <reference path="gameObject.ts"/>

class Wheel extends gameObject {

    constructor(car: Car, offsetCarX: number) {
        super();

        this.style.transform = `translate(${offsetCarX}px, 30px)`;

        car.appendChild(this)
    }

    public onCollision(gameObject: gameObject): void {
    }
}

window.customElements.define("wheel-component", Wheel as any);
