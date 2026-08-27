// Copyright (c) 2026 Tim Hahn

import {
  CategoryScale,
  Chart as ChartJS,
  BarController,
  Title,
  Legend,
  BarElement,
  ScatterController,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';

// import type { ChartConfiguration, /*ChartDataset,*/ ChartData } from 'chart.js';

import { Canvas } from 'skia-canvas';
// import { createCanvas } from 'canvas';

ChartJS.register([
  Title,
  Legend,
  CategoryScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  ScatterController,
  LinearScale,
  PointElement,
]);

import { Chart, ChartParms, ChartYData } from './chart.js';

export class XYLineChart extends Chart {
  private xAxisTitle?: string;
  private yAxisTitle?: string;

  constructor(parms: ChartParms) {
    super(parms);

    this.xAxisTitle = parms.xAxisTitle ?? 'X Axis Title';
    this.yAxisTitle = parms.yAxisTitle ?? 'Y Axis Title';
  }

  private setChartProperties(xValues: number[], yValues: ChartYData | ChartYData[]): any {
    let isArray: boolean = false;

    if (Array.isArray(yValues)) {
      isArray = true;
    }

    let datasets;

    if (!isArray) {
      const dataPoints = (yValues as ChartYData).values.map((val, index) => {
        return {
          x: xValues[index],
          y: val,
        };
      });
      datasets = [
        {
          data: dataPoints,
          label: (yValues as ChartYData).label ?? 'line 1',
          showLine: true,
          backgroundColor: (yValues as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderColor: (yValues as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderWidth: 3,
          pointRadius: 1,
        },
      ];
    } else {
      datasets = (yValues as ChartYData[]).map((value, lineNum) => {
        const dataPoints = (value as ChartYData).values.map((val, index) => {
          return {
            x: xValues[index],
            y: val,
          };
        });
        return {
          data: dataPoints,
          label: (value as ChartYData).label ?? `line ${lineNum + 1}`,
          showLine: true,
          backgroundColor: (value as ChartYData).color ?? 'rgba(0,0,0,1)',
          borderColor: (value as ChartYData).color ?? 'rgba(0,0,0,1)',
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

  async getPngBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<Buffer> {
    const chartProperties = this.setChartProperties(xValues, yValues);

    const canvas = new Canvas(800, 600);

    const chart = new ChartJS(
      canvas as any, // TypeScript needs "as any" here
      chartProperties,
    );

    const pngBuffer = await canvas.toBuffer('png', { matte: 'rgba(255,255,255,1)', quality: 1.0 });

    chart.destroy();

    return pngBuffer;
  }

  async getJpegBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<Buffer> {
    const chartProperties = this.setChartProperties(xValues, yValues);

    const canvas = new Canvas(800, 600);

    const chart = new ChartJS(
      canvas as any, // TypeScript needs "as any" here
      chartProperties,
    );

    const jpegBuffer = await canvas.toBuffer('jpg', { matte: 'rgba(255,255,255,1)', quality: 1.0 });

    chart.destroy();

    return Promise.resolve(jpegBuffer);
  }

  async getSvgBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<Buffer> {
    const chartProperties = this.setChartProperties(xValues, yValues);

    const canvas = new Canvas(800, 600);

    const chart = new ChartJS(
      canvas as any, // TypeScript needs "as any" here
      chartProperties,
    );

    const svgBuffer = await canvas.toBuffer('svg', { matte: 'rgba(255,255,255,1)', outline: true });

    chart.destroy();

    return Promise.resolve(svgBuffer);
  }

  async getHtmlBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<string> {
    let htmlBuffer: string = '';

    htmlBuffer = `
    <div style="height: 80vh, width: 60vh; margin: auto;">
      <canvas id="myScatterChart">

      <script>
        // 1. Get the drawing context from the canvas element
        // const ctx2 = document.getElementById('myScatterChart').getContext('2d');
        const ctx2 = document.currentScript.parentElement.getContext('2d');
    `;

    const chartProperties = this.setChartProperties(xValues, yValues);

    htmlBuffer += `
        // 2. Set chart properties
        const chartProperties = ${JSON.stringify(chartProperties, null, 2)}`;

    htmlBuffer += `
        // 3. Render the chart
        const myChart = new Chart(ctx2, chartProperties);
        </script>
      </canvas>
    </div>
    `;
    return Promise.resolve(htmlBuffer);
  }
}
