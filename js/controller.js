class Controller {

    constructor() {
        this.init();
    }

    init() {
        this.openPage('daily');
        this.loadCache();

        document.getElementById('btn-daily').addEventListener('click', () => {
            this.openPage('daily');
        });

        document.getElementById('btn-free').addEventListener('click', () => {
            this.openPage('free');
        });

        let elementsButton = document.getElementsByClassName('field');
        for (let i = 0; i < elementsButton.length; i++) {
            elementsButton[i].addEventListener('click', (e) => {
                this.clickButton(e, this.selectedField, this.saveCache)
            }, false);
        }

        let elementsLine = document.querySelectorAll('#squad-daily-game .row');
        for (let j = 0; j < elementsLine.length; j++) {
            let elementsColumn = elementsLine[j].querySelectorAll('.col');
            for (let k = 0; k < elementsColumn.length; k++) {
                elementsColumn[k].addEventListener('click', (e) => {
                    this.setField(e, this.selectedField)
                }, false);
            }
        }

        setInterval(() => {
            $('#time').html(countDown().hours + ':' + countDown().minutes + ':' + countDown().seconds);
        }, 1000);

        this.firstLoad();
    }

    openPage(page) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('daily').style.display = 'none';
        document.getElementById('free').style.display = 'none';
        document.getElementById(page).style.display = 'block';
    }

    clickButton(event, selectedField, saveCache) {
        let element = event.target;
        let value = element.dataset.value;

        if (value >= 0 && value <= 20) {
            let x = game.getPointer().x;
            let y = game.getPointer().y;
            document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]').innerHTML = value;
            game.setValue(value);
            selectedField(game.getPointer().x, game.getPointer().y);
        }
        if (value === 'backspace') {
            let x = game.getPointer().x;
            let y = game.getPointer().y;
            let element_1 = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
            let element_2 = document.querySelector('[data-x="' + x + '"][data-y="' + (y - 1) + '"]');
            let value_inner =  element_1.innerHTML;
            element_1.innerHTML = '';
            if(value_inner === '') {
                game.setValue(-1);
                if (y > 0) element_2.innerHTML = '';
                selectedField(game.getPointer().x, game.getPointer().y);
            }
        }
        if (value === 'enter') {
            let xLine = game.getPointer().x;
            let valid = game.validateGame();
            let status = game.status;

            if (!valid) {
                let element_1 = document.querySelector('[data-x="' + game.getPointer().x + '"][data-y="' + game.getPointer().y + '"]');
                $(element_1.parentNode).addClass("treme-active");
                setTimeout(() => {
                    $(element_1.parentNode).removeClass("treme-active");
                }, 500);
                return;
            }

            let win = 0;
            let elementsLine = document.querySelectorAll('[data-x="' + xLine + '"]');
            for (let i = 0; i < elementsLine.length; i++) {

                elementsLine[i].classList.remove('orange');
                elementsLine[i].classList.remove('green');
                elementsLine[i].classList.remove('delta');

                let value = document.querySelector('[data-x="' + xLine + '"][data-y="' + i + '"]').innerHTML;

                let _class = 'delta';
                if (status[i] === 1) {
                    _class = 'green';
                    win++;
                }
                if (status[i] === 2) {
                    _class = 'orange';
                }

                let key = document.querySelector('[data-value="' + value + '"]');


                if (key.className !== 'field green') {
                    switch (_class) {
                        case 'delta':
                            if (key.className !== 'field orange') {
                                key.classList.remove('delta');
                                key.classList.remove('orange');
                                key.classList.add(_class);
                            }
                            break;
                        case 'green':
                        case 'orange':
                            key.classList.remove('delta');
                            key.classList.remove('orange');
                            key.classList.add(_class);
                            break;
                    }
                }

                elementsLine[i].classList.add(_class);
            }
            let finish = false;
            let save = false;
            if(win === elementsLine.length) {
                finish = true;
                save = true;
                document.getElementsByClassName('selected').item(0).classList.remove('selected');
            } else {
                selectedField(game.getPointer().x, game.getPointer().y);
                if(xLine == 5) {
                    finish = true;
                }
            }

            if(finish) {
                saveData(save, xLine + 1);
                saveCache();
                updateScreen();
                loadChart();
                $('.button-all-screen').show().click();
            }
        }
    }

    setField(event, selectedField) {
        let element = event.target;
        let x = element.dataset.x;
        let y = element.dataset.y;

        selectedField(x, y);
    }

    selectedField(x, y) {
        let pointerX = game.getPointer().x;

        if (x != pointerX) {
            return;
        }

        game.setPointer(x, y);

        let elementsLine = document.querySelectorAll('#squad-daily-game .row');
        for (let xx = 0; xx < elementsLine.length; xx++) {
            let elementsColumn = elementsLine[xx].querySelectorAll('.col .box');
            for (let yy = 0; yy < elementsColumn.length; yy++) {
                if (xx == x && yy == y) {
                    elementsColumn[yy].classList.add('selected');
                } else {
                    elementsColumn[yy].classList.remove('selected');
                }
            }
        }
    }

    firstLoad() {
        let firstLoad = localStorage.getItem('first-time') || 0;

        if(firstLoad === 0) {
            $('#openExplainModal').click();
            localStorage.setItem('first-time', 1)
        }
    }

    loadCache() {
        let cache = localStorage.getItem('cache_' + getToday());
        if(cache !== undefined && cache !== null) {
            $('#daily').html(cache);
            updateScreen();
            loadChart();
            $('.button-all-screen').show().click();
        }
    }

    saveCache() {
        localStorage.setItem('cache_' + getToday(), $('#daily').html());
    }
}

const controller = new Controller();