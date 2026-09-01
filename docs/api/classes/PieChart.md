[@ncfour-us/charts](../index.md) / PieChart

# Class: PieChart

Create a Pie chart with slices corresponding to the Y values.

Multiple Y value sets can be provided resulting in concentric circles.

A Pie chart is simply a Donut chart with slices that take up
the entire circle.

## Extends

- [`DonutChart`](DonutChart.md)

## Constructors

### Constructor

> **new PieChart**(`options`): `PieChart`

Creates a new PieChart instance.

#### Parameters

##### options

[`DonutChartOptions`](../interfaces/DonutChartOptions.md)

the set of options to specify for the chart.

#### Returns

`PieChart`

#### Overrides

[`DonutChart`](DonutChart.md).[`constructor`](DonutChart.md#constructor)

## Properties

### chartProperties

> `protected` **chartProperties**: `any`

#### Inherited from

[`DonutChart`](DonutChart.md).[`chartProperties`](DonutChart.md#chartproperties)

***

### logger?

> `protected` `optional` **logger?**: `ILogger`

#### Inherited from

[`DonutChart`](DonutChart.md).[`logger`](DonutChart.md#logger)

***

### title

> `protected` **title**: `string`

#### Inherited from

[`DonutChart`](DonutChart.md).[`title`](DonutChart.md#title)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`getHtmlBuffer`](DonutChart.md#gethtmlbuffer)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`getJpegBuffer`](DonutChart.md#getjpegbuffer)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`getPngBuffer`](DonutChart.md#getpngbuffer)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`getSvgBuffer`](DonutChart.md#getsvgbuffer)

***

### setChartData()

> **setChartData**(`xValues`, `yValues`): `void`

Specify the data points for an XY Line chart.

Using this method allows for re-using the XY Line chart title(s) and
any other settings while plotting different data.

If labels are NOT provided for the yValues, then the label
will be set to 'Line &lt;num&gt;' where num is 1, 2, ....

#### Parameters

##### xValues

[`ChartXData`](../type-aliases/ChartXData.md)

the vector of X values

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

the vector(s) of Y values corresponding to the X values

#### Returns

`void`

#### Inherited from

[`DonutChart`](DonutChart.md).[`setChartData`](DonutChart.md#setchartdata)

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

Use [setChartData](Chart.md#setchartdata) and [writeHtmlFile](Chart.md#writehtmlfile).

#### Inherited from

[`DonutChart`](DonutChart.md).[`writeHtml`](DonutChart.md#writehtml)

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
 From, for example, calls to [getHtmlBuffer](Chart.md#gethtmlbuffer).  If not provided,
 [getHtmlBuffer](Chart.md#gethtmlbuffer) is called and the result is the only thing embedded
 into the HTML page.

#### Returns

`Promise`\<`void`\>

a Promise from the writeFile() invocation

#### Inherited from

[`DonutChart`](DonutChart.md).[`writeHtmlFile`](DonutChart.md#writehtmlfile)

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

Use [setChartData](Chart.md#setchartdata) and [writeJpegFile](Chart.md#writejpegfile).

#### Inherited from

[`DonutChart`](DonutChart.md).[`writeJpeg`](DonutChart.md#writejpeg)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`writeJpegFile`](DonutChart.md#writejpegfile)

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

Use [setChartData](Chart.md#setchartdata) and [writePngFile](Chart.md#writepngfile).

#### Inherited from

[`DonutChart`](DonutChart.md).[`writePng`](DonutChart.md#writepng)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`writePngFile`](DonutChart.md#writepngfile)

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

Use [setChartData](Chart.md#setchartdata) and [writeSvgFile](Chart.md#writesvgfile).

#### Inherited from

[`DonutChart`](DonutChart.md).[`writeSvg`](DonutChart.md#writesvg)

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

#### Inherited from

[`DonutChart`](DonutChart.md).[`writeSvgFile`](DonutChart.md#writesvgfile)
