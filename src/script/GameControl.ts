'use strict';

import Game from './Game';
import Ball from './Ball';
import Player from './Player';

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
    private _playerLeft: Laya.Sprite;
    private _playerRight: Laya.Sprite;

    /**
     * 目前 0 代表 left 1 代表 right
     */
    private _playerCurrent: number;
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

    private _flags: {
        goalThisTurn: number[],
    } = {
        goalThisTurn: [],
    };

    constructor() {
        super(); 
    }

    onEnable(): void {
        this._containerBall = this.owner.getChildByName("container_ball") as Laya.Sprite;
        this._playerLeft = this.owner.getChildByName('player_left') as Laya.Sprite;
        this._playerRight = this.owner.getChildByName('player_right') as Laya.Sprite;

        this.addListeners();
    }

    onDisable(): void {
        this.removeListeners();
    }

    onStageClick(e: Laya.Event): void {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();

        // 如果球在动, 就不让继续击球了
        if ((this.owner as Game).isBallRunning) {
            return;
        }

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
        // 因为使用事件系统会导致进球判定变成异步且会重入, 因而在这里改成了直接把函数定义上去的方法
        Object.defineProperty(this.owner, 'handlerGoal', {
            enumerable: false,
            value: (number: number) => this.handlerGoal(number),
        });

        this.owner.on('ball.all.stop', this, this.judgeShot);
    }

    removeListeners(): void {
        // this.owner.off('ball.goal', this, this.handlerGoal);
        Object.defineProperty(this.owner, 'handlerGoal', {
            enumerable: false,
        });

        this.owner.off('ball.all.stop', this, this.judgeShot);
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
        this._flags.goalThisTurn.push(number);
    }

    judgeShot(): void {
        const goalThisTurn = this._flags.goalThisTurn;

        if (goalThisTurn.length) {
            if (-1 < goalThisTurn.indexOf(0)) {
                // TODO
                // 可能需要罚杆？
                // 是不是进球全不算？
            }

            if (-1 < goalThisTurn.indexOf(8)) {
                // TODO 8 号球进了怎么算
            }

            if (-1 < goalThisTurn.findIndex((number: number): boolean => 0 !== number && 8 !== number)) {
                const playerLeft: Player = this._playerLeft.getComponent(Player);
                const playerRight: Player = this._playerRight.getComponent(Player);
    
                if (undefined === playerLeft.target && undefined === playerRight.target) {
                    // this._playerCurrent
                    const firstBall: number = goalThisTurn.find((number: number) => 0 !== number && 8 !== number);

                    if ((0 === this._playerCurrent && 8 > firstBall) || ( 1 === this._playerCurrent && 8 < firstBall)) {
                        // 左玩家进了整球, 或者右玩家进了半球, 就是左整右半
                        playerLeft.target = 0;
                        playerRight.target = 1;
                    } else {
                        // 否则就是左半右整
                        playerLeft.target = 1;
                        playerRight.target = 0;
                    }
                }
            }

            this._flags.goalThisTurn = [];
        }

        this._playerCurrent = 0 === this._playerCurrent ? 1 : 0;
    }
}