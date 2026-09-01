// Copyright (c) 2026 Tim Hahn

import { ILogger, Logger } from '@ncfour-us/logging';

import { BarChart } from '@ncfour-us/charts';

const logger: ILogger = Logger.createLogger('simple', {
  level: 'error',
  json: false,
  color: true,
});

const myChart = new BarChart({
  title: 'My Chart Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',

  logger: logger,
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

const pngBuffer: Buffer = await myChart.getPngBuffer();
const jpegBuffer: Buffer = await myChart.getJpegBuffer();
const svgBuffer: Buffer = await myChart.getSvgBuffer();
const htmlBuffer: string = await myChart.getHtmlBuffer();

await myChart.writePngFile('my-barchart.png');

await myChart.writeJpegFile('my-barchart.jpg');

await myChart.writeSvgFile('my-barchart.svg');

const styleSection = `
<style>
  .row-container {
    display: flex;          /* Activates Flexbox layout */
    gap: 16px;              /* Adds spacing between the items */
    justify-content: start; /* Aligns items to the left (options: center, space-between, etc.) */
  }

  .row-item {
    padding: 10px 20px;
    display: inline-block;
    background-color: rgb(240, 240, 240);
    border: 1px solid rgb(204, 204, 204);
    border-radius: 4px;
  }
</style>`;

const pngDiv = `
<p>PNG images</>
<div class="row-container">
  <div class="row-item">
    <p>Embedded PNG inline:</p>
    <img src="data:image/png;base64,${pngBuffer.toString('base64')}">
  </div>
  <div class="row-item">
    <p>Referenced PNG file:</p>
    <img src="my-barchart.png">
  </div>
</div>`;

const jpegDiv = `
<p>JPEG images</>
<div class="row-container">
  <div class="row-item">
    <p>Embedded JPEG inline:</p>
    <img src="data:image/jpeg;base64,${jpegBuffer.toString('base64')}">
  </div>
  <div class="row-item">
    <p>Referenced JPEG file:</p>
    <img src="my-barchart.jpg">
  </div>
</div>`;

const svgDiv = `
<p>SVG images</>
<div class="row-container">
  <div class="row-item">
    <p>Embedded SVG inline:</p>
    <div>
    ${svgBuffer.toString()}
    </div>
  </div>
  <div class="row-item">
    <p>Referenced SVG file:</p>
    <img src="my-barchart.svg">
  </div>
</div>`;

await myChart.writeHtmlFile('my-barchart.html', 'Bar Chart Example formats', [
  styleSection,
  htmlBuffer,
  svgDiv,
  pngDiv,
  jpegDiv,
]);
