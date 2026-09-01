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
   *
   * Any number passed in that is less than 0 or greater than 1 will
   * be ignored, defaulting to 0.5.
   */
  stripeWidth?: number;
}

interface ChartPropertyReplacement {
  target: string;
  value: string;
}

/**
 * Create a Donut chart with stripes corresponding to the Y values.
 *
 * Multiple Y value sets can be provided resulting in concentric stripes.
 *
 */
export class DonutChart extends Chart {
  private stripeWidth: number;

  /**
   * Creates a new DonutChart instance.
   *
   * @param options the set of options to specify for the chart.
   */
  constructor(options: DonutChartOptions) {
    super(options);

    this.stripeWidth = options.stripeWidth ?? 0.5;

    if (this.stripeWidth > 1 || this.stripeWidth < 0) {
      this.stripeWidth = 0.5;
    }

    this.logger?.trace(`DonutChart.constructor: stripWidth: ${this.stripeWidth}`);
  }

  private genLabelsFunction(chart: any) {
    // Get the default label list
    const original = ChartJS.overrides.doughnut.plugins.legend.labels.generateLabels;
    const labelsOriginal = original.call(this, chart);

    // Build an array of colors used in the datasets of the chart
    let datasetColors = chart.data.datasets.map(function (e: any, index: number) {
      const dsColors = e.backgroundColor.map((color: any) => {
        return { color: color, dsIndex: index };
      });
      return dsColors;
    });
    datasetColors = datasetColors.flat();

    // console.log(`${datasetColors}, labelsOrig.length=${labelsOriginal.length}`);

    // Modify the color and hide state of each label
    labelsOriginal.forEach((label: any, index: any) => {
      // Set the correct dataset index for each label
      label.datasetIndex = datasetColors[index].dsIndex;

      // The hidden state must match the dataset's hidden state
      label.hidden = !chart.isDatasetVisible(datasetColors[index].dsIndex);

      // Change the color to match the color specified for the individual data value in the dataset
      label.fillStyle = datasetColors[index].color;

      // Change the title to show both the label (xValue) and the dataset name (dataset label)
      label.text = `${label.text} (${chart.data.datasets[datasetColors[index].dsIndex].label})`;
    });

    return labelsOriginal;
  }

