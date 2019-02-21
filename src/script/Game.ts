import { ui } from "./../ui/layaMaxUI";
import GameControl from "./GameControl"

export default class Game extends ui.game.GameUI {
    private _control: GameControl;

    constructor() {
        super();
    }

    onEnable(): void {
        this._control = this.getComponent(GameControl);
    }
}