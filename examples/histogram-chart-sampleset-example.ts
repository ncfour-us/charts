// Copyright (c) 2026 Tim Hahn

import { ILogger, Logger } from '@ncfour-us/logging';

import { NormalSampleSet } from '@ncfour-us/stats';
import { HistogramChart } from '@ncfour-us/charts';

const logger: ILogger = Logger.createLogger('simple', {
  level: 'error',
  json: false,
  color: true,
});

const myChart = new HistogramChart({
  title: 'My Chart Title',
  xAxisTitle: 'My X Axis label',
  yAxisTitle: 'My Y Axis label',

  logger: logger,
});

const normalSampleSet: NormalSampleSet = new NormalSampleSet({
  numSamples: 1000,
  logger: logger,
});

myChart.setChartDataUsingSampleSet(normalSampleSet);

const pngBuffer: Buffer = await myChart.getPngBuffer();
const jpegBuffer: Buffer = await myChart.getJpegBuffer();
const svgBuffer: Buffer = await myChart.getSvgBuffer();
const htmlBuffer: string = await myChart.getHtmlBuffer();

await myChart.writePngFile('my-histogram-sampleset-chart.png');

await myChart.writeJpegFile('my-histogram-sampleset-chart.jpg');

await myChart.writeSvgFile('my-histogram-sampleset-chart.svg');

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
    <img src="my-histogram-sampleset-chart.png">
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
    <img src="my-histogram-sampleset-chart.jpg">
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
    <img src="my-histogram-sampleset-chart.svg">
  </div>
</div>`;

await myChart.writeHtmlFile(
  'my-histogram-sampleset-chart.html',
  'Histogram Chart Example formats',
  [styleSection, htmlBuffer, svgDiv, pngDiv, jpegDiv],
);
