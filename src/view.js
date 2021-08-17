export default class View {
    constructor(element, width, height, rows, cols) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.element.appendChild(this.canvas);

        this.playfieldBorder = 4;
        this.playfieldX = this.playfieldBorder;
        this.playfieldY = this.playfieldBorder;
        this.playfieldWidth = this.width * 2/3;
        this.playfieldHeight = this.height;

        this.innerWidth = this.playfieldWidth - (this.playfieldBorder * 2);
        this.innerHeight = this.playfieldHeight - (this.playfieldBorder * 2);

        this.blockWidth = this.innerWidth / cols;
        this.blockHeight = this.innerHeight / rows;

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.colors = {
            '1': 'cyan',
            '2': 'blue',
            '3': 'orange',
            '4': 'yellow',
            '5': 'green',
            '6': 'purple',
            '7': 'red'
        };
    }
    renderMain(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }
    clearScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    renderStartScreen() {
        this.ctx.font = '18px "Press start 2P"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Press ENTER to Start', this.width/2, this.height/2);
    }

    renderPauseScreen() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
        this.ctx.fillRect(0,0,this.width, this.height);

        this.ctx.font = '18px "Press start 2P"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Press ENTER to Resume', this.width/2, this.height/2);
    }

    renderGameoverScreen({score}) {
        this.clearScreen();

        this.ctx.font = '18px "Press start 2P"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Game Over', this.width/2, this.height/2-42);
        this.ctx.fillText(`Score: ${score}`, this.width/2, this.height/2);
        this.ctx.fillText('Press ENTER to Restart', this.width/2, this.height/2+42);
    }

    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {
                if (playfield[y][x]) {
                    this.renderBlock(
                        this.playfieldX + (x * this.blockWidth),
                        this.playfieldY + (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        this.colors[playfield[y][x]]
                    );
                }
            }
        }

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.playfieldBorder;
        this.ctx.strokeRect(0,0,this.playfieldWidth, this.playfieldHeight);
    }

    renderPanel({ level, score, lines, nextPiece }) {
        this.ctx.textAlign = 'start';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px "Press start 2P"';

        this.ctx.fillText(`score: ${score}`, this.panelX, this.panelY + 0);
        this.ctx.fillText(`lines: ${lines}`, this.panelX, this.panelY + 21);
        this.ctx.fillText(`level: ${level}`, this.panelX, this.panelY + 42);
        this.ctx.fillText('next:', this.panelX, this.panelY + 84);

        for (let y = 0; y < nextPiece.length; y++) {
            for (let x = 0; x < nextPiece[y].length; x++) {
                if (nextPiece[y][x]) {
                    this.renderBlock(
                        this.panelX + (x * this.blockWidth * 0.5),
                        this.panelY + (y * this.blockHeight * 0.5) + 100,
                        this.blockWidth * 0.5,
                        this.blockHeight * 0.5,
                        this.colors[nextPiece[y][x]]
                    );
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeRect(x, y, width, height);
    }
}