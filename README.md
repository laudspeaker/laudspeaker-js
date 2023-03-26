# Laudspeaker Browser Javascript Library

Please see the laudspeaker-js docs for more information.


## Installation:

1. Paste this snippet within the <head> tags of your website - ideally just inside the closing </head> tag - on all pages that you are using Laudspeaker:
```
<script>
    !function(t,e){var o,n,p,r;e.__SV||(window.laudspeaker=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="laudspeaker",u.people=u.people||[],u.toString=function(t){var e="laudspeaker";return"laudspeaker"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.laudspeaker||[]);
    laudspeaker.init('<laudspeaker_api_key>', {api_host: '<laudspeaker_instance_address>'})
</script>
```
2. Include it using npm:
```
npm install --save laudspeaker-js
```
and then include it in your files:
```
import laudspeaker from 'laudspeaker-js'

laudspeaker.init('<laudspeaker_api_key>', { api_host: '<laudspeaker_instance_address>' });
```

## Usage:

### Identifying Users:

### In App Messaging:
