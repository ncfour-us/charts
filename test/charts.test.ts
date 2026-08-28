// Copyright (c) 2026 Tim Hahn

import { test, expect, describe } from '@jest/globals';

import { Chart, ChartYData, XYLineChart, BarChart } from '@ncfour-us/charts';

describe('XYLineChart tests', () => {
  test('single set of y values - PNG', () => {
    const myChart: Chart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData = { values: [2, 3, 4, 5] };

    myChart.setChartData(xVals, yVals);
    const testBuffer = myChart.getPngBuffer();

    expect(testBuffer).toBeDefined();
  });

  test('single set of y values in an array - JPEG', () => {
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [{ values: [2, 3, 4, 5] }];

    myChart.setChartData(xVals, yVals);
    const testBuffer = myChart.getJpegBuffer();

    expect(testBuffer).toBeDefined();
  });

  test('double set of y values - PNG', () => {
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
    const testBuffer = myChart.getPngBuffer();

    expect(testBuffer).toBeDefined();
  });

  test('double set of y values - SVG', () => {
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
    const testBuffer = myChart.getSvgBuffer();

    expect(testBuffer).toBeDefined();
  });

  test('double set of y values - HTML', () => {
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
    const testBuffer = myChart.getHtmlBuffer();

    expect(testBuffer).toBeDefined();
  });
});

describe('BarChart tests', () => {
  test('Simple Bar chart, numeric X, Y values', () => {
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
    const testBuffer = myChart.getHtmlBuffer();

    expect(testBuffer).toBeDefined();
  });
});
