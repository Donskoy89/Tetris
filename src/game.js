export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 400,
        '4': 800
    };
    constructor() {
        this.reset();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.topOut = false;
    }

    createPlayfield() {
        let playfield = [];
        for (let i = 0; i < 20; i++) {
            playfield[i] = new Array(10).fill(0);
        }
        return playfield;
    }

    createPiece() {
        const activePiece = {};
        let index = Math.floor(Math.random() * 7);

        switch (index) {
            case 0:
                //stick
                activePiece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 1:
                //block
                activePiece.blocks = [
                    [0, 0, 0, 0],
                    [0, 2, 2, 0],
                    [0, 2, 2, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 2:
                //Z
                activePiece.blocks = [
                    [0, 0, 0],
                    [3, 3, 0],
                    [0, 3, 3]
                ];
                break;
            case 3:
                //Z morror
                activePiece.blocks = [
                    [0, 0, 0],
                    [0, 4, 4],
                    [4, 4, 0]
                ];
                break;
            case 4:
                //L
                activePiece.blocks = [
                    [0, 0, 0],
                    [5, 5, 5],
                    [0, 0, 5]
                ];
                break;
            case 5:
                //L mirror
                activePiece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [6, 0, 0]
                ];
                break;
            case 6:
                //T
                activePiece.blocks = [
                    [0, 0, 0],
                    [0, 7, 0],
                    [7, 7, 7]
                ];
                break;
            default:
                throw new Error('Фигура не установлена');
        }
        activePiece.x = Math.floor((10 - activePiece.blocks.length) / 2);
        activePiece.y = -1;

        return activePiece;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;
        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }
    movePieceRight() {
        this.activePiece.x += 1;
        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }
    movePieceDown() {
        this.activePiece.y += 1;
        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();

            const linesCount = this.checkLines();
            this.updateScore(linesCount);
            this.updatePieces();
        }
        if(this.hasCollision()) {
            this.topOut = true;
        }
    }

    updateScore(linesCount) {
        if(linesCount > 0) {
            this.lines += linesCount;

            this.score += Game.points[linesCount];
        }
    }

    checkLines() {
        const rows = 20;
        const colums = 10;
        const playfield = this.playfield;
        let lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            let count = 0;
            for (let x = 0; x < colums; x++) {
                if (playfield[y][x]) {
                    count++;
                }
            }
            if (count === 0) {
                break;
            } else if (count < colums) {
                continue;
            } else if (count === colums) {
                lines.unshift(y);
            }
        }

        if(lines.length > 0) {
            for (let i = 0; i < lines.length; i++) {
                this.playfield.splice(lines[i], 1);
                this.playfield.unshift(new Array(colums).fill(0));
            }
        }
        return lines.length;
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }

    rotatePiece() {
        let blocks = this.activePiece.blocks;
        let temp = [];
        let length = this.activePiece.blocks.length;

        for (let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0);
        }

        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                temp[x][y] = blocks[length - 1 - y][x];
            }
        }

        this.activePiece.blocks = temp;

        if (this.hasCollision()) {
            this.activePiece.blocks = blocks;
        }

    }

    hasCollision() {
        const { x: posX, y: posY, blocks } = this.activePiece;
        const playfield = this.playfield;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] &&
                    ((playfield[y + posY] === undefined || playfield[y + posY][x + posX] === undefined) ||
                        playfield[y + posY][x + posX])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        const { x: posX, y: posY, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[y + posY][x + posX] = blocks[y][x];
                }
            }
        }
    }

    getStatus() {
        const { x: posX, y: posY, blocks } = this.activePiece;

        let playfield = this.createPlayfield();

        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[y + posY][x + posX] = blocks[y][x];
                }
            }
        }
        return {
            playfield,
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece.blocks,
            isGameOver: this.topOut
        };
    }
}