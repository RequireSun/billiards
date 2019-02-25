import { ui } from "./../ui/layaMaxUI";
/**
 * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
 */
export default class Ball extends Laya.Script {
    /** @prop { name: number, tips:"球的号码，0 代表白球", type: int}*/
    number: number;

    constructor() { 
        super(); 
    }

    // onEnable(): void {
    //     //设置初始速度
    //     var rig: Laya.RigidBody = this.owner.getComponent(Laya.RigidBody);
    //     rig.setVelocity({ x: 0, y: -10 });
    // }

    onTriggerEnter(other: any, self: any, contact: any): void {
        //如果被碰到，则移除子弹
        // this.owner.removeSelf();
    }

    onEnable(): void {
        if (this.number) {
            const label: Laya.Label = this.owner.getChildByName('label') as Laya.Label;
    
            label.text = `${this.number}`;
        }

        Object.defineProperty(this.owner, 'startMove', {
            enumerable: false,
            value() {
                var rig: Laya.RigidBody = this.getComponent(Laya.RigidBody);
                const x: number = (.5 < Math.random() ? 1 : -1) * Math.random() * 10;
                const y: number = (.5 < Math.random() ? 1 : -1) * Math.random() * 10;

                rig.setVelocity({ x, y });
            },
        });
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