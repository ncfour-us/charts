// Copyright (c) 2026 Tim Hahn

import { XYLineChart } from '@ncfour-us/charts';

const myChart = new XYLineChart({
  title: 'My Chart Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',
  backgroundColor: 'rgba(0,0,0,0)', // transparent
});

// const yVals = [
//   {values: [ 2,3,4,5 ], label: 'line 1 label'},
//   {values: [ 5,7,9,11 ], label: 'line 2 label'},
// ];

const yVals = [{ values: [2, 3, 4, 5] }, { values: [5, 7, 9, 11], label: 'line 2 label' }];

myChart.setChartData([1, 2, 3, 4], yVals);

await myChart.writePngFile('mychart.png');

await myChart.writeJpegFile('mychart.jpg');

await myChart.writeSvgFile('mychart.svg');

await myChart.writeHtmlFile('mychart.html');
