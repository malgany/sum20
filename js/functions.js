function generateNumbers(target) {

    let n1 = getRandomArbitrary(0, target);
    let n2 = getRandomArbitrary(0, (target - n1));

    const lines = [
        {min: n1, max: n1},
        {min: n2, max: n2},
        {min: 0, max: target},
        {min: 0, max: target},
        {min: 0, max: target}];

    const result = [];

    for (let x = 0; x < lines.length; x++) {
        result[x] = lines[x].min;
        target -= lines[x].min;
    }

    function createRoulette() {
        const ret = [];
        let sum = 0;
        for (let i = 0; i < lines.length; i++) {
            const valor = lines[i].max - result[i];
            ret.push(valor + sum);
            sum += valor;
        }
        return [ret, sum];
    }

    for (let y = 0; y < target; y++) {
        const roulette = createRoulette();
        const draw = Math.floor(Math.random() * roulette[1]);
        for (let z = 0; z < lines.length; z++)
            if (draw < roulette[0][z]) {
                result[z]++;
                break;
            }
    }

    return shuffleArray(result);
}

function generateNumbersV2(target) {
    let n1 = getRandomArbitrary(0, target);
    let n2 = getRandomArbitrary(0, (target - n1));
    let n3 = getRandomArbitrary(0, (target - n1 - n2));
    let n4 = getRandomArbitrary(0, (target - n1 - n2 - n3));
    let n5 = target - n1 - n2 - n3 - n4;

    return shuffleArray([n1, n2, n3, n4, n5]);
}

function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function countDown() {
    let time = new Date();
    let timeLeft = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 23, 59, 59, 999);
    let timeNow = new Date();
    let timeDiff = timeLeft - timeNow;
    let seconds = Math.floor((timeDiff / 1000) % 60);
    let minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    let hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return {
        days: days,
        hours: padLeadingZeros(hours, 2),
        minutes: padLeadingZeros(minutes, 2),
        seconds: padLeadingZeros(seconds, 2)
    };
}

function getToday() {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

function padLeadingZeros(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function saveData(win, line) {

    let matches = parseInt(localStorage.getItem("matches") || 0);
    let wins = parseInt(localStorage.getItem("wins") || 0);
    let sequence = parseInt(localStorage.getItem("sequence") || 0);
    let best_sequence = parseInt(localStorage.getItem("best-sequence") || 0);
    let lose = parseInt(localStorage.getItem("lose") || 0);

    let win_line = parseInt(localStorage.getItem('win' + line)) || 0;

    let str_score_text = getDisplayScore();

    if (win) {
        matches++;
        wins++;
        sequence++;
        win_line++;
        if (sequence > best_sequence) {
            best_sequence = sequence;
        }
    } else {
        matches++;
        lose++;
        sequence = 0;
    }

    localStorage.setItem("matches", matches);
    localStorage.setItem("wins", wins);
    localStorage.setItem("sequence", sequence);
    localStorage.setItem("best-sequence", best_sequence);
    localStorage.setItem('win' + line, win_line);
    localStorage.setItem('lose', lose);
    localStorage.setItem('score_' + getToday(), str_score_text);
}

function updateScreen() {
    let matches = parseInt(localStorage.getItem("matches") || 0);
    let wins = parseInt(localStorage.getItem("wins") || 0);
    let sequence = parseInt(localStorage.getItem("sequence") || 0);
    let best_sequence = parseInt(localStorage.getItem("best-sequence") || 0);

    $('#matches').html(matches);
    $('#wins').html(wins);
    $('#sequence').html(sequence);
    $('#best-sequence').html(best_sequence);
}

function getDisplayScore() {

    let str_score_text = 'I played Sum 20 and won: ';

    str_score_text += '\n';

    $('#squad-daily-game .row').each(function (index, element) {
        $(element).find('.box').each(function (i, e) {
            switch (e.className) {
                case 'box delta':
                    str_score_text += '⬛';
                    break;
                case 'box orange':
                    str_score_text += '🟨';
                    break;
                case 'box green':
                    str_score_text += '🟩';
                    break;
            }
        });
        str_score_text += '\n'
    });

    return str_score_text;
}

const shareData = {
    title: 'Sum 20',
    text: localStorage.getItem('score_' + getToday()),
    url: 'https://sum20.online/',
}

document.getElementById('share').addEventListener('click', async () => {
    try {
        navigator.share(shareData)
    } catch (err) {
        console.log('Error: ' + err);
    }
});

function loadChart() {

    let win1 = parseInt(localStorage.getItem('win1')) || 0;
    let win2 = parseInt(localStorage.getItem('win2')) || 0;
    let win3 = parseInt(localStorage.getItem('win3')) || 0;
    let win4 = parseInt(localStorage.getItem('win4')) || 0;
    let win5 = parseInt(localStorage.getItem('win5')) || 0;
    let win6 = parseInt(localStorage.getItem('win6')) || 0;
    let lose = parseInt(localStorage.getItem('lose')) || 0;

    const xValues = ["1", "2", "3", "4", "5", "6", "☠"];
    let yValues = [
        win1,
        win2,
        win3,
        win4,
        win5,
        win6,
        lose
    ];
    const barColors = ["#0d6efd", "#0d6efd", "#0d6efd", "#0d6efd", "#0d6efd", "#0d6efd", "#0d6efd"];

    new Chart("myChart", {
        type: "horizontalBar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        responsive: true,
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: '#fff',
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: '#fff',
                        stepSize: 1
                    }
                }]
            },
            legend: {
                display: false
            },
            title: {
                display: false
            }
        }
    });
}

function detect_mobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}