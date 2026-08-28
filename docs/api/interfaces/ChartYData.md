[@ncfour-us/charts](../index.md) / ChartYData

# Interface: ChartYData

Type for the vector of values to be plotted on the Y axis.

## Properties

### color?

> `optional` **color?**: `string` \| `string`[]

color for the data points/line, defaults to 'rgba(0,0,0,1)' (black)

***

### group?

> `optional` **group?**: `string`

if multiple Y values are to be stacked or grouped, this string is
used to group those Y values.  No default value.

***

### label?

> `optional` **label?**: `string`

Label to use in the chart legend, defaults to 'line &lt;num&gt;'
where &lt;num&gt; is the index of the Y values in an array of Y values.

***

### values

> **values**: `number`[]

set of data points to plot
