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
npm install --save @laudspeaker/laudspeaker-js
```

and then include it in your files:

```
import laudspeaker from 'laudspeaker-js'

laudspeaker.init('<laudspeaker_api_key>', { api_host: '<laudspeaker_instance_address>' });
```

## Usage:

### Identifying Users:

To identify a user, call the `laudspeaker.identify` method with the user's unique id and any other properties you want to set:

```
laudspeaker.identify(
    {'[unique field name]': '[user unique id]',} // distinct_id, required
    { userProperty: 'value1',
      anotherUserProperty: 'value2' } // optional
);
```

Before the `identify` method is called, we create an anonymous customer in laudspeaker at the beginning of a browser session, and we identify that customer using an anonymous identifier saved in the browser's local storage. When the user is idenitified, we then correlate that identifier with the customer in laudspeaker, upserting if that user doesnt exist and replacing the token if the customer has already been correlaet with a previous session.

### Firing custom events:

To fire custom events, call the `laudspeaker.fire` method with the event JSON and payload information:

```
laudspeaker.fire({'event':'some event'}, { 'payload': 'some value' });
```

If the user has been identified, the event will be correlated with that identity, oherwise it will be associated with the anonymous identifier. If the user is later identified, the previously identified events will be correlated with the identified user.

### In App Messaging:

You can add custom handlers to in-app message events that can fire when a customer interacts with an in-app message. Three interactions are built in by default: `opened`,`dismissed` and `error`, and you can add custom actions when building your in app message templates.

To listen to `opened` events:

```
const onMessageOpened = function ({messageId}) {
    console.log('Message Opened:');
    console.log('Message Id: ', messageId);
};

// run the listener everytime message is shown
laudspeaker.on('in-app:message-opened', onMessageOpened);

// run the listener only once
laudspeaker.on('in-app:message-opened', onMessageOpened, { once: true })

// turn off the listener
laudspeaker.off('in-app:message-opened', onMessageOpened)
```

To listen to `dismissed` events:

```
const onMessageDismissed = function ({messageId}) {
    console.log('Message Dismissed:');
    console.log('Message Id: ', messageId);
};

laudspeaker.on('in-app:message-dismissed', onMessageDismissed);
```

To listen to `error` events:

```
const onMessageError = function ({messageId}) {
    console.log('Message Error:');
    console.log('Message Id: ', messageId);
};

laudspeaker.on('in-app:message-error', onMessageError);
```

To listen to custom actions:

```
const onMessageAction = function ({messageId, actionName, actionValue}) {
    console.log('Message Action:');
    console.log('Message Id: ', messageId);
    console.log('Action Name: ', actionName);
    console.log('Action Value: ', actionValue);
};

laudspeaker.on('in-app:message-action', onMessageAction);
```
