class Piece  {
    shape: number[][];
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;

    constructor(shape: number[][], ctx: CanvasRenderingContext2D) {
        this.shape = shape;
        this.ctx = ctx;
        // x and y are upper left of shape array
        this.x = COLS / 2 - Math.floor(this.shape.length / 2);
        this.y = this.shape.length == 4? -2 : this.shape.length * -1;
    }

    showSelf(): void {
        this.shape.forEach( (row, i) => row.forEach( (tile, j) => {
            if (tile != 0) {
                drawRect(this.ctx, (this.x + j) * SQ, (this.y + i) * SQ, SQ, SQ, COLORS[tile]);
            } 
        }))
    }
}