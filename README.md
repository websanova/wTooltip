# wTooltip.js

A jQuery tooltip plugin. [Check out the live demo](http://www.websanova.com/plugins/tooltips/jquery).


## Settings

Available options with notes, the values here are the defaults.

```javascript
$('#elem').wTooltip({
    position    : 'default',    // should the tooltip follow the mouse [default,mouse]
    timeToStop  : null,         // only works with position default - the time mouse has to stop before triggering display of tooltip
    theme       : 'cream',      // allow custom with #FFAACC
    opacity     : 0.8,          // opacity level
    title       : null,         // manually set title
    fadeIn      : 0,            // time before tooltip appears in milliseconds
    fadeOut     : 0,            // time before tooltip fades in milliseconds
    delayIn     : 0,            // time before tooltip displays in milliseconds
    delayOut    : 0,            // time before tooltip begins to dissapear in milliseconds
    width       : null,         // define a set width for the tooltip
    height      : null,         // define a set height for the tooltip
    offsetX     : 8,            // x offset of mouse position
    offsetY     : 9,            // y offset of mouse position
    html        : true          // title is inserted as HTML rather than text
});
```

Update settings on the fly:

```javascript
$('input').wTooltip('html', true);
```

Retrieve settings, if more than one it will return an array otherwise just the value.

```javascript
console.log($('#elem').wTooltip('html'))            // false
console.log($('.elem').wTooltip('html'))            // [true, true, false]
```


## Examples

Init tooltip with theme and delay before tooltip appears:

```html
<div id="wTooltip">hover me</div>

<script type="text/javascript">
    $("#wTooltip").wTooltip({
        timeToStop: 2000,
        theme: "blue"
    });
</script>
```

Toggle HTML:

```html
<div id="wTooltip" title="<span style='color:red;'>no html</span>" onclick="html_toggle();">click me</div>
    
<script type="text/javascript">
    $("#wTooltip").wTooltip({html:false});

    $("#wTooltip").wTooltip('html', true);
    $("#wTooltip").wTooltip('title', '<span style="color:red;">yes html</span>');
</script>
```


## License

MIT licensed

Copyright (C) 2011-2012 Websanova http://www.websanova.com