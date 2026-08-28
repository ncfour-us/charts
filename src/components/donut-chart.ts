// Copyright (c) 2026 Tim Hahn

import { Chart as ChartJS } from 'chart.js';
import { Chart, ChartOptions, ChartXData, ChartYData } from './chart.js';

/**
 * Chart options specific to Box charts
 */
export interface DonutChartOptions extends ChartOptions {
  /**
   * X Axis title, defaults to 'X Axis Title'
   */
  xAxisTitle?: string;

  /**
   * Y Axis title, defaults to 'Y Axis Title'
   */
  yAxisTitle?: string;

  /**
   * Width of the donut (between 0 and 1) as a percentage of the radius.
   * Defaults to 0.5
   */
  stripeWidth?: number;
}

/**
 * Create a Donut chart with stripes corresponding to the Y values.
 *
 * Multiple Y value sets can be provided resulting in concentric stripes.
 *
 */
export class DonutChart extends Chart {
  private xAxisTitle?: string;
  private yAxisTitle?: string;
  private stripeWidth: number;

  constructor(options: DonutChartOptions) {
    super(options);

    this.xAxisTitle = options.xAxisTitle ?? 'X Axis Title';
    this.yAxisTitle = options.yAxisTitle ?? 'Y Axis Title';

    this.stripeWidth = options.stripeWidth ?? 0.5;

    if (this.stripeWidth > 100 || this.stripeWidth <= 0) {
      this.stripeWidth = 0.5;
    }

    this.logger?.trace(
      `DonutChart.constructor: xAxisTitle: ${this.xAxisTitle}, yAxisTitle: ${this.yAxisTitle}`,
    );
  }

  private setChartProperties(xValues: ChartXData, yValues: ChartYData | ChartYData[]): any {
    let isArray: boolean = false;
    let numYValues: number = 1;

    this.logger?.trace(`BoxChart.setChartProperties: xValues.length: ${xValues.length}`);

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
          backgroundColor: (yValues as ChartYData).color ?? 'rgba(0,0,0,1)',
        },
      ];
      this.logger?.trace(
        `XYLineChart.setChartProperties: single yValues.length: ${(yValues as ChartYData).values.length}`,
      );
    } else {
      datasets = (yValues as ChartYData[]).map((value, lineNum) => {
        const dataPoints = Array.from((value as ChartYData).values);
        this.logger?.trace(
          `XYLineChart.setChartProperties: ${lineNum}th yValues.length: ${(value as ChartYData).values.length}`,
        );
        let backgroundColors;
        numYValues = (value as ChartYData).values.length;
        if (Array.isArray((value as ChartYData).color)) {
          if ((value as ChartYData).color) {
            backgroundColors = ((value as ChartYData).color as Array<string>).map((val) => val);
          } else {
            backgroundColors = 'rgba(0,0,0,1)';
          }
        } else {
          backgroundColors = (value as ChartYData).color ?? 'rgba(0,0,0,1)';
        }
        return {
          data: dataPoints,
          label: (value as ChartYData).label ?? `bar ${lineNum + 1}`,
          backgroundColor: backgroundColors,
        };
      });
    }
    const chartProperties: any = {
      type: 'doughnut',
      data: {
        labels: xValues.map((value) => value),
        datasets: datasets,
      },
      options: {
        cutout: `${(1 - this.stripeWidth) * 100}%`,
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          legend: {
            display: true,
            labels: {
              // NOTE - this function was lifted from Chart.js example at:
              // https://www.chartjs.org/docs/latest/samples/other-charts/multi-series-pie.html
              //
              // Because it is not carried forward into generated HTML, it does NOT work in .html
              // files.
              generateLabels: function (chart: any) {
                // Get the default label list
                const original = ChartJS.overrides.doughnut.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chart);

                // Build an array of colors used in the datasets of the chart
                let datasetColors = (chart.data.datasets as Array<any>).map(function (e) {
                  return e.backgroundColor;
                });
                datasetColors = datasetColors.flat();

                // Modify the color and hide state of each label
                (labelsOriginal as Array<any>).forEach((label) => {
                  // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                  label.datasetIndex = (label.index - (label.index % numYValues)) / numYValues;

                  // The hidden state must match the dataset's hidden state
                  label.hidden = !chart.isDatasetVisible(label.datasetIndex);

                  // Change the color to match the dataset
                  label.fillStyle = datasetColors[label.index];
                });

                return labelsOriginal;
              },
            },
            position: 'right',
          },
        },
        // scales: {
        //   x: {
        //     title: {
        //       display: true,
        //       text: this.xAxisTitle,
        //     },
        //     stacked: true,
        //   },
        //   y: {
        //     title: {
        //       display: true,
        //       text: this.yAxisTitle,
        //     },
        //     stacked: true,
        //   },
        // },
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
