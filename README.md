## Quick Guide

This is used to populate the jsdlivr CDN to be integrated with Calendly embed.

### Changes
Once chages are pushed to main make sure to purge cache from https://www.jsdelivr.com/tools/purge.

### Usage
```js
<div id="calendly-embed" style="min-width:320px;height:700px;"></div>

<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>

<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/nudo-co/integration-scripts@main/leadsource-calendly.js">
</script>

<script>
  window.onload = function(){
  	initiateCalendly("<<calendly URL>>", "calendly-embed");
  }
</script>
```