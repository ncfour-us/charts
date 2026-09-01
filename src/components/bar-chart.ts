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

  /**
   * Creates a new BarChart instance.
   *
   * @param options the set of options to specify for the chart.
   */
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
      const yValuesChartYData: ChartYData = yValues as ChartYData;

      const dataPoints = Array.from(yValuesChartYData.values);

      let colorToUse: string;
      if (Array.isArray(yValuesChartYData.color)) {
        colorToUse = yValuesChartYData.color[0];
      } else {
        colorToUse = yValuesChartYData.color ?? 'rgba(0,0,0,1)';
      }

      datasets = [
        {
          data: dataPoints,
          label: yValuesChartYData.label ?? 'bar 1',
          showLine: true,
          backgroundColor: colorToUse,
          borderColor: colorToUse,
          borderWidth: 3,
          stack: yValuesChartYData.group ?? undefined,
        },
      ];
      this.logger?.trace(
        `BarChart.setChartProperties: single yValues.length: ${yValuesChartYData.values.length}`,
      );
    } else {
      const yValuesChartYDataArray: ChartYData[] = yValues as ChartYData[];

      datasets = yValuesChartYDataArray.map((value, lineNum) => {
        const dataPoints = Array.from(value.values);

        let colorToUse: string;
        if (Array.isArray(value.color)) {
          colorToUse = value.color[0];
        } else {
          colorToUse = value.color ?? 'rgba(0,0,0,1)';
        }

        this.logger?.trace(
          `BarChart.setChartProperties: ${lineNum}th yValues.length: ${value.values.length}`,
        );
        return {
          data: dataPoints,
          label: value.label ?? `bar ${lineNum + 1}`,
          showLine: true,
          backgroundColor: colorToUse,
          borderColor: colorToUse,
          borderWidth: 3,
          stack: value.group ?? undefined,
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
