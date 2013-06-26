# wTooltip.js

A jQuery tooltip plugin for clean and simple tooltips.  Also supports `mousestop` event which more closely simulates the way the browser tooltips work by only appearing when a user actually pauses over an element.

* [View the wTooltip demo](http://wtooltip.websanova.com)
* [Download the lastest version of wTooltip](https://github.com/websanova/wTooltip/tags)

## Related Plugins

* [wHumanMsg](http://whumanmsg.websanova.com) - Simple user prompting.
* [wModal](http://wModal.websanova.com) - Clean looking and easy to use modals.


## Settings

Available options with notes, the values here are the defaults.

```js
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


## Examples

Include plugin files and init:

```js
<script type="text/javascript" src="./wTooltip.js"></script>
<link rel="Stylesheet" type="text/css" href="./wTooltip.css" />

<script type="text/javascript">
    $("#wTooltip").wTooltip({
        timeToStop: 2000,
        theme: "blue"
    });
</script>
```

### html

You can toggle the tooltips dispaly html as plain text.

```js
$("#wTooltip").wTooltip({html:false});
```


## Resources

* [More jQuery plugins by Websanova](http://websanova.com/plugins)
* [jQuery Plugin Development Boilerplate](http://wboiler.websanova.com)
* [The Ultimate Guide to Writing jQuery Plugins](http://www.websanova.com/blog/jquery/the-ultimate-guide-to-writing-jquery-plugins)


## License

MIT licensed

Copyright (C) 2011-2012 Websanova http://www.websanova.com