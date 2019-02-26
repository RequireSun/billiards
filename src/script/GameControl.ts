import Ball from './Ball';
/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
export default class GameControl extends Laya.Script {
    static instance: GameControl;

    private _containerBall: Laya.Sprite;

    constructor() {
        super(); 
    }

    onEnable(): void {
        this._containerBall = this.owner.getChildByName("container_ball") as Laya.Sprite;
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
}