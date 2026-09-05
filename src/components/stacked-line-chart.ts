// Copyright (c) 2026 Tim Hahn

import { Chart, ChartOptions, ChartXData, ChartYData } from './chart.js';

/**
 * Chart options specific to Stacked Line charts
 */
export interface StackedLineChartOptions extends ChartOptions {
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
 * Create a stacked line chart with the supplied datasets.
 *
 * Multiple Y value sets can be provided resulting in multiple lines
 * being drawn on the plot.  Lines are stacked in the order that they are
 * provided in the dataset.
 */
export class StackedLineChart extends Chart {
  private xAxisTitle?: string;
  private yAxisTitle?: string;

  /**
   * Creates a new StackedLineChart instance.
   *
   * @param options the set of options to specify for the chart.
   */
  constructor(options: StackedLineChartOptions) {
    super(options);

    this.xAxisTitle = options.xAxisTitle ?? 'X Axis Title';
    this.yAxisTitle = options.yAxisTitle ?? 'Y Axis Title';
  }

  private setChartProperties(xValues: ChartXData, yValues: ChartYData | ChartYData[]): any {
    let isArray: boolean = false;

    this.logger?.trace(`StackedLineChart.setChartProperties: xValues.length: ${xValues.length}`);

    if (Array.isArray(yValues)) {
      isArray = true;
    }

    let datasets;

    if (!isArray) {
      const yValuesChartYData: ChartYData = yValues as ChartYData;

      const dataPoints = yValuesChartYData.values.map((val) => val);

      let colorToUse: string;
      if (Array.isArray(yValuesChartYData.color)) {
        colorToUse = yValuesChartYData.color[0];
      } else {
        colorToUse = yValuesChartYData.color ?? 'rgba(0,0,0,1)';
      }

      const fillColorToUse = yValuesChartYData.fillColor ?? 'rgba(100,100,100,0.5)';

      datasets = [
        {
          data: dataPoints,
          label: yValuesChartYData.label ?? 'line 1',
          showLine: true,
          backgroundColor: fillColorToUse,
          borderColor: colorToUse,
          fill: 'stack',
          borderWidth: 3,
          pointRadius: 1,
        },
      ];
      this.logger?.trace(
        `StackedLineChart.setChartProperties: single yValues.length: ${yValuesChartYData.values.length}`,
      );
    } else {
      const yValuesChartYDataArray: ChartYData[] = yValues as ChartYData[];

      datasets = yValuesChartYDataArray.map((value, lineNum) => {
        const dataPoints = value.values.map((val) => val);

        let colorToUse: string;
        if (Array.isArray(value.color)) {
          colorToUse = value.color[0];
        } else {
          colorToUse = value.color ?? 'rgba(0,0,0,1)';
        }

        const fillColorToUse = value.fillColor ?? 'rgba(100,100,100,0.5)';

        this.logger?.trace(
          `StackedLineChart.setChartProperties: ${lineNum}th yValues.length: ${value.values.length}`,
        );
        return {
          data: dataPoints,
          label: value.label ?? `line ${lineNum + 1}`,
          showLine: true,
          backgroundColor: fillColorToUse,
          borderColor: colorToUse,
          fill: 'stack',
          borderWidth: 3,
          pointRadius: 1,
        };
      });
    }

    const chartProperties: any = {
      type: 'line',
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
          filler: {
            propagate: false,
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
            stacked: true,
          },
        },
      },
    };

    return chartProperties;
  }

  /**
   * Specify the data points for an Stacked Line chart.
   *
   * Using this method allows for re-using the Stacked Line chart title(s) and
   * any other settings while plotting different data.
   *
   * The color option for the yValue represents the line/point color
   * while the fillColor option for the yValue represents the area fill color
   * between stacked lines.
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
