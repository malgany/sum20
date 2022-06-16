class Game {

    matrix = [];
    column = 5;
    line = 6;
    x = 0;
    y = 0;

    numbers = generateNumbers(20);
    status = [0, 0, 0, 0, 0];

    constructor() {
        this.init();
    }

    init() {
        for (let i = 0; i < this.line; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.column; j++) {
                this.matrix[i][j] = -1;
            }
        }
    }

    setPointer(x, y) {
        this.x = x;
        this.y = y;
    }

    getPointer() {
        return {
            x: this.x,
            y: this.y
        };
    }

    setValue(value) {

        if (!this.validateField(value)) {
            if (value === -1) {
                this.matrix[this.x][this.y] = value;
                this.previousColumn();
            }
            return;
        }

        this.matrix[this.x][this.y] = value;

        this.nextColumn();
    }

    validateField(value) {
        return value >= 0 && value <= 20;
    }

    nextColumn() {
        let x = parseInt(this.x);
        let y = parseInt(this.y) + 1;
        if (this.matrix[x][y] === undefined) {
            for (let j = 0; j < this.column; j++) {
                if (this.matrix[x][j] === -1) {
                    this.setPointer(x, j);
                    return;
                }
            }
            return;
        }
        this.setPointer(x, y);
    }

    previousColumn() {
        let x = parseInt(this.x);
        let y = parseInt(this.y) - 1;
        if (this.matrix[x][y] === undefined) {
            return;
        }
        this.setPointer(x, y);
    }

    nextLine() {
        let pos = parseInt(this.x) + 1;
        this.setPointer(pos, 0);
    }

    noNextLine() {
        let pos = parseInt(this.x) + 1;
        return this.matrix[pos] === undefined;
    }

    clearLine() {
        this.matrix[this.x][this.y] = -1;
    }

    validateLine(line) {
        let sum = 0;
        for (let i = 0; i < this.column; i++) {
            sum += parseInt(this.matrix[line][i]);
        }
        return sum === 20;
    }

    validateGame() {
        if(this.validateLine(this.x)) {
            this.setStatusLine(this.x);
            if (!this.noNextLine()) {
                this.nextLine();
            }
            return true;
        }
        return false;
    }

    setStatusLine(line) {
        this.status = [0, 0, 0, 0, 0];
        let numbers_local = [
            this.numbers[0],
            this.numbers[1],
            this.numbers[2],
            this.numbers[3],
            this.numbers[4]
        ];
        for (let i = 0; i < this.column; i++) {
            if(parseInt(this.matrix[line][i]) === this.numbers[i]) {
                this.status[i] = 1;
                numbers_local[i] = -1;
            } else {
                this.status[i] = -1;
            }
        }
        for (let i = 0; i < this.column; i++) {
            if (this.status[i] === 1) {
                continue;
            }
            let runMap = true;
            numbers_local.map((value, index) => {
                if(runMap) {
                    let find = numbers_local.indexOf(parseInt(this.matrix[line][i]));
                    if(this.matrix[line][i] == value && find !== -1) {
                        this.status[i] = 2;
                        numbers_local[find] = -1;
                        runMap = false;
                    }
                }
            });
        }
    }
}

const game = new Game();