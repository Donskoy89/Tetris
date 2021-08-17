export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }
    update() {
        this.game.movePieceDown();
        this.updateView();
    }
    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }
    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }
    startTimer() {
        let speed = 1000 - (this.game.getStatus().level * 100);
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }
    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    updateView() {
        const state = this.game.getStatus();

        if (state.isGameOver) {
            this.view.renderGameoverScreen(state);
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMain(this.game.getStatus());
        }
    }
    handleKeyDown(event) {
        const state = this.game.getStatus();
        switch (event.keyCode) {
            case 13:
                if(state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 37:
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38:
                this.game.rotate();
                this.updateView();
                break;
            case 39:
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40:
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    }
    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40:
                this.startTimer();
                break;
        }
    }
    reset() {
        this.game.reset();
        this.play();
    }
}