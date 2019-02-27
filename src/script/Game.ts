import { ui } from "./../ui/layaMaxUI";
import GameControl from "./GameControl"

export default class Game extends ui.game.GameUI {
    static instance: Game;

    // ballRunning: { [key: string]: boolean } = {
    //     0: false,
    //     1: false,
    //     2: false,
    //     3: false,
    //     4: false,
    //     5: false,
    //     6: false,
    //     7: false,
    //     8: false,
    //     9: false,
    //     10: false,
    //     11: false,
    //     12: false,
    //     13: false,
    //     14: false,
    //     15: false,
    // };

    private _ballsRigid: { [key: number]: Laya.RigidBody } = {
        0: undefined,
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
        7: undefined,
        8: undefined,
        9: undefined,
        10: undefined,
        11: undefined,
        12: undefined,
        13: undefined,
        14: undefined,
        15: undefined,
    };

    private _isBallRunning: boolean = false;

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

    /**
     * 这个 get set 写的有点傻, 本来以为只需要写 get 的
     */
    get isBallRunning(): boolean {
        return this._isBallRunning;
    }

    set isBallRunning(val: boolean) {
        this._isBallRunning = val;
    }

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

        let tempBall: Laya.Node = containerBall.getChildByName('ball_white');
        if (tempBall) {
            this._ballsRigid[0] = tempBall.getComponent(Laya.RigidBody);
        }

        for (let i = 1, l = 16; i < l; ++i) {
            tempBall = containerBall.getChildByName(`ball_${10 > i ? `0${i}` : i}`);
            if (tempBall) {
                this._ballsRigid[i] = tempBall.getComponent(Laya.RigidBody);
            } else {
                this._ballsRigid[i] = undefined;
            }
        }

        // 反正这个是判断有没有在动的, 跟着帧走应该差不多
        // 一秒一次某些时候等待太久
        Laya.timer.frameLoop(30, this, this.calculateBallStatue);
    }

    onDisable(): void {
        Laya.timer.clear(this, this.calculateBallStatue);
    }

    calculateBallStatue(): void {
        let isRunning: boolean = false;

        for (let key of Object.keys(this._ballsRigid)) {
            if (this._ballsRigid[key]) {
                const { x: currentX, y: currentY } = this._ballsRigid[key].linearVelocity;

                if (currentX && currentY) {
                    isRunning = true;
                }
            }
        }

        this._isBallRunning = isRunning;
        console.log('isBallRunning', this._isBallRunning);
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