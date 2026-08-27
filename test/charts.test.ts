// Copyright (c) 2026 Tim Hahn

import { test, expect, describe } from '@jest/globals';

import { Chart, ChartYData, XYLineChart } from '../src/index.js';

describe('XYLineChart tests', () => {
  test('single set of y values', () => {
    const myChart: Chart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData = { values: [2, 3, 4, 5] };

    const testBuffer = myChart.getPngBuffer(xVals, yVals);

    expect(testBuffer).toBeDefined();
  });

  test('single set of y values in an array', () => {
    const myChart = new XYLineChart({
      title: 'My Chart Title',
      xAxisTitle: 'My X Axis label',
      yAxisTitle: 'My Y Axis label',
    });

    const xVals: number[] = [1, 2, 3, 4];
    const yVals: ChartYData[] = [{ values: [2, 3, 4, 5] }];

    const testBuffer = myChart.getPngBuffer(xVals, yVals);

    expect(testBuffer).toBeDefined();
  });

  test('double set of y values', () => {
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

    const testBuffer = myChart.getPngBuffer(xVals, yVals);

    expect(testBuffer).toBeDefined();
  });
});
