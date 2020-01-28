// expected input: array of numbers
function main() {
    const data = runjs.getInput().json();
    result.avg = Math.round(mean(data));
    result.max = Math.max(...data);
    result.min = Math.min(...data);
    result.p75min = Math.round(quantile(data, .75, desc));
    result.p90min = Math.round(quantile(data, .90, desc));
    result.p75max = Math.round(quantile(data, .75, asc));
    result.p90max = Math.round(quantile(data, .90, asc));
    runjs.callback(result);
}

const asc = arr => arr.sort((a, b) => a - b);
const desc = arr => arr.sort((a, b) => b - a);
const sum = arr => arr.reduce((a, b) => a + b, 0);
const mean = arr => sum(arr) / arr.length;

const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q, sorter) => {
    const sorted = (sorter ? sorter : asc)(arr);
    const pos = ((sorted.length) - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if ((sorted[base + 1] !== undefined)) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

const median = arr => quantile(arr, .5);

let result = {};

main();