// Copyright (c) 2026 Tim Hahn

import { ILogger, Logger } from '@ncfour-us/logging';

import { XYLineChart } from '@ncfour-us/charts';

const logger: ILogger = Logger.createLogger('simple', {
  level: 'error',
  json: false,
  color: true,
});

const myChart1 = new XYLineChart({
  title: 'My Chart 1 Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',
  backgroundColor: 'rgba(0,0,0,0)', // transparent
  logger: logger,
});

const myChart2 = new XYLineChart({
  title: 'My Chart 2 Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',
  backgroundColor: 'rgba(0,0,0,0)', // transparent
  logger: logger,
});

const yVals1 = [{ values: [2, 3, 4, 5] }, { values: [5, 7, 9, 11], label: 'line 2 label' }];

myChart1.setChartData([1, 2, 3, 4], yVals1);

const yVals2 = [
  { values: [2, 5, -1, 5], fillColor: 'rgba(255,255,255,1)' },
  { values: [1, 3, 4, 4], label: 'line 2 label', fillColor: 'rgba(0,0,255,0.5)' },
];

myChart2.setChartData([1, 2, 3, 4], yVals2);

const htmlBuffer1: string = await myChart1.getHtmlBuffer();
const htmlBuffer2: string = await myChart2.getHtmlBuffer();

await myChart1.writeHtmlFile('my-xyline-2-charts.html', '2 XY Line Charts on one page', [
  htmlBuffer1,
  htmlBuffer2,
]);
