export default class Game {
    constructor() {
        this.points = {
            '1': 40,
            '2': 100,
            '3': 300,
            '4': 1200
        };

        this.reset();
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.topOut = false;
    }
    get level() {
        return Math.floor(this.lines * 0.1);
    }

    createPlayfield() {
        let playfield = [];
        for (let i = 0; i < 20; i++) {
            playfield[i] = new Array(10).fill(0);
        }
        return playfield;
    }

    createPiece() {
        let index = Math.floor(Math.random() * 7);
        let piece = {};
        switch (index) {
            case 0:
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 1:
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 2, 2, 0],
                    [0, 2, 2, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 2:
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 0],
                    [0, 3, 3]
                ];
                break;
            case 3:
                piece.blocks = [
                    [0, 0, 0],
                    [0, 4, 4],
                    [4, 4, 0]
                ];
                break;

            case 4:
                piece.blocks = [
                    [0, 0, 0],
                    [5, 5, 5],
                    [0, 0, 5]
                ];
                break;

            case 5:
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [6, 0, 0]
                ];
                break;

            case 6:
                piece.blocks = [
                    [0, 0, 0],
                    [0, 7, 0],
                    [7, 7, 7]
                ];
                break;
            default:
                throw new Error('Фигура не определена');
        }
        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;
        return piece;
    }

    rotate() {
        const blocks = this.activePiece.blocks;
        let temp = [];
        let length = blocks.length;
        for (let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0);
        }

        for (let x = 0; x < length; x++) {
            for (let y = 0; y < length; y++) {
                temp[x][y] = blocks[(length - 1) - y][x];
            }
        }

        this.activePiece.blocks = temp;
        if (this.hasCollision()) {
            this.activePiece.blocks = blocks;
        }
    }
    movePieceRight() {
        this.activePiece.x += 1;
        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }
    movePieceLeft() {
        this.activePiece.x -= 1;
        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }
    movePieceDown() {
        if(this.topOut) return;

        this.activePiece.y += 1;
        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updatePicec();
        }
        if(this.hasCollision()) {
            this.topOut = true;
        }
    }

    hasCollision() {
        const playfield = this.playfield;
        const { x: posX, y: posY, blocks } = this.activePiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] &&
                    ((playfield[posY + y] === undefined || playfield[posY + y][posX + x] === undefined) ||
                        playfield[posY + y][posX + x])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        const playfield = this.playfield;
        const { x: posX, y: posY, blocks } = this.activePiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[y + posY][x + posX] = blocks[y][x];
                }
            }
        }
    }

    clearLines() {
        let lines = [];
        const rows = 20;
        const colums = 10;

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < colums; x++) {
                if (this.playfield[y][x]) {
                    numberOfBlocks++;
                }
            }
            if (numberOfBlocks === 0) {
                break;
            } else if (numberOfBlocks < colums) {
                continue;
            } else if (numberOfBlocks === 10) {
                lines.unshift(y);
            }
        }
        for(let index of lines) {
            this.playfield.splice(index, 1);
            this.playfield.unshift(new Array(colums).fill(0));
        }
        return lines.length;
    }

    updateScore(clearLines) {
        if(clearLines > 0) {
            this.score += this.points[clearLines] * (this.level + 1);
            this.lines += clearLines;
        }
    }

    updatePicec() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }

    getStatus() {
        const { x: posX, y: posY, blocks } = this.activePiece;
        let playfield = this.createPlayfield();

        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }
        for (let i = 0; i < this.playfield.length; i++) {
            playfield[i] = [];
            for (let j = 0; j < this.playfield[i].length; j++) {
                playfield[i][j] = this.playfield[i][j];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[posY + y][posX + x] = blocks[y][x];
                }

            }
        }
        return {
            playfield,
            lines: this.lines,
            level: this.level,
            score: this.score,
            nextPiece: this.nextPiece.blocks,
            isGameOver: this.topOut
        };
    }
}