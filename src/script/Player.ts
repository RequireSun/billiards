'use strict';

import { ui } from './../ui/layaMaxUI';

export default class Player extends Laya.Script {
    name: string;
    avatar: string;

    constructor() { 
        super(); 
    }

    onEnable(): void {
        const elName = this.owner.getChildByName('name') as Laya.Label;
        const elAvatar = this.owner.getChildByName('avatar') as Laya.Image;

        const elMask = new Laya.Sprite();

        // 注意, arcTo 的端点 1 是两端点位置切线的交点
        var path =  [
            ["moveTo", 10, 0],
            ['lineTo', 40, 0],
            ["arcTo", 50, 0, 50, 10, 10],
            ['lineTo', 50, 40],
            ["arcTo", 50, 50, 40, 50, 10],
            ['lineTo', 10, 50],
            ["arcTo", 0, 50, 0, 40, 10],
            ['lineTo', 0, 10],
            ["arcTo", 0, 0, 10, 0, 10],
        ];

        elMask.graphics.drawPath(0, 0, path, { fillStyle: '#ff0000' });
        elMask.pos(0, 0);

        // this.owner.addChild(elMask);
        elAvatar.mask = elMask;

        if (this.avatar) {}
    }
}
