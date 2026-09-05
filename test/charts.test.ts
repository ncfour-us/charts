// Copyright (c) 2026 Tim Hahn

// import * as fsPromises from 'fs/promises';
import { test, expect, describe, jest, beforeEach } from '@jest/globals';

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

const { XYLineChart, StackedLineChart, BarChart, PieChart, DonutChart } =
  await import('@ncfour-us/charts');

const logger = Logger.createLogger('simple', {
  json: false,
  color: true,
  level: 'warn',
});

describe('XYLineChart tests', () => {
  let myChart: InstanceType<typeof XYLineChart>;
  let xVals: number[];
  let yVals: ChartYData | ChartYData[];

  beforeEach(() => {
    myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
      logger: logger,
    });

    xVals = [1, 2, 3, 4];
    yVals = [{ values: [2, 3, 4, 5] }, { values: [5, 7, 9, 11], label: 'line 2 label' }];
  });

  test('XY Line chart, single set of y values - PNG', async () => {
    yVals = { values: [2, 3, 4, 5] };

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, single set of y values in an array - JPEG', async () => {
    yVals = [{ values: [2, 3, 4, 5] }];

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, double set of y values - PNG', async () => {
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('XY Line chart, double set of y values - SVG', async () => {
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getSvgBuffer();

    // resulting string should start and end with <svg> ... </svg>
    const regExp = new RegExp(
      '<\\?xml version="1.0" encoding="utf-8" \\?>\\s*<svg.*</svg>\\s*$',
      's',
    );
    expect(regExp.test(testBuffer.toString('utf8'))).toBe(true);
  });

  test('XY Line chart, double set of y values - HTML', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

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
    expect(writeFile).toHaveBeenCalledWith('bar.txt', 'OUCH');
  });

  test('XYLineChart, writePngFile, calls writeFile with pngBuffer', async () => {
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.png';

    await myChart.writePngFile(fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(Buffer));
  });

  test('XYLineChart, writeJpegFile, calls writeFile with jpegBuffer', async () => {
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.jpeg';

    await myChart.writeJpegFile(fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(Buffer));
  });

  test('XYLineChart, writeSvgFile, calls writeFile with svgBuffer', async () => {
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.svg';
    myChart.setChartData(xVals, yVals);

    await myChart.writeSvgFile(fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(Buffer));
  });

  test('XYLineChart, writeHtmlFile, calls writeFile with htmlBuffer', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.html';
    const pageTitle = 'Page Title';

    await myChart.writeHtmlFile(fileName, pageTitle);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(String));

    mockRandom.mockRestore();
  });

  test('XYLineChart, writeHtmlFile, calls writeFile with buffers passed in', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.html';
    const pageTitle = 'Page Title';
    const buffers: string[] = ['<div>Div 1</div>', '<div>Div 2</div>'];

    await myChart.writeHtmlFile(fileName, pageTitle, buffers);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(String));

    mockRandom.mockRestore();
  });

  // test that Deprecated APIs log that they are depreacated
  test('XYLineChart, writePng, calls writeFile with pngBuffer', async () => {
    const loggerWarn = jest.spyOn(logger, 'warn');
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.png';

    await myChart.writePng(xVals, yVals, fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(Buffer));
    expect(loggerWarn).toHaveBeenCalledTimes(1);

    loggerWarn.mockRestore();
  });

  test('XYLineChart, writeJpeg, calls writeFile with jpegBuffer', async () => {
    const loggerWarn = jest.spyOn(logger, 'warn');
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.jpeg';

    await myChart.writeJpeg(xVals, yVals, fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(Buffer));
    expect(loggerWarn).toHaveBeenCalledTimes(1);

    loggerWarn.mockRestore();
  });

  test('XYLineChart, writeSvg, calls writeFile with svgBuffer', async () => {
    const loggerWarn = jest.spyOn(logger, 'warn');
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.svg';
    myChart.setChartData(xVals, yVals);

    await myChart.writeSvg(xVals, yVals, fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(Buffer));
    expect(loggerWarn).toHaveBeenCalledTimes(1);

    loggerWarn.mockRestore();
  });

  test('XYLineChart, writeHtml, calls writeFile with htmlBuffer', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    const loggerWarn = jest.spyOn(logger, 'warn');
    jest.mocked(writeFile).mockResolvedValue(undefined);

    const fileName = 'testfile.html';

    await myChart.writeHtml(xVals, yVals, fileName);

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(fileName, expect.any(String));
    expect(loggerWarn).toHaveBeenCalledTimes(1);

    mockRandom.mockRestore();
    loggerWarn.mockRestore();
  });
});

