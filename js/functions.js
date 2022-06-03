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
    console.log(arr);
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
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

function getToday() {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}