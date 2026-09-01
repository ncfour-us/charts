[@ncfour-us/charts](../index.md) / Chart

# Abstract Class: Chart

Base class for various types of charts.

This class implements several functions to render the
charts, while sub-classes are responsible for setting
up the chart properties for the chart based on the chart
type selected.

see [XYLineChart](XYLineChart.md).

## Extended by

- [`XYLineChart`](XYLineChart.md)
- [`BarChart`](BarChart.md)
- [`DonutChart`](DonutChart.md)

## Constructors

### Constructor

> **new Chart**(`options`): `Chart`

#### Parameters

##### options

[`ChartOptions`](../interfaces/ChartOptions.md)

#### Returns

`Chart`

## Properties

### chartProperties

> `protected` **chartProperties**: `any`

***

### logger?

> `protected` `optional` **logger?**: `ILogger`

***

### title

> `protected` **title**: `string`

## Methods

### getHtmlBuffer()

> **getHtmlBuffer**(): `Promise`\<`string`\>

Generate a HTML &lt;div&gt; which includes embedded JavaScript which will render the chart
on a HTML page where the &lt;div&gt; is embedded.

NOTE: The surrounding JavaScript to load, from a CDN, the Chart.js code which the
&lt;script&gt; uses is NOT included in the &lt;div&gt;.  This is done to allow that code
to be embedded once, while multiple charts are embedded into a single HTML page.

Use Buffer.toString('utf8') to get a usable string.

If embedding into an HTML document, just use the returned Buffer.  For example:

&lt;div&gt;
  &lt;svgBuffer here&gt;
&lt;/div&gt;

#### Returns

`Promise`\<`string`\>

a Buffer containing an HTML &lt;div&gt; with embedded JavaScript &lt;script&gt;.

***

### getJpegBuffer()

> **getJpegBuffer**(): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Generate a JPEG of the chart.

Use Buffer.toString('base64') to get a usable string.

NOTE: if the backgroundColor for the chart is set to 'rgb&lbrack;a&rbrack;(*,*,*,0)' (transparent)
then the background will be set to 'rgba(255,255,255,1)' (white).

If embedding into an HTML document, prepend the Base-64 encoded string with
'data:image/jpeg;base64,'.  For example:

&lt;img src="data:img/jpeg;base64,&lt;base64-data-here&gt;" alt="interesting chart"&gt;

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

a Buffer containing a rasterized JPEG image of the chart.

***

### getPngBuffer()

> **getPngBuffer**(): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Generate a PNG of the chart.

Use Buffer.toString('base64') to get a usable string.

If embedding into an HTML document, prepend the Base-64 encoded string with
'data:image/png;base64,'.  For example:

&lt;img src="data:img/png;base64,&lt;base64-data-here&gt;" alt="interesting chart"&gt;

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

a Buffer containing a rasterized PNG image of the chart.

***

### getSvgBuffer()

> **getSvgBuffer**(): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Generate a SVG of the chart.

Use Buffer.toString('utf8') to get a usable string.

If embedding into an HTML document, just use the returned Buffer.  For example:

&lt;div&gt;
  &lt;svgBuffer here&gt;
&lt;/div&gt;

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

a Buffer containing a SVG rendering of the chart.

***

### setChartData()

> `abstract` **setChartData**(`xValues`, `yValues`): `void`

Set the chart data points to be rendered in the chart.

#### Parameters

##### xValues

[`ChartXData`](../type-aliases/ChartXData.md)

the X values for the chart (eithet X axis or labels)

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

the Y values (possibly multiple of them) corresponding to the X values

#### Returns

`void`

***

### ~~writeHtml()~~

> **writeHtml**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

Store a HTML page containing the chart to a file.

#### Parameters

##### xValues

[`ChartXData`](../type-aliases/ChartXData.md)

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation.

#### Deprecated

Use [setChartData](#setchartdata) and [writeHtmlFile](#writehtmlfile).

***

### writeHtmlFile()

> **writeHtmlFile**(`fileName`, `pageTitle?`, `htmlBuffers?`): `Promise`\<`void`\>

Store a HTML page containing one or more chart(s) to a file.

#### Parameters

##### fileName

`string`

name of the file to create/overwrite

##### pageTitle?

`string`

optional title for the HTML Page.  If not provided, the
 chart title is used.

##### htmlBuffers?

`string`[]

optional array of HTML buffers to embed into the HTML page
 From, for example, calls to [getHtmlBuffer](#gethtmlbuffer).  If not provided,
 [getHtmlBuffer](#gethtmlbuffer) is called and the result is the only thing embedded
 into the HTML page.

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation

***

### ~~writeJpeg()~~

> **writeJpeg**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

Store a JPEG of the chart to a file.

#### Parameters

##### xValues

[`ChartXData`](../type-aliases/ChartXData.md)

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation.

#### Deprecated

Use [setChartData](#setchartdata) and [writeJpegFile](#writejpegfile).

***

### writeJpegFile()

> **writeJpegFile**(`fileName`): `Promise`\<`void`\>

Store a JPEG of the chart to a file.

#### Parameters

##### fileName

`string`

name of the file to create/overwrite

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation

***

### ~~writePng()~~

> **writePng**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

Store a PNG of the chart to a file.

#### Parameters

##### xValues

[`ChartXData`](../type-aliases/ChartXData.md)

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation.

#### Deprecated

Use [setChartData](#setchartdata) and [writePngFile](#writepngfile).

***

### writePngFile()

> **writePngFile**(`fileName`): `Promise`\<`void`\>

Store a PNG of the chart to a file.

#### Parameters

##### fileName

`string`

name of the file to create/overwrite

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation

***

### ~~writeSvg()~~

> **writeSvg**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

Store a SVG of the chart to a file.

#### Parameters

##### xValues

[`ChartXData`](../type-aliases/ChartXData.md)

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation.

#### Deprecated

Use [setChartData](#setchartdata) and [writeSvgFile](#writesvgfile).

***

### writeSvgFile()

> **writeSvgFile**(`fileName`): `Promise`\<`void`\>

Store a SVG of the chart to a file.

#### Parameters

##### fileName

`string`

name of the file to create/overwrite

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation
