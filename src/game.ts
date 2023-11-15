class Game {
    ctx: CanvasRenderingContext2D;
    currentPiece: Piece | null;
    nextPiece: Piece;
    heldPiece: Piece | null;
    paused: boolean
    gameover: boolean
    linesCleared: number;
    score: number;
    grid: number[][]

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;

        this.currentPiece = null;
        this.nextPiece = new Piece(SHAPES[Math.floor(Math.random() * SHAPES.length)], this.ctx);
        this.heldPiece = null;

        this.paused = false;
        this.gameover = false;
        this.linesCleared = 0;
        this.score = 0;

        this.grid = [];
        for (let i = 0; i < ROWS; i++) {
            let row = [];
            for (let j = 0; j < COLS; j++) {
                row.push(0);
            }
            this.grid.push(row);
        }
    }

    reset() {
        this.currentPiece = null;
        this.nextPiece = new Piece(SHAPES[Math.floor(Math.random() * SHAPES.length)], this.ctx);
        this.heldPiece = null;

        this.gameover = false;
        this.linesCleared = 0;
        this.score = 0;

        this.grid = [];
        for (let i = 0; i < ROWS; i++) {
            let row = [];
            for (let j = 0; j < COLS; j++) {
                row.push(0);
            }
            this.grid.push(row);
        }

        this.showSelf();
    }

    // graphics

    showSelf() {
        this.grid.forEach( (row, i) => row.forEach( (tile, j) => {
            drawRect(this.ctx, j * SQ, i * SQ, SQ, SQ, COLORS[tile]);
        }));

        if (this.currentPiece != null) {
            this.showShadow();
            this.currentPiece.showSelf();
        }

        // update score
        let scoreText = document.getElementById('score-ctr');
        if (scoreText !== null) scoreText.textContent = `${this.score}`;
    }

    showShadow() {
        // shalow copy piece and move
        if (this.currentPiece !== null) {
            let shadowPiece = this.currentPiece.shape.map( row => row.map( x => x ) );
            let x = this.currentPiece.x;
            let y = this.currentPiece.y;
            while (!this.collision(x, y + 1, shadowPiece)) {
                y++;
            }
            // show shadow
            shadowPiece.forEach( (row, i) => row.forEach( (tile, j) => {
                if (tile != 0) {
                    drawRect(this.ctx, (x + j) * SQ, (y + i) * SQ, SQ, SQ, COLORS[tile]);
                    drawRect(this.ctx, (x + j) * SQ + 7, (y + i) * SQ + 7, SQ - 14, SQ -14, COLORS[0]);
                }
            }));
        }
        
    }

    // current piece handling

    spawnPiece() {
        // spawn next piece then generate new next piece
        this.currentPiece = this.nextPiece;
        this.nextPiece = new Piece(SHAPES[Math.floor(Math.random() * SHAPES.length)], this.ctx);

        this.showSelf();
    }

    holdPiece() {
        if (this.currentPiece != null) {
            if (this.heldPiece != null) {
                // swap peices
                let temp = this.currentPiece;
                this.currentPiece = this.heldPiece;
                this.heldPiece = temp;

                // reset coords
                this.currentPiece.x = COLS / 2 - Math.floor(this.currentPiece.shape.length / 2);
                this.currentPiece.y = 0;
            } else {
                // for when there's no held piece yet
                this.heldPiece = this.currentPiece;
                this.spawnPiece();
            }
        }

        this.showSelf();
    }

    // piece and grid mechanics

    collision(x: number, y: number, shape: number[][]) {
        // loop through shape array
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                // only check for filled tiles
                if (shape[i][j] != 0) {

                    // p & q represent locations of shape tiles in grid
                    let p = x + j;
                    let q = y + i;

                    // check for in bounds
                    if (p >= 0 && p < COLS && q < ROWS) {
                        // check for collision with set piece in grid
                        if (q >= 0 && this.grid[q][p] != 0) {
                            return true;
                        } 

                    // out of bounds
                    } else {
                        return true;
                    }
                }
            }
        }
        // no collision
        return false;
    }

    setPiece() {
        if (this.currentPiece !== null) {
            for (let i = 0; i < this.currentPiece.shape.length; i++) {
                for (let j = 0; j < this.currentPiece.shape.length; j++) {
                    // p & q represent locations of shape tiles in grid
                    let p = this.currentPiece.x + j;
                    let q = this.currentPiece.y + i;
                    // set piece in grid and ignore pieces above grid (buffer zone)
                    if (q >= 0 && this.currentPiece.shape[i][j] != 0) {
                        this.grid[q][p] = this.currentPiece.shape[i][j];
                    } else if (q < 0) {
                        this.gameover = true;
                    }
                }
            }
            this.currentPiece = null;
        }
        
    }

    getSpeed() {
        if (this.getLevel() < 11) return 1000 - (this.getLevel() - 1 ) * 100;
        else if (this.getLevel() >= 15)  return 50;
        else return 100 - (this.getLevel() - 10) * 10;
    }

    // scoring 

    getLevel() {
        return Math.floor(this.linesCleared / 5) + 1;
    }

    clearLines() {
        let lineAmt = 0; // for calculating score

        this.grid.forEach( (row, i) => {
            // check for full rows by multiplying all tile values
            // together and checking for 0
            let prod = 1;
            row.forEach( tile => prod = prod * tile);
            if (prod != 0) {
                // clear row and add new empty row to top
                this.grid.splice(i, 1);
                this.grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                this.linesCleared++;
                lineAmt++;
            }
        });

        // evaluate score
        switch (lineAmt) {
            case 1:
                this.score += (100 * this.getLevel());
                break;
            case 2:
                this.score += (300 * this.getLevel());
                break;
            case 3:
                this.score += (500 * this.getLevel());
                break;
            case 4:
                this.score += (800 * this.getLevel());
                break;
            default:
                break;
        }

        // update display
        let linesText = document.getElementById('lines-ctr');
        if (linesText !== null) linesText.textContent = `${this.linesCleared}`;
        let levelText = document.getElementById('level-ctr');
        if (levelText !== null) levelText.textContent = `${this.getLevel()}`;
        let scoreText = document.getElementById('score-ctr');
        if (scoreText !== null) scoreText.textContent = `${this.score}`;
    }

    // movement and rotation

    moveDown(): number {
        // check for piece
        if (this.currentPiece != null) {
            let y = this.currentPiece.y;
            if (!this.collision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
                // move down if no collsion
                this.currentPiece.y++;
            } else {
                // set piece if collision
                this.setPiece();
                this.clearLines();
            }
            this.showSelf();
            return y;
        }
        return 0
    }

    moveHorizontal(right: boolean) {
        // check for piece
        if (this.currentPiece != null) {
            // set direction
            let dir = right ? 1 : -1;
            if (!this.collision(this.currentPiece.x + dir, this.currentPiece.y, this.currentPiece.shape)) {
                // move horizontal if no collision
                this.currentPiece.x += dir;
            }
        }
        this.showSelf();
    }

    rotate(clockwise: boolean) {
        // check for piece
        if (this.currentPiece != null) {

            // O piece does not rotate
            if (this.currentPiece.shape.length != 2) {

                // rotate shape array
                let shape = this.currentPiece.shape.map( row => row.map( x => x) );
                
                // clockwise three times for counterclockwise
                let s = clockwise ? 1 : 3;
                while (s > 0) {

                    // transpose shape array
                    for (let i = 0; i < shape.length; i++) {
                        for (let j = 0; j < i; j++) {
                        const temp = shape[i][j];
                        shape[i][j] = shape[j][i];
                        shape[j][i] = temp;
                        }
                    }

                    // reverse every row in shape array
                    shape = shape.map( row => row.reverse());

                    s--;
                }

                // check collisions and move piece accordingly if possible
                let x = this.currentPiece.x,
                    y = this.currentPiece.y;
                if (this.collision(x, y, shape)) {
                    // check if moving the piece up to 2 tiles in both x and y directions works
                    // first, check moving by 1, then by 2
                    for (let c = 1; c <= 2; c++) {
                        for (let i = -1 * c; i <= c; i += c) {
                            for (let j = -1 * c; j <= c; j += c) {
                                if (!this.collision(x + j, y + i, shape)) {
                                    // set shape and move accordingly
                                    this.currentPiece.shape = shape;
                                    this.currentPiece.x = x + j;
                                    this.currentPiece.y = y + i;
                                    this.showSelf();
                                    return;
                                }
                            }
                        }
                    }
                    // no roatation possible
                    this.showSelf();
                    return;
                } else {
                    // set shape if no collision
                    this.currentPiece.shape = shape;
                    this.showSelf();
                    return;
                }
            }
        }
    }

    hardDrop() {
        if (this.currentPiece !== null) {
            let y0 = this.currentPiece.y,
                y1 = y0;
            while (this.currentPiece != null) {
                y1 = this.moveDown();
            }
            this.score += 2 * (y1 - y0) * this.getLevel();
        }
        
    }
}
