'use strict';

import Game from './Game';
import Ball from './Ball';

const initialPositionWhite: Laya.Point = new Laya.Point(140, 208);
// 进球后在下方展示区域是否将角度回正 (我感觉不回正也挺好看的)
const isGoalRotationReset: boolean = true;

/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
export default class GameControl extends Laya.Script {
    static instance: GameControl;

    private _containerBall: Laya.Sprite;
    private _goal: { [key: number]: boolean } = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
    };

    constructor() {
        super(); 
    }

    onEnable(): void {
        this._containerBall = this.owner.getChildByName("container_ball") as Laya.Sprite;

        this.addListeners();
    }

    onDisable(): void {
        this.removeListeners();
    }

    onStageClick(e: Laya.Event): void {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();

        // 这个是随机方向生成, 最早开发的时候用的, 现在早就用不到了
        // const x: number = (.5 < Math.random() ? 1 : -1) * Math.random() * 10;
        // const y: number = (.5 < Math.random() ? 1 : -1) * Math.random() * 10;

        let ball = this._containerBall.getChildByName('ball_white') as Laya.Sprite;

        const parent = ball.parent as Laya.Sprite;

        const touchX = e.stageX;
        const touchY = e.stageY;

        const ballX = ball.x + parent.x;
        const ballY = ball.y + parent.y;

        const x: number = (touchX - ballX) / 20;
        const y: number = (touchY - ballY) / 20;

        // 这个是开发时用来判断点击位置和球运行方向用的, 现在已经算好了, 就先隐藏, 以后调试可以继续用
        // console.log(touchX, touchY, ballX, ballY, x, y);

        (ball as any).startMove(x, y);
    }

    addListeners(): void {
        // this.owner.on('ball.goal', this, this.handlerGoal);
        Object.defineProperty(this.owner, 'handlerGoal', {
            enumerable: false,
            value: (number: number) => this.handlerGoal(number),
        });
    }

    removeListeners(): void {
        // this.owner.off('ball.goal', this, this.handlerGoal);
        Object.defineProperty(this.owner, 'handlerGoal', {
            enumerable: false,
        })
    }

    handlerGoal(number: number): void {
        if (0 === number) {
            console.log('白球进了');
            (this._containerBall.getChildByName('ball_white') as Laya.Sprite).pos(initialPositionWhite.x, initialPositionWhite.y);
        } else if (!this._goal[number]) {
            console.log('进球！', number);
            this._goal[number] = true;
            // TODO 要计算下下方计分区位置在哪
            const ballName: string = `ball_${10 > number ? `0${number}`: number}`;
            const ball = this._containerBall.getChildByName(ballName) as Laya.Sprite;

            // 这个 removeSelf 除了直接写在 ball 里面, 否则都会因为时序问题执行多次, 这里为了代码好看, 多写了防重入逻辑
            ball.removeSelf();
            ball.pos(40 * (number - 1) + 30, 25);
            isGoalRotationReset && (ball.rotation = 0);
            (this.owner as Game).container_goal.addChild(ball);
        }
    }
}