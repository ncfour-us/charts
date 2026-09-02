// Copyright (c) 2026 Tim Hahn

// import * as fsPromises from 'fs/promises';
import { test, expect, describe, jest } from '@jest/globals';

import { Logger } from '@ncfour-us/logging';
import type { ChartYData } from '@ncfour-us/charts';

const fsP = jest.requireActual<typeof import('node:fs/promises')>('node:fs/promises');

// Mock the node:fs/promises module
jest.unstable_mockModule('node:fs/promises', () => ({
  // __esModule: true,
  ...fsP,
  writeFile: jest.fn((_path: string, _buffer: string) => {}),
}));

// These imports need to be done dynamically in order to allow for mocking the writeFile
// function in unit tests.
//
// Also, the import MUST come after the jest.unstable_mockModule() call above.
//
const { writeFile } = await import('node:fs/promises');

const { XYLineChart, BarChart, PieChart, DonutChart } = await import('@ncfour-us/charts');

const logger = Logger.createLogger('simple', {
  json: false,
  color: true,
  level: 'warn',
});

describe('XYLineChart tests', () => {
  test('XY Line chart, single set of y values - PNG', async () => {
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData = { values: [2, 3, 4, 5] };

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, single set of y values in an array - JPEG', async () => {
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [{ values: [2, 3, 4, 5] }];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, double set of y values - PNG', async () => {
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'line 2 label' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, double set of y values - SVG', async () => {
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'line 2 label' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getSvgBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, double set of y values - HTML', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'line 2 label' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getHtmlBuffer();

    expect(testBuffer.toString()).toMatchSnapshot();

    mockRandom.mockRestore();
  });

  test('should mock writeFile directly', async () => {
    // 2. Define the mocked resolution value
    jest.mocked(writeFile).mockResolvedValue(undefined);

    // 3. Execute
    await writeFile('bar.txt', 'OUCH');

    // 4. Assertions
    expect(writeFile).toHaveBeenCalledTimes(1);
  });

  test('XYLineChart, writePng, calls writeFile with pngBuffer', async () => {
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.png';
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'line 2 label' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    await myChart.writePng(xVals, yVals, fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, testBuffer);

    // mockWriteFile.mockRestore();
  });
});

describe('BarChart tests', () => {
  test('Simple Bar chart HTML, numeric X, Y values', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    const myChart = new BarChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'bar 2 label' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getHtmlBuffer();

    expect(testBuffer.toString()).toMatchSnapshot();

    mockRandom.mockRestore();
  });

  test('Simple Bar chart PNG, text X, numeric Y values', async () => {
    const myChart = new BarChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: string[] = ['category 1', 'category 2', 'category 3', 'category 4'];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'bar 2 label' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Simple Bar chart JPEG, text X, numeric Y values, side-by-side', async () => {
    const myChart = new BarChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: string[] = ['category 1', 'category 2', 'category 3', 'category 4'];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5], group: 'first-group' },
      { values: [5, 7, 9, 11], label: 'bar 2 label', group: 'second-group' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Simple Bar chart SVG, text X, numeric Y values, side-by-side', async () => {
    const myChart = new BarChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: string[] = ['category 1', 'category 2', 'category 3', 'category 4'];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5], group: 'first-group' },
      { values: [5, 7, 9, 11], label: 'bar 2 label', group: 'second-group' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getSvgBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });
});

describe('DonutChart tests', () => {
  test('Donut Chart, one set of values, PNG', async () => {
    const myChart = new DonutChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',

      logger: logger,
    });

    const xVals: string[] = ['slice 1', 'slice 2', 'slice 3', 'slice 4'];
    const yVals: ChartYData = { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' };

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Donut Chart, two sets of values, JPEG', async () => {
    const myChart = new DonutChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: string[] = [
      'slice 0:1',
      'slice 0:2',
      'slice 0:3',
      'slice 0:4',
      'slice 1:1',
      'slice 1:2',
      'slice 1:3',
      'slice 1:4',
    ];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' },
      { values: [2, 3, 4, 5], group: 'second-group' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });
});

describe('PieChart tests', () => {
  test('Pie Chart, one set of values, SVG', async () => {
    const myChart = new PieChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: string[] = ['slice 1', 'slice 2', 'slice 3', 'slice 4'];
    const yVals: ChartYData = { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' };

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getSvgBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Pie Chart, two sets of values, HTML', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    const myChart = new PieChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
    });

    const xVals: string[] = [
      'slice 0:1',
      'slice 0:2',
      'slice 0:3',
      'slice 0:4',
      'slice 1:1',
      'slice 1:2',
      'slice 1:3',
      'slice 1:4',
    ];
    const yVals: ChartYData[] = [
      { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' },
      { values: [2, 3, 4, 5], group: 'second-group' },
    ];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getHtmlBuffer();

    expect(testBuffer.toString()).toMatchSnapshot();

    mockRandom.mockRestore();
  });
});
