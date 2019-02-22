import Ball from './Ball';
/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
export default class GameControl extends Laya.Script {
    private _gameBox: Laya.Sprite;

    constructor() { 
        super(); 
    }

    onEnable(): void {
        this._gameBox = this.owner.getChildByName("gameBox") as Laya.Sprite;
    }

    onStageClick(e: Laya.Event): void {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();

        let ball: Ball = this._gameBox.getChildByName('ball_white') as any;
        ball.startMove();
        
        //舞台被点击后，使用对象池创建子弹
        // let flyer: Laya.Sprite = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
        // flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        // this._gameBox.addChild(flyer);
    }
}