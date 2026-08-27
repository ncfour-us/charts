[@ncfour-us/charts](../index.md) / XYLineChart

# Class: XYLineChart

## Extends

- [`Chart`](Chart.md)

## Constructors

### Constructor

> **new XYLineChart**(`parms`): `XYLineChart`

#### Parameters

##### parms

[`ChartParms`](../interfaces/ChartParms.md)

#### Returns

`XYLineChart`

#### Overrides

[`Chart`](Chart.md).[`constructor`](Chart.md#constructor)

## Properties

### title

> `protected` **title**: `string`

#### Inherited from

[`Chart`](Chart.md).[`title`](Chart.md#title)

## Methods

### getHtmlBuffer()

> **getHtmlBuffer**(`xValues`, `yValues`): `Promise`\<`string`\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`string`\>

#### Overrides

[`Chart`](Chart.md).[`getHtmlBuffer`](Chart.md#gethtmlbuffer)

***

### getJpegBuffer()

> **getJpegBuffer**(`xValues`, `yValues`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Overrides

[`Chart`](Chart.md).[`getJpegBuffer`](Chart.md#getjpegbuffer)

***

### getPngBuffer()

> **getPngBuffer**(`xValues`, `yValues`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Overrides

[`Chart`](Chart.md).[`getPngBuffer`](Chart.md#getpngbuffer)

***

### getSvgBuffer()

> **getSvgBuffer**(`xValues`, `yValues`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Overrides

[`Chart`](Chart.md).[`getSvgBuffer`](Chart.md#getsvgbuffer)

***

### writeHtml()

> **writeHtml**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Chart`](Chart.md).[`writeHtml`](Chart.md#writehtml)

***

### writeJpeg()

> **writeJpeg**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Chart`](Chart.md).[`writeJpeg`](Chart.md#writejpeg)

***

### writePng()

> **writePng**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Chart`](Chart.md).[`writePng`](Chart.md#writepng)

***

### writeSvg()

> **writeSvg**(`xValues`, `yValues`, `fileName`): `Promise`\<`void`\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Chart`](Chart.md).[`writeSvg`](Chart.md#writesvg)
