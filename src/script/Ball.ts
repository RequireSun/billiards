import { ui } from "./../ui/layaMaxUI";
/**
 * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
 */
export default class Ball extends Laya.Script {
    /** @prop { name: number, tips:"球的号码，0 代表白球", type: int}*/
    number: number;

    private _startX: number;
    private _startY: number;
    private _endX: number;
    private _endY: number;

    private _middleLeft: number;
    private _middleRight: number;

    constructor() { 
        super(); 
    }

    // onEnable(): void {
    //     //设置初始速度
    //     var rig: Laya.RigidBody = this.owner.getComponent(Laya.RigidBody);
    //     rig.setVelocity({ x: 0, y: -10 });
    // }

    onEnable(): void {
        if (this.number) {
            const label: Laya.Label = this.owner.getChildByName('label') as Laya.Label;
    
            label.text = `${this.number}`;
        }

        const parent = this.owner.parent as Laya.Sprite;

        this._startX = 22;//parent.x;
        this._startY = 22;//parent.y;
        this._endX = /*this._startX + */parent.width;
        this._endY = /*this._startY + */parent.height;

        this._middleLeft = parent.width / 2 - 22;
        this._middleRight = parent.width / 2 + 22;

        this._startX += 22;
        this._startY += 22;
        this._endX -= 22;
        this._endY -= 22;

        Object.defineProperty(this.owner, 'startMove', {
            enumerable: false,
            value(xForce: number, yForce: number): void {
                var rig: Laya.RigidBody = this.getComponent(Laya.RigidBody);

                rig.setVelocity({ x: xForce, y: yForce });
            },
        });
    }

    onUpdate(): void {
        const owner = this.owner as Laya.Sprite;

        const { x, y } = owner;

        if (x < this._startX) {
            if (y < this._startY) {
                console.log('左上洞');
            } else if (y > this._endY) {
                console.log('左下洞');
            }
        } else if (x > this._endX) {
            if (y < this._startY) {
                console.log('右上洞');
            } else if (y > this._endY) {
                console.log('右下洞');
            }
        } else if (y < this._startY) {
            if (x > this._middleLeft && x < this._middleRight) {
                console.log('中上洞');
            }
        } else if (y > this._endY) {
            if (x > this._middleLeft && x < this._middleRight) {
                console.log('中下洞');
            }
        }
        // 其他情况就是在桌子中间了
    }

    // startMove(): void {
    //     console.log('start move');
    //     var rig: Laya.RigidBody = this.owner.getComponent(Laya.RigidBody);
    //     const x: number = (.5 < Math.random() ? 1 : -1) * Math.random() * 10;
    //     const y: number = (.5 < Math.random() ? 1 : -1) * Math.random() * 10;

    //     rig.setVelocity({ x, y });
    // }

    // onUpdate(): void {
    //     // const owner: Laya.Sprite = this.owner as Laya.Sprite;

    //     // console.log('x: ', owner.x, '; y: ', owner.y);
    // //     //如果子弹超出屏幕，则移除子弹
    // //     if ((this.owner as Laya.Sprite).y < -10) {
    // //         this.owner.removeSelf();
    // //     }
    // }

    // onDisable(): void {
    //     //子弹被移除时，回收子弹到对象池，方便下次复用，减少对象创建开销
    //     Laya.Pool.recover("bullet", this.owner);
    // }
}