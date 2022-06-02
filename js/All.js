function All() {

    this.init = init;

    const keys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        ['0', '⏎', '←']
    ];

    const g = document.getElementById("game");
    const k = document.getElementById("keyboard");

    let gbox = null;
    let kbox = null;

    const target = 20;
    const numbers = generateNumbers(target);

    let columns = 6;
    let lines = 7;

    let line = 1;
    let win_session = sessionStorage.getItem('win') || 0;

    function init() {

        createGameSquad();
        gbox = g.getElementsByClassName("box");
        kbox = k.getElementsByClassName("box");
        gbox[0].classList.add("active");
        createGameKeyboard();
        addClickEvents();
        document.getElementById("w" + line).style['pointer-events'] = 'auto';
    }

    function createGameSquad() {

        for (let i = 1; i < lines; i++) {
            let box = '<div id="w' + i + '" class="word">\n';
            for (let j = 1; j < columns; j++)
                box += '<div class="box" data-position="' + j + '"></div>\n';
            box += '</div>';
            g.innerHTML += box;
        }

        setTimeout(() => {
            for (let i = lines; i > (lines - parseInt(win_session)); i--) {
                $('#w' + (i - 1)).addClass("treme-active");
                setTimeout(() => {
                    $('#w' + (i - 1)).remove();
                }, 500);
            }
        }, 2000);
    }

    function createGameKeyboard() {
        keys.forEach((N1) => {
            k.innerHTML += '<div  class="teclado">\n';
            N1.forEach((N2) => {
                if (N2 === '⏎' || N2 === '←') {
                    k.innerHTML += '<div class="box white" data-codigo="' + N2 + '">' + N2 + '</div>\n';
                } else {
                    k.innerHTML += '<div class="box gray" data-codigo="' + N2 + '">' + N2 + '</div>\n';
                }
            });
            k.innerHTML += '</div>\n';
        });
    }

    function addClickEvents() {

        for (i = 0; i < gbox.length; i++) {
            gbox[i].addEventListener('click', selecionaBox, false);
        }

        for (i = 0; i < kbox.length; i++) {
            kbox[i].addEventListener('click', teclaKeyboard, false);
        }

        document.getElementById('modal').addEventListener('click', clickModal, false);

        document.getElementById('box-modal-again').addEventListener('click', reload, false);

        document.addEventListener('keypress', teclaKeyboard, false);
    }

    function selecionaBox() {
        for (let i = 0; i < gbox.length; i++) {
            gbox[i].classList.remove("active");
        }
        this.classList.add("active");
    }

    function teclaKeyboard() {

        let index = g.getElementsByClassName("active")[0];
        const codigo = (event.type == "keypress") ? event.key.toUpperCase() : this.getAttribute("data-codigo");

        if (codigo.length > 0 && codigo >= 0 && codigo <= 20 && !(typeof index === 'undefined')) {

            index.innerText = codigo;
            index.className = "box gray";

            // Pula para o próximo elemento
            var nS = index.nextElementSibling;
            if (nS != null) {
                nS.classList.add("active");
            } else {
                if ($('#w' + line + ' [class=box]').html() !== undefined) {
                    $('#w' + line + ' [class=box]:eq(0)').addClass('active');
                } else {
                    $('#w' + line + ' div:eq(4)').addClass('active');
                }
            }
        } else if (codigo === '⏎' || codigo === 'ENTER') {
            validateLine();
        } else if (codigo === '←' && index !== undefined && index !== null) {
            if (index.innerText !== '') {
                index.innerText = '';
                index.className = "box active";
            } else {
                index.innerText = '';
                index.className = "box";

                let nS = index.previousElementSibling;
                if (nS != null) {
                    nS.innerText = '';
                    nS.className = "box";
                    nS.classList.add("active");
                } else {
                    $('#w' + line + ' div:eq(0)').addClass('active');
                }
            }
        }
    }

    function validateLine() {
        let sum = 0;
        let add_val = [0, 5, 10, 15, 20, 25];
        let numbers_local = [numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]];
        for (let v = 0; v < 5; v++) {
            sum += parseInt(gbox[add_val[line - 1] + v].innerText);
        }

        if (sum !== target) {
            $(`#w${line}`).addClass("treme-active");
            setTimeout(() => {
                $(`#w${line}`).removeClass("treme-active");
            }, 500);
            return;
        }

        let win = 0;
        for (let w = 0; w < 5; w++) {
            let val = parseInt(gbox[add_val[line - 1] + w].innerText);

            if (val === numbers_local[w]) {
                gbox[add_val[line - 1] + w].className = "box green";
                $(`[data-codigo=${val}]`).removeClass("orange");
                $(`[data-codigo=${val}]`).removeClass("gray");
                $(`[data-codigo=${val}]`).addClass("green");
                numbers_local[w] = -1;
                win++;
            }
        }

        if (win === 5) {
            win_session++;
            sessionStorage.setItem("win", win_session);

            setTimeout(() => {
                $('.modal').show();
                $('#box-modal').show();
            }, 500);
            return;
        }

        let already_exists = [numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]];
        for (let w = 0; w < 5; w++) {
            let val = parseInt(gbox[add_val[line - 1] + w].innerText);

            if (numbers_local[w] === -1) {
                continue;
            }

            $(`[data-codigo=${val}]`).removeClass("gray");

            if (numbers_local.includes(val) && already_exists.includes(val)) {
                let clas = $(`[data-codigo=${val}]`).attr("class");
                gbox[add_val[line - 1] + w].className = "box orange";
                already_exists.splice(already_exists.indexOf(val), 1);
                if (clas.search("green") === -1) {
                    $(`[data-codigo=${val}]`).addClass("orange");
                }
            } else {
                $(`[data-codigo=${val}]`).addClass("delta");
            }
        }

        document.getElementById("w" + line).style['pointer-events'] = 'none';
        line++;

        if (line < (lines - win_session)) {
            document.getElementById("w" + line).style['pointer-events'] = 'auto';

            let index = g.getElementsByClassName("active")[0];
            $(index).removeClass("active");
            $('#w' + line + ' div:eq(0)').addClass('active');
        } else {
            win_session = 0;
            sessionStorage.setItem("win", win_session);
            $('.modal').show();
            $('#box-modal-lose').show();
            $('#response').text(numbers.join(' '));
        }
    }

    function clickModal() {
        $('#box-modal').hide();
        $('#box-modal-lose').hide();
        $('#box-modal-again').show();
    }

    function reload() {
        document.location.reload(true);
    }
}