  private setChartProperties(xValues: ChartXData, yValues: ChartYData | ChartYData[]): any {
    let isArray: boolean = false;

    this.logger?.trace(`DonutChart.setChartProperties: xValues.length: ${xValues.length}`);

    if (Array.isArray(yValues)) {
      isArray = true;
    }

    let datasets;
    let xValuesAdjusted;

    if (!isArray) {
      const dataPoints = Array.from((yValues as ChartYData).values);
      datasets = [
        {
          data: dataPoints,
          label: (yValues as ChartYData).label ?? 'dataset 1',
          backgroundColor: (yValues as ChartYData).color ?? 'rgba(0,0,0,1)',
        },
      ];
      this.logger?.trace(
        `DonutChart.setChartProperties: single yValues.length: ${(yValues as ChartYData).values.length}`,
      );

      // The set of data (slice) labels MUST match the number of data points - fill in or remove
      // as necessary
      if (xValues.length < datasets[0].data.length) {
        // Add or Remove values from the xValues to match the number of yValues
        xValuesAdjusted = xValues.map((value) => value);
        for (let i = xValues.length; i < datasets[0].data.length; i++) {
          xValuesAdjusted.push(`slice ${i + 1}`);
        }
      } else if (xValues.length > datasets[0].data.length) {
        xValuesAdjusted = xValues.slice(0, datasets[0].data.length);
      }
    } else {
      let numDataPoints: number = 0;

      datasets = (yValues as ChartYData[]).map((value, lineNum) => {
        const dataPoints = Array.from((value as ChartYData).values);
        numDataPoints += dataPoints.length;
        this.logger?.trace(
          `DonutChart.setChartProperties: ${lineNum}th yValues.length: ${(value as ChartYData).values.length}`,
        );
        let backgroundColors;
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
          label: (value as ChartYData).label ?? `dataset ${lineNum + 1}`,
          backgroundColor: backgroundColors,
        };
      });

      // The set of data (slice) labels MUST match the number of data points - fill in or remove
      // as necessary
      if (xValues.length < numDataPoints) {
        // Add or Remove values from the xValues to match the number of yValues
        xValuesAdjusted = xValues.map((value) => value);
        for (let i = xValues.length; i < numDataPoints; i++) {
          xValuesAdjusted.push(`slice ${i + 1}`);
        }
      } else if (xValues.length > numDataPoints) {
        xValuesAdjusted = xValues.slice(0, numDataPoints);
      }
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

              // generateLabels: this.genLabelsFunction,
              generateLabels: this.genLabelsFunction,

              // function (chart: any) {
              //   // Get the default label list
              //   const original = ChartJS.overrides.doughnut.plugins.legend.labels.generateLabels;
              //   const labelsOriginal = original.call(this, chart);

              //   // Build an array of colors used in the datasets of the chart
              //   let datasetColors = (chart.data.datasets as Array<any>).map(function (e) {
              //     return e.backgroundColor;
              //   });
              //   datasetColors = datasetColors.flat();

              //   // Modify the color and hide state of each label
              //   (labelsOriginal as Array<any>).forEach((label) => {
              //     // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
              //     label.datasetIndex = (label.index - (label.index % numYValues)) / numYValues;

              //     // The hidden state must match the dataset's hidden state
              //     label.hidden = !chart.isDatasetVisible(label.datasetIndex);

              //     // Change the color to match the dataset
              //     label.fillStyle = datasetColors[label.index];
              //   });

              //   return labelsOriginal;
              // },
            },
            // NOTE - this function was lifted from Chart.js example at:
            // https://www.chartjs.org/docs/latest/samples/other-charts/multi-series-pie.html
            //
            onClick: function (_mouseEvent: any, legendItem: any, legend: any) {
              // toggle the visibility of the dataset from what it currently is
              legend.chart.getDatasetMeta(legendItem.datasetIndex).hidden =
                legend.chart.isDatasetVisible(legendItem.datasetIndex);
              legend.chart.update();
            },
            position: 'right',
          },
          // tooltip: {
          //   callbacks: {
          //     title: function(context: any) {
          //       const datasetOffsets: number[] = [];
          //       context.chart.data.datasets.forEach((_e: any, index: number) => {
          //         let offset = 0;
          //         for ( let i=0; i<index; i++) {
          //           offset+=context.chart.data.datasets[i].data.length;
          //         }
          //         datasetOffsets.push(offset);
          //       } );
          //       const labelIndex = datasetOffsets[context.datasetIndex] + context.dataIndex;
          //       return context.chart.data.labels[labelIndex];
          //     },
          //     label: function(context: any) {
          //       // add preceding spaces here to separate from the colorbox
          //       return `  ${context.formattedValue}`;
          //     },
          //   },
          // },
        },
      },
    };

    // chartProperties.options.plugins.legend.labels.generateLabels = this.genLabelsFunction;
    // chartProperties.options.plugins.legend.labels.generateLabels = '{{wigglewiggle}}';

    this.logger?.trace(
      `DonutChart.setChartProperties: generateLabelsFunction: ${this.genLabelsFunction.toString().replace('genLabelsFunction', 'function').replace('ChartJS', 'Chart')}`,
    );

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

  public async getHtmlBuffer(): Promise<string> {
    const chartPropertyReplacements: ChartPropertyReplacement[] = [];

    const generateLabelsFunction =
      this.chartProperties.options.plugins.legend.labels.generateLabels;

    // set up replacements for callbacks defined in chartProperties
    this.chartProperties.options.plugins.legend.labels.generateLabels =
      '{{generateLabelsFunction}}';
    chartPropertyReplacements.push({
      target: '"{{generateLabelsFunction}}"',
      value: this.genLabelsFunction
        .toString()
        .replace('genLabelsFunction', 'function')
        .replace('ChartJS', 'Chart'),
    });

    let htmlBuffer: string = await super.getHtmlBuffer();

    // adjust the resulting script in the returned htmlBuffer to include the callback functions
    chartPropertyReplacements.forEach((replacement: ChartPropertyReplacement) => {
      this.logger?.trace(
        `DonutChart.getHtmlBuffer: replacing: ${replacement.target} with: ${replacement.value}`,
      );
      htmlBuffer = htmlBuffer.replace(replacement.target, replacement.value);
    });

    this.logger?.trace(`DonutChart.getHtmlBuffer: htmlBuffer: ${htmlBuffer}`);

    // restore the chartProperties to contain the callbacks
    this.chartProperties.options.plugins.legend.labels.generateLabels = generateLabelsFunction;

    return htmlBuffer;
  }
}

/**
 * Create a Pie chart with slices corresponding to the Y values.
 *
 * Multiple Y value sets can be provided resulting in concentric circles.
 *
 * A Pie chart is simply a Donut chart with slices that take up
 * the entire circle.
 *
 */
export class PieChart extends DonutChart {
  /**
   * Creates a new PieChart instance.
   *
   * @param options the set of options to specify for the chart.
   */
  constructor(options: DonutChartOptions) {
    super({ ...options, stripeWidth: 1 });
  }
}
