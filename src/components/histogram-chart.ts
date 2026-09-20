// Copyright (c) 2026 Tim Hahn

import { SampleSet, SampleBucket } from '@ncfour-us/stats';
import { Chart, ChartOptions, ChartXData, ChartYData } from './chart.js';

/**
 * Chart options specific to Box charts
 */
export interface HistogramChartOptions extends ChartOptions {
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
export class HistogramChart extends Chart {
  private xAxisTitle?: string;
  private yAxisTitle?: string;

  /**
   * Creates a new HistogramChart instance.
   *
   * @param options the set of options to specify for the chart.
   */
  constructor(options: HistogramChartOptions) {
    super(options);

    this.xAxisTitle = options.xAxisTitle ?? 'X Axis Title';
    this.yAxisTitle = options.yAxisTitle ?? 'Y Axis Title';
  }

  private setChartProperties(
    xValues: ChartXData,
    yValues: ChartYData | ChartYData[],
    mean?: number,
    stddev?: number,
  ): any {
    let isArray: boolean = false;

    this.logger?.trace(`HistogramChart.setChartProperties: xValues.length: ${xValues.length}`);

    if (Array.isArray(yValues)) {
      isArray = true;
    }

    let datasets;
    let yValuesChartYData: ChartYData;

    if (!isArray) {
      yValuesChartYData = yValues as ChartYData;
    } else {
      yValuesChartYData = (yValues as ChartYData[])[0];
    }

    const dataPoints = Array.from(yValuesChartYData.values);

    const maxYValue = dataPoints.reduce((max, value) => (value > max ? value : max), 0);

    let colorToUse: string;
    if (Array.isArray(yValuesChartYData.color)) {
      colorToUse = yValuesChartYData.color[0];
    } else {
      colorToUse = yValuesChartYData.color ?? 'rgba(0,0,0,1)';
    }

    const fillColorToUse = yValuesChartYData.fillColor ?? 'rgba(150,150,150,1)';

    datasets = [
      {
        type: 'bar',
        data: dataPoints,
        label: yValuesChartYData.label ?? 'histogram 1',
        showLine: true,
        order: 5,
        backgroundColor: fillColorToUse,
        borderColor: colorToUse,
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        grouped: false,
        // stack: yValuesChartYData.group ?? undefined,
      },
    ];
    this.logger?.trace(
      `HistogramChart.setChartProperties: single yValues.length: ${yValuesChartYData.values.length}`,
    );

    const chartProperties: any = {
      // type: 'bar',
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
          x2: {
            min: xValues[0],
            max: xValues[xValues.length - 1],
            type: 'linear',
            display: false,
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

    if (mean) {
      chartProperties.data.datasets.push({
        type: 'scatter',
        label: '\u{03A3}',
        data: [
          {
            x: mean,
            y: 0,
          },
          {
            x: mean,
            y: maxYValue,
          },
        ],
        xAxisID: 'x2',
        showLine: true,
        order: 0,
        pointRadius: 0,
        borderWidth: 2,
        borderColor: 'rgba(0,255,0,1)',
        backgroundColor: 'rgba(0,255,0,1)',
        grouped: false,
      });

      if (stddev) {
        chartProperties.data.datasets.push({
          type: 'scatter',
          label: '\u{03C3} low',
          data: [
            {
              x: mean - stddev,
              y: 0,
            },
            {
              x: mean - stddev,
              y: maxYValue,
            },
          ],
          xAxisID: 'x2',
          showLine: true,
          order: 0,
          pointRadius: 0,
          borderWidth: 2,
          borderColor: 'rgba(0,0,255,1)',
          backgroundColor: 'rgba(0,0,255,1)',
          grouped: false,
        });
        chartProperties.data.datasets.push({
          type: 'scatter',
          label: '\u{03C3} high',
          data: [
            {
              x: mean + stddev,
              y: 0,
            },
            {
              x: mean + stddev,
              y: maxYValue,
            },
          ],
          xAxisID: 'x2',
          showLine: true,
          order: 0,
          pointRadius: 0,
          borderWidth: 2,
          borderColor: 'rgba(0,0,255,1)',
          backgroundColor: 'rgba(0,0,255,1)',
          grouped: false,
        });
      }
    }

    return chartProperties;
  }

  /**
   * Specify the data points for an Histogram chart.
   *
   * Using this method allows for re-using the Histogram title(s) and
   * any other settings while plotting different data.
   *
   * If labels are NOT provided for the yValues, then the label
   * will be set to 'histogram &lt;num&gt;' where num is 1, 2, ....
   *
   * @param xValues the vector of X values
   * @param yValues the vector(s) of Y values corresponding to the X values
   */
  public setChartData(xValues: ChartXData, yValues: ChartYData | ChartYData[]): void {
    this.chartProperties = this.setChartProperties(xValues, yValues);
  }

  /**
   * Specify the data points for an Histogram chart.
   *
   * Using this method allows for re-using the Histogram title(s) and
   * any other settings while plotting different data.
   *
   * If labels are NOT provided for the yValues, then the label
   * will be set to 'histogram &lt;num&gt;' where num is 1, 2, ....
   *
   * @param xValues the vector of X values
   * @param yValues the vector(s) of Y values corresponding to the X values
   */
  public setChartDataWithAnnotations(
    xValues: ChartXData,
    yValues: ChartYData | ChartYData[],
    mean?: number,
    stddev?: number,
  ): void {
    this.chartProperties = this.setChartProperties(xValues, yValues, mean, stddev);
  }

  /**
   * Specify the data points for an Histogram chart.
   *
   * Using this method allows direct usage of a SampleSet
   * created or built using the @ncfour-us/stats package.
   *
   * @param sampleSet the set of values containing a probability distribution.
   */
  public setChartDataUsingSampleSet(sampleSet: SampleSet): void {
    const distribution: SampleBucket[] = sampleSet.getDistribution();
    const xValues = distribution.map((bucket) => bucket.midPoint);
    const yValues: ChartYData = {
      values: distribution.map((bucket) => bucket.count),
      label: 'count',
    };

    if (sampleSet.isNumeric()) {
      const mean = sampleSet.getMean() as number;
      const stddev = sampleSet.getStddev();

      this.chartProperties = this.setChartProperties(xValues, yValues, mean, stddev);
    } else {
      // TODO: figure out how to handle the mean/stddev when nonNUmeric data.
      this.chartProperties = this.setChartProperties(xValues, yValues);
    }
  }
}
