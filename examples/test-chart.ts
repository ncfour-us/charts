// Copyright (c) 2026 Tim Hahn

import { XYLineChart } from '@ncfour-us/charts';

const myChart = new XYLineChart({
  title: 'My Chart Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',
});

// const yVals = [
//   {values: [ 2,3,4,5 ], label: 'line 1 label'},
//   {values: [ 5,7,9,11 ], label: 'line 2 label'},
// ];

const yVals = [{ values: [2, 3, 4, 5] }, { values: [5, 7, 9, 11], label: 'line 2 label' }];

await myChart.writePng([1, 2, 3, 4], yVals, 'mychart.png');

await myChart.writeJpeg([1, 2, 3, 4], { values: [7, 6, 5, 4] }, 'mychart.jpg');

await myChart.writeSvg([1, 2, 3, 4], { values: [7, 6, 5, 4] }, 'mychart.svg');

await myChart.writeHtml([1, 2, 3, 4], yVals, 'mychart.html');
