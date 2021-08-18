export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlayng = false;

        this.view.renderStartScreen();

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    startTimer() {
        let speed = 1000 - (this.game.getStatus().level * 100);
        if(!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.moveDown();
            }, speed > 100 ? speed : 100);
        }
    }

    stopTimer() {
        if(this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    play() {
        this.isPlayng = true;
        this.startTimer();
        this.render();
    }
    stop() {
        this.isPlayng = false;
        this.stopTimer();
        this.render();
    }
    
    moveDown() {
        this.game.movePieceDown();
        this.render();
    }

    render() {
        const state = this.game.getStatus();

        if(state.isGameOver) {
            this.view.renderEndScreen(state);
        } else if (!this.isPlayng) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(state);
        }
    }

    handleKeyDown(event) {
        const state = this.game.getStatus();
        switch(event.keyCode) {
            case 13:
                if(state.isGameOver) {
                    this.reset();
                } else if(this.isPlayng) {
                    this.stop();
                    this.render();
                } else {
                    this.play();
                }
                break;
            case 37:
                if(this.isPlayng) {
                    this.game.movePieceLeft();
                    this.render();
                }
                break;
            case 38:
                if(this.isPlayng) {
                    this.game.rotatePiece();
                    this.render();
                }
                break;
            case 39:
                if(this.isPlayng) {
                    this.game.movePieceRight();
                    this.render();
                }
                break;
            case 40:
                if(this.isPlayng) {
                    this.stopTimer();
                    this.game.movePieceDown();
                    this.render();
                }
                break;
        }
    }
    handleKeyUp(event) {
        switch(event.keyCode) {
            case 40:
                if(this.isPlayng) {
                    this.startTimer();
                }
                break;
        }
    }
    reset() {
        this.game.reset();
        this.play();
    }
}