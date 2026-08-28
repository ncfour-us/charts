// Copyright (c) 2026 Tim Hahn

import { BarChart } from '@ncfour-us/charts';

const myChart = new BarChart({
  title: 'My Chart Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',
});

// const yVals = [
//   {values: [ 2,3,4,5 ], label: 'line 1 label'},
//   {values: [ 5,7,9,11 ], label: 'line 2 label'},
// ];

const yVals = [
  { values: [2, 3, 4, 5], color: 'rgba(255,0,0,1)' },
  { values: [5, 7, 9, 11], color: 'rgba(0,0,255,1)', label: 'bar 2 label' },
  { values: [5, 7, 9, 11], color: 'rgba(0,255,0,1)', label: 'bar 3 label', group: 'group2' },
];

myChart.setChartData(['one', 'two', 'three', 'four'], yVals);

await myChart.writePngFile('my-barchart.png');

await myChart.writeJpegFile('my-barchart.jpg');

await myChart.writeSvgFile('my-barchart.svg');

await myChart.writeHtmlFile('my-barchart.html');
