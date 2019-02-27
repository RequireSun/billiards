'use strict';

import { ui } from "./../ui/layaMaxUI";
import Game from './Game';

const initialPositionWhite: Laya.Point = new Laya.Point(140, 208);

/**
 * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
 */
export default class Ball extends Laya.Script {
    /** @prop { name: number, tips:"球的号码，0 代表白球", type: int}*/
    number: number;

    isInitialized: boolean = false;

    constructor() {
        super(); 
    }

    onEnable(): void {
        if (!this.isInitialized) {
            // 测试时候没有皮肤, 用的白球 + 数字
            // if (this.number) {
            //     const label: Laya.Label = this.owner.getChildByName('label') as Laya.Label;
        
            //     label.text = `${this.number}`;
            // }
    
            Object.defineProperty(this.owner, 'startMove', {
                enumerable: false,
                value(xForce: number, yForce: number): void {
                    var rig: Laya.RigidBody = this.getComponent(Laya.RigidBody);
    
                    rig.setVelocity({ x: xForce, y: yForce });

                    // 因为 game 里是个定时器, 所以存在刚点白球的时候连击可以多次击球的问题
                    Game.instance.isBallRunning = true;
                },
            });

            this.isInitialized = true;
        }
    }

    onDisable(): void {}

    onUpdate(): void {
        const owner = this.owner as Laya.Sprite;

        const { x, y } = owner;

        const { startX, startY, endX, endY, middle, middleLeft, middleRight } = Game.instance.getCollisionCoordinate();

        const rig: Laya.RigidBody = this.owner.getComponent(Laya.RigidBody)
        const { x: currentX, y: currentY } = rig.linearVelocity;

        // 球最后零点几的位移基本看不出来了, 这时候再继续等待实在是太智障了
        if (3 > x && -3 < x && 3 > y && -3 < y) {
            // 因为这个都是碰撞操作, 所以一般不太可能出现非线性降速, 应该都能触发这个东西
            if (0 !== x && 0 !== y) {
                rig.setVelocity({ x: 0, y: 0, });
                // if (Game.instance.ballRunning[this.number]) {
                //     Game.instance.ballRunning[this.number] = false;
                // }
            }
        } else {
            // 只有是非动状态才会置为动
            // if (!Game.instance.ballRunning[this.number]) {
            //     Game.instance.ballRunning[this.number] = true;
            // }
        }

        if (x < startX) {
            if (y < startY) {
                if (22 > Math.sqrt(x ** 2 + y ** 2)) {
                    console.log('左上洞');
                    this.handlerGoal();
                }
            } else if (y > endY) {
                if (22 > Math.sqrt(
                    ((22 - (startX - x)) ** 2) + 
                    ((22 - (y - endY)) ** 2)
                )) {
                    console.log('左下洞');
                    this.handlerGoal();
                }
            }
        } else if (x > endX) {
            if (y < startY) {
                if (22 > Math.sqrt(
                    ((22 - (x - endX)) ** 2) + 
                    ((22 - (startY - y)) ** 2)
                )) {
                    console.log('右上洞');
                    this.handlerGoal();
                }
            } else if (y > endY) {
                if (22 > Math.sqrt(
                    ((22 - (x - endX)) ** 2) + 
                    ((22 - (y - endY)) ** 2)
                )) {
                    console.log('右下洞');
                    this.handlerGoal();
                }
            }
        } else if (y < startY) {
            if (x > middleLeft && x < middleRight) {
                if (22 > Math.sqrt(
                    ((x - middle) ** 2) + 
                    ((22 - (startY - y)) ** 2)
                )) {
                    console.log('中上洞');
                    this.handlerGoal();
                }
            }
        } else if (y > endY) {
            if (x > middleLeft && x < middleRight) {
                if (22 > Math.sqrt(
                    ((x - middle) ** 2) + 
                    ((22 - (y - endY)) ** 2)
                )) {
                    console.log('中下洞');
                    this.handlerGoal();
                }
            }
        }
        // 其他情况就是在桌子中间了
    }

    handlerGoal(): void {
        // if (0 === this.number) {
        //     console.log('白球进了');
        //     (this.owner as Laya.Sprite).pos(initialPositionWhite.x, initialPositionWhite.y);
        // } else {
        //     console.log('进球！', this.number);
        //     // TODO 要计算下下方计分区位置在哪
        //     this.owner.removeSelf();
        //     const containerGoal = Game.instance.container_goal.addChild(this.owner);
        // }
        // Game.instance.event('ball.goal', this.number);
        (Game.instance as any).handlerGoal(this.number);
    }
}