import { ui } from "./../ui/layaMaxUI";
import GameControl from "./GameControl"

export default class Game extends ui.game.GameUI {
    static instance: Game;

    private _control: GameControl;
    private _containerBall: Laya.Sprite;
    private _containerGoal: Laya.Sprite;

    private _startX: number;
    private _startY: number;
    private _endX: number;
    private _endY: number;

    private _middle: number;
    private _middleLeft: number;
    private _middleRight: number;

    constructor() {
        super();

        Game.instance = this;
    }

    onEnable(): void {
        this._control = this.getComponent(GameControl);
        this._containerGoal = this.getChildByName('container_goal') as Laya.Sprite;
        const containerBall = this._containerBall = this.getChildByName('container_ball') as Laya.Sprite;

        this._startX = 0;
        this._startY = 0;
        this._endX = containerBall.width;
        this._endY = containerBall.height;

        this._middle = containerBall.width / 2;
        this._middleLeft = containerBall.width / 2 - 22;
        this._middleRight = containerBall.width / 2 + 22;

        this._startX += 22;
        this._startY += 22;
        this._endX -= 22;
        this._endY -= 22;

        // this.showRect();
    }

    getCollisionCoordinate() {
        return {
            startX: this._startX,
            startY: this._startY,
            endX: this._endX,
            endY: this._endY,

            middle: this._middle,
            middleLeft: this._middleLeft,
            middleRight: this._middleRight,
        };
    }
    /**
     * 展示碰撞框
     */
    showRect(): void {
        const line = new Laya.Sprite();

        line.graphics.drawRect(this._middle, 0, 2, 500, '#ff0000');
        line.graphics.drawRect(this._middleLeft, 0, 2, 500, '#ff0000');
        line.graphics.drawRect(this._middleRight, 0, 2, 500, '#ff0000');
        line.graphics.drawRect(this._startX, 0, 2, 500, '#ff0000');
        line.graphics.drawRect(this._endX, 0, 2, 500, '#ff0000');
        line.graphics.drawRect(0, this._startY, 900, 2, '#ff0000');
        line.graphics.drawRect(0, this._endY, 900, 2, '#ff0000');

        this.addChild(line);
    }
}