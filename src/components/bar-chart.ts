// Copyright (c) 2026 Tim Hahn

import { Chart, ChartOptions, ChartXData, ChartYData } from './chart.js';

/**
 * Chart options specific to Box charts
 */
export interface BarChartOptions extends ChartOptions {
  /**
   * X Axis title, defaults to 'X Axis Title'
   */
  xAxisTitle?: string;

  /**
   * Y Axis title, defaults to 'Y Axis Title'
   */
  yAxisTitle?: string;
}

/**
 * Create a Bar chart with stacked bars corresponding to the Y values.
 *
 * Multiple Y value sets can be provided resulting in side-by-side
 * stacks of bars.  Group Y values into each stack by using the same
 * group value for the ChartYData information.
 */
export class BarChart extends Chart {
  private xAxisTitle?: string;
  private yAxisTitle?: string;

  constructor(options: BarChartOptions) {
    super(options);

    this.xAxisTitle = options.xAxisTitle ?? 'X Axis Title';
    this.yAxisTitle = options.yAxisTitle ?? 'Y Axis Title';
  }

  private setChartProperties(xValues: ChartXData, yValues: ChartYData | ChartYData[]): any {
    let isArray: boolean = false;

    this.logger?.trace(`BarChart.setChartProperties: xValues.length: ${xValues.length}`);

    if (Array.isArray(yValues)) {
      isArray = true;
    }

    let datasets;

    if (!isArray) {
      const dataPoints = Array.from((yValues as ChartYData).values);
      datasets = [
        {
          data: dataPoints,
          label: (yValues as ChartYData).label ?? 'bar 1',
          showLine: true,
          backgroundColor: (yValues as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderColor: (yValues as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderWidth: 3,
          stack: (yValues as ChartYData).group ?? undefined,
        },
      ];
      this.logger?.trace(
        `BarChart.setChartProperties: single yValues.length: ${(yValues as ChartYData).values.length}`,
      );
    } else {
      datasets = (yValues as ChartYData[]).map((value, lineNum) => {
        const dataPoints = Array.from((value as ChartYData).values);
        this.logger?.trace(
          `BarChart.setChartProperties: ${lineNum}th yValues.length: ${(value as ChartYData).values.length}`,
        );
        return {
          data: dataPoints,
          label: (value as ChartYData).label ?? `bar ${lineNum + 1}`,
          showLine: true,
          backgroundColor: (value as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderColor: (value as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderWidth: 3,
          stack: (value as ChartYData).group ?? undefined,
        };
      });
    }
    const chartProperties: any = {
      type: 'bar',
      data: {
        labels: xValues.map((value) => value),
        datasets: datasets,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          legend: {
            display: true,
            labels: {
              color: 'black',
            },
            position: 'right',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.xAxisTitle,
            },
            stacked: true,
          },
          y: {
            title: {
              display: true,
              text: this.yAxisTitle,
            },
            stacked: true,
          },
        },
      },
    };

    return chartProperties;
  }

  /**
   * Specify the data points for an XY Line chart.
   *
   * Using this method allows for re-using the XY Line chart title(s) and
   * any other settings while plotting different data.
   *
   * If labels are NOT provided for the yValues, then the label
   * will be set to 'Line &lt;num&gt;' where num is 1, 2, ....
   *
   * @param xValues the vector of X values
   * @param yValues the vector(s) of Y values corresponding to the X values
   */
  public setChartData(xValues: ChartXData, yValues: ChartYData | ChartYData[]): void {
    this.chartProperties = this.setChartProperties(xValues, yValues);
  }
}
