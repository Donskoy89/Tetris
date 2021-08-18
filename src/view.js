export default class View {
    static colors = {
        '1': 'red',
        '2': 'cyan',
        '3': 'orange',
        '4': 'green',
        '5': 'yellow',
        '6': 'blue',
        '7': 'violet'
    };
    constructor(element, width, height, row, col) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.element.appendChild(this.canvas);

        this.playfieldBorder = 4;
        this.playfieldWidth = this.width * 2/3;
        this.playfieldHeight = this.height;
        this.innerX = this.playfieldBorder;
        this.innerY = this.playfieldBorder;
        this.innerWidth = this.playfieldWidth - (this.playfieldBorder * 2);
        this.innerHeight = this.playfieldHeight - (this.playfieldBorder * 2);

        this.blockWidth = this.innerWidth / col;
        this.blockHeight = this.innerHeight /row;

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
    }
    renderMainScreen(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    renderPlayfield({playfield}) {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.playfieldBorder;
        this.ctx.strokeRect(0,0,this.playfieldWidth, this.playfieldHeight);

        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {
                if(playfield[y][x]) {
                    this.renderBlock(
                        this.innerX + (x*this.blockWidth),
                        this.innerX + (y*this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[playfield[y][x]]
                    );
                }
            }
        }
    }

    renderBlock(x,y,width,height,color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillRect(x,y,width,height);
        this.ctx.strokeRect(x,y,width,height);
    }

    renderPanel(state) {
        const {level, score, lines, nextPiece} = state;

        this.ctx.textAlign = 'start',
        this.ctx.textBaseline = 'top',
        this.ctx.font = '14px "Press start 2P"';
        this.ctx.fillStyle = 'white';

        this.ctx.fillText(`Score: ${score}`, this.panelX, this.panelY);
        this.ctx.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 21);
        this.ctx.fillText(`Level: ${level}`, this.panelX, this.panelY + 42);
        this.ctx.fillText('Next piece:', this.panelX, this.panelY + 75);

        for (let y = 0; y < nextPiece.length; y++) {
            for (let x = 0; x < nextPiece[y].length; x++) {
                if(nextPiece[y][x]) {
                    this.renderBlock(
                        this.panelX + (this.blockWidth * x*0.5),
                        this.panelY + 100 + (this.blockHeight * y*0.5),
                        this.blockWidth*0.5,
                        this.blockHeight*0.5,
                        View.colors[nextPiece[y][x]]
                    );
                }
            }
        }
    }

    renderStartScreen() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px "Press Start 2P"';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        this.ctx.fillText('Press ENTER to Play', this.width/2, this.height/2);
    }
    
    renderPauseScreen() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
        this.ctx.fillRect(0,0,this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px "Press Start 2P"';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        this.ctx.fillText('Press ENTER to Resume', this.width/2, this.height/2);
    }

    renderEndScreen({score}) {
        this.clearScreen();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px "Press Start 2P"';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        this.ctx.fillText('GAME OVER', this.width/2, this.height/2-36);
        this.ctx.fillText(`Score: ${score}`, this.width/2, this.height/2);
        this.ctx.fillText('Press ENTER to start', this.width/2, this.height/2+36);
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}