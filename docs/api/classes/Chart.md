[@ncfour-us/charts](../index.md) / Chart

# Abstract Class: Chart

## Extended by

- [`XYLineChart`](XYLineChart.md)

## Constructors

### Constructor

> **new Chart**(`parms`): `Chart`

#### Parameters

##### parms

[`ChartParms`](../interfaces/ChartParms.md)

#### Returns

`Chart`

## Properties

### title

> `protected` **title**: `string`

## Methods

### getHtmlBuffer()

> `abstract` **getHtmlBuffer**(`xValues`, `yValues`): `Promise`\<`string`\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`string`\>

***

### getJpegBuffer()

> `abstract` **getJpegBuffer**(`xValues`, `yValues`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### getPngBuffer()

> `abstract` **getPngBuffer**(`xValues`, `yValues`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### getSvgBuffer()

> `abstract` **getSvgBuffer**(`xValues`, `yValues`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Parameters

##### xValues

`number`[]

##### yValues

[`ChartYData`](../interfaces/ChartYData.md) \| [`ChartYData`](../interfaces/ChartYData.md)[]

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

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
