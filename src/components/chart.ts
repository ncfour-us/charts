// Copyright (c) 2026 Tim Hahn

import { ILogger } from '@ncfour-us/logging';

import {
  CategoryScale,
  Chart as ChartJS,
  BarController,
  DoughnutController,
  Title,
  Legend,
  BarElement,
  ScatterController,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';

import { Canvas } from 'skia-canvas';

// This import needs to be done dynamically to allow for mocking the writeFile
// function in Jest unit tests.
const { writeFile } = await import('node:fs/promises');

ChartJS.register([
  Title,
  Legend,
  CategoryScale,
  BarController,
  BarElement,
  DoughnutController,
  LineController,
  LineElement,
  ScatterController,
  LinearScale,
  PointElement,
  ArcElement,
]);

/**
 * Options for any chart
 */
export interface ChartOptions {
  /**
   * title for the chart, defaults to 'Chart Title'
   */
  title?: string;

  /**
   * background color for charts, defaults to 'rgba(0,0,0,0)' (transparent).
   */
  backgroundColor?: string;

  /**
   * optional logger for the Chart object to use
   */
  logger?: ILogger;
}

/**
 * Parameters for the Chart
 * @deprecated use {@link ChartOptions} instead
 */
export interface ChartParms extends ChartOptions {
  /**
   * X Axis title
   */
  xAxisTitle?: string;

  /**
   * Y Axis title
   */
  yAxisTitle?: string;
}

/**
 * Type for the vector of values on the X axis.
 *
 * This can also be the set of labels (Box charts, Pie/Doughnut charts)
 * for data.
 */
export type ChartXData = number[] | string[];

/**
 * Type for the vector of values to be plotted on the Y axis.
 */
export interface ChartYData {
  /**
   * set of data points to plot
   */
  values: number[];

  /**
   * Label to use in the chart legend, defaults to 'line &lt;num&gt;'
   * where &lt;num&gt; is the index of the Y values in an array of Y values.
   */
  label?: string;

  /**
   * color for the data points/line, defaults to 'rgba(0,0,0,1)' (black)
   *
   * For XY-Line and Bar charts, only a single value is used.  If an array
   * is passed, the value at array index 0 is used.
   *
   * For Donut and Pie charts, an array of values is used, in order,
   * for the colors of the slices of the Donut/Pie.
   */
  color?: string | string[];

  /**
   * if multiple Y values are to be stacked or grouped, this string is
   * used to group those Y values.  No default value.
   */
  group?: string;
}

/**
 * Base class for various types of charts.
 *
 * This class implements several functions to render the
 * charts, while sub-classes are responsible for setting
 * up the chart properties for the chart based on the chart
 * type selected.
 *
 * see {@link XYLineChart}.
 */
export abstract class Chart {
  protected title: string;
  private backgroundColor: string;
  protected chartProperties: any;

  // dependencies
  protected logger?: ILogger;

  constructor(options: ChartOptions) {
    // dependencies
    this.logger = options.logger;

    this.title = options.title ?? 'Chart Title';
    this.backgroundColor = options.backgroundColor ?? 'rgba(0,0,0,0)';
    this.chartProperties = {};
  }

  /**
   * Set the chart data points to be rendered in the chart.
   *
   * @param xValues the X values for the chart (eithet X axis or labels)
   * @param yValues the Y values (possibly multiple of them) corresponding to the X values
   */
  public abstract setChartData(xValues: ChartXData, yValues: ChartYData | ChartYData[]): void;

  /**
   * Generate a PNG of the chart.
   *
   * Use Buffer.toString('base64') to get a usable string.
   *
   * If embedding into an HTML document, prepend the Base-64 encoded string with
   * 'data:image/png;base64,'.  For example:
   *
   * &lt;img src="data:img/png;base64,&lt;base64-data-here&gt;" alt="interesting chart"&gt;
   *
   * @returns a Buffer containing a rasterized PNG image of the chart.
   */
  public async getPngBuffer(): Promise<Buffer> {
    const canvas = new Canvas(800, 600);

    const chart = new ChartJS(
      canvas as any, // TypeScript needs "as any" here
      this.chartProperties,
    );

    this.logger?.trace(
      `Chart.getPngBuffer: chartProperties: ${JSON.stringify(this.chartProperties, null, 2)}`,
    );

    const pngBuffer = await canvas.toBuffer('png', { matte: this.backgroundColor, quality: 1.0 });

    chart.destroy();

    this.logger?.trace(
      `Chart.getPngBuffer: pngBuffer: ${pngBuffer.toString('base64').substring(0, 50)}...`,
    );

    return pngBuffer;
  }

  /**
   * Store a PNG of the chart to a file.
   * @deprecated Use {@link setChartData} and {@link writePngFile}.
   *
   * @returns a Promise from the writeFile() invocation.
   */
  public async writePng(
    xValues: ChartXData,
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    this.logger?.warn('Chart.writePng() is Deprecated');
    this.setChartData(xValues, yValues);
    const pngBuffer: Buffer = await this.getPngBuffer();
    return writeFile(fileName, pngBuffer);
  }

  /**
   * Store a PNG of the chart to a file.
   *
   * @param fileName name of the file to create/overwrite
   * @returns a Promise from the writeFile() invocation
   */
  public async writePngFile(fileName: string): Promise<void> {
    const pngBuffer: Buffer = await this.getPngBuffer();
    return writeFile(fileName, pngBuffer);
  }

  /**
   * Generate a JPEG of the chart.
   *
   * Use Buffer.toString('base64') to get a usable string.
   *
   * NOTE: if the backgroundColor for the chart is set to 'rgb&lbrack;a&rbrack;(*,*,*,0)' (transparent)
   * then the background will be set to 'rgba(255,255,255,1)' (white).
   *
   * If embedding into an HTML document, prepend the Base-64 encoded string with
   * 'data:image/jpeg;base64,'.  For example:
   *
   * &lt;img src="data:img/jpeg;base64,&lt;base64-data-here&gt;" alt="interesting chart"&gt;
   *
   * @returns a Buffer containing a rasterized JPEG image of the chart.
   */
  public async getJpegBuffer(): Promise<Buffer> {
    const regex = new RegExp('^rgba\\([0-9]*,[0-9]*,[0-9]*,(?<transparency>[0-9\\.]*)\\)$');
    let backgroundColorToUse: string = this.backgroundColor;
    const canvas = new Canvas(800, 600);

    const chart = new ChartJS(
      canvas as any, // TypeScript needs "as any" here
      this.chartProperties,
    );

    this.logger?.trace(
      `Chart.getJpegBuffer: chartProperties: ${JSON.stringify(this.chartProperties, null, 2)}`,
    );

    const matches = regex.exec(this.backgroundColor);

    // if the supplied background color is transparent, switch it to white for generating the JPEG.
    // This is because JPEG does not support a transparent background.
    if (matches?.groups?.transparency) {
      if (parseInt(matches.groups.transparency) === 0) {
        backgroundColorToUse = 'rgba(255,255,255,1)';
      }
    }

    const jpegBuffer = await canvas.toBuffer('jpg', { matte: backgroundColorToUse, quality: 1.0 });

    chart.destroy();

    this.logger?.trace(
      `Chart.getPngBuffer: jpegBuffer: ${jpegBuffer.toString('base64').substring(0, 50)}...`,
    );

    return Promise.resolve(jpegBuffer);
  }

  /**
   * Store a JPEG of the chart to a file.
   * @deprecated Use {@link setChartData} and {@link writeJpegFile}.
   *
   * @returns a Promise from the writeFile() invocation.
   */
  public async writeJpeg(
    xValues: ChartXData,
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    this.logger?.warn('Chart.writeJpeg() is Deprecated');
    this.setChartData(xValues, yValues);
    const jpegBuffer: Buffer = await this.getJpegBuffer();
    return writeFile(fileName, jpegBuffer);
  }

  /**
   * Store a JPEG of the chart to a file.
   *
   * @param fileName name of the file to create/overwrite
   * @returns a Promise from the writeFile() invocation
   */
  public async writeJpegFile(fileName: string): Promise<void> {
    const jpegBuffer: Buffer = await this.getJpegBuffer();
    return writeFile(fileName, jpegBuffer);
  }

  /**
   * Generate a SVG of the chart.
   *
   * Use Buffer.toString('utf8') to get a usable string.
   *
   * If embedding into an HTML document, just use the returned Buffer.  For example:
   *
   * &lt;div&gt;
   *   &lt;svgBuffer here&gt;
   * &lt;/div&gt;
   *
   * @returns a Buffer containing a SVG rendering of the chart.
   */
  public async getSvgBuffer(): Promise<Buffer> {
    const canvas = new Canvas(800, 600);

    const chart = new ChartJS(
      canvas as any, // TypeScript needs "as any" here
      this.chartProperties,
    );

    this.logger?.trace(
      `Chart.getSvgBuffer: chartProperties: ${JSON.stringify(this.chartProperties, null, 2)}`,
    );

    const svgBuffer = await canvas.toBuffer('svg', { matte: this.backgroundColor, outline: true });

    chart.destroy();

    this.logger?.trace(
      `Chart.getSvgBuffer: svgBuffer: ${svgBuffer.toString('utf8').substring(0, 50)}...`,
    );

    return Promise.resolve(svgBuffer);
  }

  /**
   * Store a SVG of the chart to a file.
   * @deprecated Use {@link setChartData} and {@link writeSvgFile}.
   *
   * @returns a Promise from the writeFile() invocation.
   */
  public async writeSvg(
    xValues: ChartXData,
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    this.logger?.warn('Chart.writeSvg() is Deprecated');
    this.setChartData(xValues, yValues);
    const svgBuffer: Buffer = await this.getSvgBuffer();
    return writeFile(fileName, svgBuffer);
  }

  /**
   * Store a SVG of the chart to a file.
   *
   * @param fileName name of the file to create/overwrite
   * @returns a Promise from the writeFile() invocation
   */
  public async writeSvgFile(fileName: string): Promise<void> {
    const svgBuffer: Buffer = await this.getSvgBuffer();
    return writeFile(fileName, svgBuffer);
  }

  /**
   * Generate a HTML &lt;div&gt; which includes embedded JavaScript which will render the chart
   * on a HTML page where the &lt;div&gt; is embedded.
   *
   * NOTE: The surrounding JavaScript to load, from a CDN, the Chart.js code which the
   * &lt;script&gt; uses is NOT included in the &lt;div&gt;.  This is done to allow that code
   * to be embedded once, while multiple charts are embedded into a single HTML page.
   *
   * Use Buffer.toString('utf8') to get a usable string.
   *
   * If embedding into an HTML document, just use the returned Buffer.  For example:
   *
   * &lt;div&gt;
   *   &lt;svgBuffer here&gt;
   * &lt;/div&gt;
   *
   * @returns a Buffer containing an HTML &lt;div&gt; with embedded JavaScript &lt;script&gt;.
   */
  public async getHtmlBuffer(): Promise<string> {
    let htmlBuffer: string = '';
    const randomSuffix: string = Math.trunc(Math.random() * 1000).toString();

    this.logger?.trace(
      `Chart.getHtmlBuffer: chartProperties: ${JSON.stringify(this.chartProperties, null, 2)}`,
    );

    htmlBuffer = `
    <div style="height: 60vh; width: 80vw; margin: auto; background-color: ${this.backgroundColor}">
      <canvas id="myScatterChart${randomSuffix}">

      <script>
        // 1. Get the drawing context from the canvas element
        // const ctx2 = document.getElementById('myScatterChart${randomSuffix}').getContext('2d');
        const ctx2 = document.currentScript.parentElement.getContext('2d');
    `;

    htmlBuffer += `
        // 2. Set chart properties
        const chartProperties = ${JSON.stringify(this.chartProperties, null, 2)}`;

    htmlBuffer += `
        // 3. Render the chart
        const myChart = new Chart(ctx2, chartProperties);
        </script>
      </canvas>
    </div>
    `;

    this.logger?.trace(`Chart.getSvgBuffer: htmlBuffer: ${htmlBuffer.substring(0, 100)}...`);

    return Promise.resolve(htmlBuffer);
  }

  /**
   * Store a HTML page containing the chart to a file.
   * @deprecated Use {@link setChartData} and {@link writeHtmlFile}.
   *
   * @returns a Promise from the writeFile() invocation.
   */
  public async writeHtml(
    xValues: ChartXData,
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    this.logger?.warn('Chart.writeHtml() is Deprecated');
    this.setChartData(xValues, yValues);

    const htmlDivBuffer = await this.getHtmlBuffer();

    const htmlBuffer = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Un-comment the following line to enable light/dark mode for this HTML page
              <meta name="color-scheme" content="light dark">
            -->
            <title>${this.title}</title>
            <!-- Include Chart.js from CDN -->
            <!-- <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.js"></script>
        </head>
        <body>
        ${htmlDivBuffer}
        </body>
      </html>
    `;

    return writeFile(fileName, htmlBuffer);
  }

  /**
   * Store a HTML page containing one or more chart(s) to a file.
   *
   * @param fileName name of the file to create/overwrite
   * @param pageTitle optional title for the HTML Page.  If not provided, the
   *  chart title is used.
   * @param htmlBuffers optional array of HTML buffers to embed into the HTML page
   *  From, for example, calls to {@link getHtmlBuffer}.  If not provided,
   *  {@link getHtmlBuffer} is called and the result is the only thing embedded
   *  into the HTML page.
   * @returns a Promise from the writeFile() invocation
   */
  public async writeHtmlFile(
    fileName: string,
    pageTitle?: string,
    htmlBuffers?: string[],
  ): Promise<void> {
    let htmlDivBuffer;

    if (htmlBuffers) {
      htmlDivBuffer = htmlBuffers.join('\n');
    } else {
      // in this case, just get the HTML buffer for the current instance and use only it in the file.
      htmlDivBuffer = await this.getHtmlBuffer();
    }

    const fullBuffer: string = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Un-comment the following line to enable light/dark mode for this HTML page
              <meta name="color-scheme" content="light dark">
            -->
            <title>${pageTitle ?? this.title}</title>
            <!-- Include Chart.js from CDN -->
            <!-- <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.js"></script>
        </head>
        <body>
        ${htmlDivBuffer}
        </body>
      </html>
    `;

    return writeFile(fileName, fullBuffer);
  }
}
