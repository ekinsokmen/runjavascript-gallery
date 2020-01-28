// expected input: [{"start_date": "YYYY-MM-DD", value: 0}]
function main() {
    const data = runjs.getInput().json();
    
    const dateList = data.map(e => e.start_date);
    const valueList = data.map(e => e.value);
    const valueStatsList = [...valueList];

    result.avg = Math.round(mean(valueStatsList));
    result.max = Math.max(...valueStatsList);
    result.min = Math.min(...valueStatsList);
    result.p75min = Math.round(quantile(valueStatsList, .75, desc));
    result.p90min = Math.round(quantile(valueStatsList, .90, desc));
    result.p75max = Math.round(quantile(valueStatsList, .75, asc));
    result.p90max = Math.round(quantile(valueStatsList, .90, asc));

    var canvas = document.getElementById('chart');
    canvas.width = 1920;
    canvas.width = 1080;
    canvas.style.backgroundColor = 'red';
    var ctx = canvas.getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateList,
            datasets: [{
                label: '# of Steps',
                data: valueList,
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            animation: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                onComplete: function(){
                    callback(canvas);
                }
            },
            annotation: {
                annotations: [
                {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: result.avg,
                  borderColor: 'rgb(75, 192, 192)',
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: 'Mean'
                  }
                },
                {
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: result.p90max,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 2,
                    label: {
                      enabled: true,
                      content: '90 Percentile Band'
                    }
                },
                {
                    drawTime: "beforeDatasetsDraw",
                    type: 'box',
                    yScaleID: 'y-axis-0',
                    xScaleID: 'x-axis-0',
                    yMax: result.p90max,
                    yMin: result.p90min,
                    backgroundColor: "rgba(101, 33, 171, 0.5)",
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                  }]
              }
        }
    }); 
}

let result = {};

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

function callback(canvas) {
    canvas.style.backgroundColor = 'red';
    var resultImgBase64Str = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
    runjs.callback(resultImgBase64Str);
}

runjs.printHTML('<canvas id="chart"></canvas>')

runjs.importScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js")
.then(() => runjs.importScript("https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/0.5.7/chartjs-plugin-annotation.min.js"))
.then(main);