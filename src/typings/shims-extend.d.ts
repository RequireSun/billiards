declare module '*.ts' {
    interface Ball {
        startMove(xForce: number, yForce: number): void;
    }

    interface Game {
        handlerGoal(): void;
    }
}