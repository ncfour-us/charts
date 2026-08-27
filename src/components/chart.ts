// Copyright (c) 2026 Tim Hahn

import { writeFile } from 'node:fs/promises';

export interface ChartParms {
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export interface ChartYData {
  values: number[];
  label?: string;
  color?: string;
}

export abstract class Chart {
  protected title: string;

  constructor(parms: ChartParms) {
    this.title = parms.title ?? 'Chart Title';
  }

  abstract getPngBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<Buffer>;

  async writePng(
    xValues: number[],
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    const pngBuffer: Buffer = await this.getPngBuffer(xValues, yValues);
    return writeFile(fileName, pngBuffer);
  }

  abstract getJpegBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<Buffer>;

  async writeJpeg(
    xValues: number[],
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    const jpegBuffer: Buffer = await this.getJpegBuffer(xValues, yValues);
    return writeFile(fileName, jpegBuffer);
  }

  abstract getSvgBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<Buffer>;

  async writeSvg(
    xValues: number[],
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    const svgBuffer: Buffer = await this.getSvgBuffer(xValues, yValues);
    return writeFile(fileName, svgBuffer);
  }

  abstract getHtmlBuffer(xValues: number[], yValues: ChartYData | ChartYData[]): Promise<string>;

  async writeHtml(
    xValues: number[],
    yValues: ChartYData | ChartYData[],
    fileName: string,
  ): Promise<void> {
    const htmlDivBuffer = await this.getHtmlBuffer(xValues, yValues);

    const htmlBuffer = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
}
