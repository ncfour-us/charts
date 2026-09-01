// Copyright (c) 2026 Tim Hahn

import { ILogger, Logger } from '@ncfour-us/logging';

import { DonutChart } from '@ncfour-us/charts';

const logger: ILogger = Logger.createLogger('simple', {
  level: 'trace',
  json: false,
  color: true,
});

const myChart = new DonutChart({
  title: 'My Chart Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',
  stripeWidth: 0.9,

  logger: logger,
});

// const yVals = [
//   {values: [ 2,3,4,5 ], label: 'line 1 label'},
//   {values: [ 5,7,9,11 ], label: 'line 2 label'},
// ];

const yVals = [
  {
    values: [2, 3, 4, 5],
    color: ['rgba(255,0,0,1)', 'rgba(0,255,0,1)', 'rgba(0,0,255,1)', 'rgba(255, 255, 0,1)'],
  },
  {
    values: [5, 7, 9, 11],
    color: ['rgba(0,0,255,1)', 'rgba(0,0,255,1)', 'rgba(0,0,255,1)', 'rgba(0,0,255,1)'],
    label: 'DS 2 label',
  },
  {
    values: [5, 7, 9, 11],
    color: ['rgba(255,0,0,1)', 'rgba(0,255,0,1)', 'rgba(0,0,255,1)', 'rgba(255, 255, 0,1)'],
    label: 'DS 3 label',
    group: 'group2',
  },
];

const xVals = [
  'one',
  'two',
  'three',
  'four',
  '2one',
  '2two',
  '2three',
  '2four',
  '3one',
  '3two',
  '3three',
  '3four',
];

myChart.setChartData(xVals, yVals);

await myChart.writePngFile('my-donutchart.png');

await myChart.writeJpegFile('my-donutchart.jpg');

await myChart.writeSvgFile('my-donutchart.svg');

await myChart.writeHtmlFile('my-donutchart.html');
