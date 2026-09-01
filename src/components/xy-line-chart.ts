// Copyright (c) 2026 Tim Hahn

import { Chart, ChartOptions, ChartXData, ChartYData } from './chart.js';

/**
 * Chart options specific to XY Line charts
 */
export interface XYLineChartOptions extends ChartOptions {
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
 * Create a XY scatter plot with lines connecting the X,Y coordinates.
 *
 * Multiple Y value sets can be provided resulting in multiple lines
 * being drawn on the plot.
 */
export class XYLineChart extends Chart {
  private xAxisTitle?: string;
  private yAxisTitle?: string;

  /**
   * Creates a new XYLineChart instance.
   *
   * @param options the set of options to specify for the chart.
   */
  constructor(options: XYLineChartOptions) {
    super(options);

    this.xAxisTitle = options.xAxisTitle ?? 'X Axis Title';
    this.yAxisTitle = options.yAxisTitle ?? 'Y Axis Title';
  }

  private setChartProperties(xValues: ChartXData, yValues: ChartYData | ChartYData[]): any {
    let isArray: boolean = false;

    this.logger?.trace(`XYLineChart.setChartProperties: xValues.length: ${xValues.length}`);

    if (Array.isArray(yValues)) {
      isArray = true;
    }

    let datasets;

    if (!isArray) {
      const yValuesChartYData: ChartYData = yValues as ChartYData;

      const dataPoints = yValuesChartYData.values.map((val, index) => {
        return {
          x: xValues[index],
          y: val,
        };
      });

      let colorToUse: string;
      if (Array.isArray(yValuesChartYData.color)) {
        colorToUse = yValuesChartYData.color[0];
      } else {
        colorToUse = yValuesChartYData.color ?? 'rgba(0,0,0,1)';
      }

      datasets = [
        {
          data: dataPoints,
          label: yValuesChartYData.label ?? 'line 1',
          showLine: true,
          backgroundColor: colorToUse,
          borderColor: colorToUse,
          borderWidth: 3,
          pointRadius: 1,
        },
      ];
      this.logger?.trace(
        `XYLineChart.setChartProperties: single yValues.length: ${yValuesChartYData.values.length}`,
      );
    } else {
      const yValuesChartYDataArray: ChartYData[] = yValues as ChartYData[];

      datasets = yValuesChartYDataArray.map((value, lineNum) => {
        const dataPoints = value.values.map((val, index) => {
          return {
            x: xValues[index],
            y: val,
          };
        });

        let colorToUse: string;
        if (Array.isArray(value.color)) {
          colorToUse = value.color[0];
        } else {
          colorToUse = value.color ?? 'rgba(0,0,0,1)';
        }

        this.logger?.trace(
          `XYLineChart.setChartProperties: ${lineNum}th yValues.length: ${value.values.length}`,
        );
        return {
          data: dataPoints,
          label: value.label ?? `line ${lineNum + 1}`,
          showLine: true,
          backgroundColor: colorToUse,
          borderColor: colorToUse,
          borderWidth: 3,
          pointRadius: 1,
        };
      });
    }

    const chartProperties: any = {
      type: 'scatter',
      data: {
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
          },
          y: {
            title: {
              display: true,
              text: this.yAxisTitle,
            },
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