describe('BarChart tests', () => {
  let myChart: InstanceType<typeof BarChart>;
  let xVals: number[] | string[];
  let yVals: ChartYData | ChartYData[];

  beforeEach(() => {
    myChart = new BarChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
      logger: logger,
    });

    xVals = ['category 1', 'category 2', 'category 3', 'category 4'];
    yVals = [{ values: [2, 3, 4, 5] }, { values: [5, 7, 9, 11], label: 'bar 2 label' }];
  });

  test('Simple Bar chart HTML, numeric X, Y values', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    xVals = [1, 2, 3, 4];
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getHtmlBuffer();

    expect(testBuffer.toString()).toMatchSnapshot();

    mockRandom.mockRestore();
  });

  test('Simple Bar chart PNG, text X, numeric Y values', async () => {
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Simple Bar chart PNG, text X, single set of numeric Y values', async () => {
    yVals = { values: [2, 3, 4, 5] };
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Simple Bar chart JPEG, text X, numeric Y values, side-by-side', async () => {
    yVals = [
      { values: [2, 3, 4, 5] },
      { values: [5, 7, 9, 11], label: 'bar 2 label', group: 'second-group' },
    ];
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Simple Bar chart SVG, text X, numeric Y values, side-by-side', async () => {
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getSvgBuffer();

    // resulting string should start and end with <svg> ... </svg>
    const regExp = new RegExp(
      '<\\?xml version="1.0" encoding="utf-8" \\?>\\s*<svg.*</svg>\\s*$',
      's',
    );
    expect(regExp.test(testBuffer.toString('utf8'))).toBe(true);
  });
});

describe('DonutChart tests', () => {
  let myChart: InstanceType<typeof DonutChart>;
  let xVals: number[] | string[];
  let yVals: ChartYData | ChartYData[];

  beforeEach(() => {
    myChart = new DonutChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
      logger: logger,
    });

    xVals = [
      'slice 0:1',
      'slice 0:2',
      'slice 0:3',
      'slice 0:4',
      'slice 1:1',
      'slice 1:2',
      'slice 1:3',
      'slice 1:4',
    ];
    yVals = [
      { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' },
      { values: [2, 3, 4, 5], group: 'second-group' },
    ];
  });

  test('Donut Chart, one set of values, PNG', async () => {
    xVals = ['slice 1', 'slice 2', 'slice 3', 'slice 4'];
    yVals = { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' };
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Donut Chart, two sets of values, JPEG', async () => {
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });
});

describe('PieChart tests', () => {
  let myChart: InstanceType<typeof PieChart>;
  let xVals: number[] | string[];
  let yVals: ChartYData | ChartYData[];

  beforeEach(() => {
    myChart = new PieChart({
      title: 'Chart Title',
      xAxisTitle: 'X Axis title',
      yAxisTitle: 'Y Axis title',
      logger: logger,
    });

    xVals = [
      'slice 0:1',
      'slice 0:2',
      'slice 0:3',
      'slice 0:4',
      'slice 1:1',
      'slice 1:2',
      'slice 1:3',
      'slice 1:4',
    ];
    yVals = [
      { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' },
      { values: [2, 3, 4, 5], group: 'second-group' },
    ];
  });

  test('Pie Chart, one set of values, SVG', async () => {
    xVals = ['slice 1', 'slice 2', 'slice 3', 'slice 4'];
    yVals = { values: [2, 3, 4, 5], label: 'first-set', group: 'first-group' };

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getSvgBuffer();

    // resulting string should start and end with <svg> ... </svg>
    const regExp = new RegExp(
      '<\\?xml version="1.0" encoding="utf-8" \\?>\\s*<svg.*</svg>\\s*$',
      's',
    );
    expect(regExp.test(testBuffer.toString('utf8'))).toBe(true);
  });

  test('Pie Chart, two sets of values, HTML', async () => {
    // getHtmlBuffer() uses Math.random() - mock this function so it returns a deterministic value
    const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getHtmlBuffer();

    expect(testBuffer.toString()).toMatchSnapshot();

    mockRandom.mockRestore();
  });
});

describe('StackedLineChart tests', () => {
  let myChart: InstanceType<typeof StackedLineChart>;
  let xVals: number[];
  let yVals: ChartYData | ChartYData[];

  beforeEach(() => {
    myChart = new StackedLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
      logger: logger,
    });

    xVals = [1, 2, 3, 4];
    yVals = [
      { values: [2, 3, 4, 5], color: 'rgba(255,0,0,1)', fillColor: 'rgba(255,0,0,0.5)' },
      {
        values: [5, 7, 9, 11],
        label: 'line 2 label',
        color: 'rgba(0,255,0,1)',
        fillColor: 'rgba(0,255,0,0.5)',
      },
    ];
  });

  test('Stacked Line chart, single set of y values - PNG', async () => {
    yVals = { values: [2, 3, 4, 5], color: 'rgba(255,0,0,1)', fillColor: 'rgba(255,0,0,0.5)' };

    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getPngBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });

  test('Stacked Line chart, two sets of y values - JPEG', async () => {
    myChart.setChartData(xVals, yVals);
    const testBuffer = await myChart.getJpegBuffer();

    expect(testBuffer.toString('base64')).toMatchSnapshot();
  });
});
