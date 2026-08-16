import fsp from 'node:fs/promises';
import {
  CategoryScale,
  Chart,
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
import { Canvas } from 'skia-canvas';
// import { createCanvas } from 'canvas';

Chart.register([
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

const canvas = new Canvas(800, 600);
// const canvas = createCanvas(800, 600);
const chart = new Chart(
  canvas as any, // TypeScript needs "as any" here
  {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'SS @67, Max Roth',
          data: [
            {
              x: 75,
              y: 9348249.9,
            },
            {
              x: 85,
              y: 12995482.36,
            },
            {
              x: 95,
              y: 18118113.72,
            },
            {
              x: 100,
              y: 21397641.92,
            },
          ],
          showLine: true,
          backgroundColor: 'rgba(0,255,0,1)',
        },
        {
          label: 'SS @67, Roth IRMAA',
          data: [
            {
              x: 75,
              y: 10077086.12,
            },
            {
              x: 85,
              y: 12879270.8,
            },
            {
              x: 95,
              y: 16122832.39,
            },
            {
              x: 100,
              y: 18025299.9,
            },
          ],
          showLine: true,
          backgroundColor: 'rgba(0,0,255,1)',
        },
        {
          label: 'SS @67, No Roth',
          data: [
            {
              x: 75,
              y: 10318570.84,
            },
            {
              x: 85,
              y: 12560171.8,
            },
            {
              x: 95,
              y: 14435782.6,
            },
            {
              x: 100,
              y: 15211492.53,
            },
          ],
          showLine: true,
          backgroundColor: 'rgba(255,0,0,1)',
        },
        {
          label: 'SS @67, Max Roth, Infl',
          data: [
            {
              x: 75,
              y: 6180294.46,
            },
            {
              x: 85,
              y: 6392916.19,
            },
            {
              x: 95,
              y: 6632043.12,
            },
            {
              x: 100,
              y: 6756381.31,
            },
          ],
          showLine: true,
          backgroundColor: 'rgba(0,128,0,1)',
        },
        {
          label: 'SS @67, Roth IRMAA, Infl',
          data: [
            {
              x: 75,
              y: 6662141.07,
            },
            {
              x: 85,
              y: 6335747.81,
            },
            {
              x: 95,
              y: 5901680.57,
            },
            {
              x: 100,
              y: 5691552.36,
            },
          ],
          showLine: true,
          backgroundColor: 'rgba(0,0,128,1)',
        },
        {
          label: 'SS @67, No Roth, Infl',
          data: [
            {
              x: 75,
              y: 6821790.92,
            },
            {
              x: 85,
              y: 6178772.24,
            },
            {
              x: 95,
              y: 5284144.59,
            },
            {
              x: 100,
              y: 4803082.71,
            },
          ],
          showLine: true,
          backgroundColor: 'rgba(128,0,0,1)',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Estimated total assets using different Roth Conversion strategies',
        },
        legend: {
          display: true,
          labels: {
            color: 'black',
          },
          position: 'right',
        },
      },
    },
  },
  // {
  //   type: 'bar',
  //   data: {
  //     datasets: [{
  //       data: [20, 10],
  //     }],
  //     labels: ['a', 'b']
  //   }
  // }
  // {
  //   type: 'line',
  //   data: {
  //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //     datasets: [{
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       borderColor: 'blue'
  //     },
  //   {
  //       label: '# of Votes',
  //       data: [22, 12, 55, 10, 1, 13],
  //       borderColor: 'red'
  //     }]
  //   }
  // }
);
const pngBuffer = await canvas.toBuffer('jpeg', { matte: 'rgba(255,255,255,1)', quality: 1.0 });
// const pngBuffer = await canvas.toBuffer( 'png', {quality: 1.0, matte: 'white'});
// const palette = new Uint8ClampedArray([
//   //r    g    b    a
//     0,  255,  0, 0, // index 1
//    255,  0,  0, 0, // index 2
//   // ...
// ])
// const pngBuffer = canvas.toBuffer('image/png', {compressionLevel: 0, palette: palette, backgroundIndex: 0})
// const pngBuffer = canvas.toBuffer('image/png', {compressionLevel: 0});
await fsp.writeFile('output.jpg', pngBuffer);
chart.destroy();
