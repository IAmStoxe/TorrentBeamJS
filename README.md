# TorrentBeamJS

## What Is It?

After the shutdown of KAT (KickAssTorrents) it has been harder and harder to find a reliable, consistent torrent provider. Even without KAT it was possible to find reliable sources through Torrentz.eu. Then that seemingly randomly shutdown. Now what are people supposed to do? Enter TorrentBeamJS. While this won't be anywhere near as cool, or awesome as KAT / Torrentz.eu were, it can help find torrents from several sources all with a single search.

## How Does It Work?

The premise is very simple. Most torrent websites provide a search function. The application emulates a browser (utilizing Nightmare (<https://www.npmjs.com/package/nightmare>)) to bypass straight HTTP request "securities" put in place by these websites, such as JavaScript rendering.

It works from a JSON file, namely search_config.json. Within this magical JSON file is an array of configuration objects for the individual providers. Here is the provided configuration of TorLock:

```json
    {
		"name": "TorLock",
		"searchUrl": "https://www.torlock.com/all/torrents/%s.html",
		"testSearchUrl": "https://www.torlock.com/all/torrents/batman.html",
		"resultsCssSelectors": {
		  "links": [
			".panel-default .table-condensed td a@href"
		  ],
		  "titles": [
			".panel-default .table-condensed b"
		  ],
		  "added": [
			".panel-default .td"
		  ],
		  "sizes": [
			".panel-default .ts"
		  ],
		  "seeds": [
			".panel-default .tul"
		  ]
		}
	}
```
As you can see this provides all the necessary information points as keys in the config, with their accompanying value of their CSS selector for that specific website. These should be pretty self explanatory.

### Performing Searches

Everything returns a Promise, so we can keep our code cleaner, and safe from callback hell.

#### All Provider Search

```typescript
    import {TorrentBeam} from 'TorrentBeam';
    let torrentBeam = new TorrentBeam();
    let searchTerm = 'IAmSearchingForThis';
    
    torrentBeam.searchAll(searchTerm)
        .then(resp => console.log(resp))
        .catch(err => console.error(err));
```

#### Single Provider Search
```typescript
    import {TorrentBeam} from 'TorrentBeam';
    let torrentBeam = new TorrentBeam();
    let searchTerm = 'IAmSearchingForThis';
    let provider = 'LimeTorrents';
    
    torrentBeam.searchSingle(provider,searchTerm)
        .then(resp => console.log(resp))
        .catch(err => console.error(err));
```

#### Without .then().catch()
```typescript
const TorrentBeam = require('TorrentBeam');
let torrentBeam = new TorrentBeam();
let searchTerm = 'IAmSearchingForThis';

async function awaitSearchResults() {
    return await torrentBeam.searchAll(searchTerm);
}
```

### Using Proxies / Switches
TorrentBeamJS supports all standard Nightmare switches, which in turn means it supports all of Chromium's switches. 
Just pass your configuration object into the constructor of TorrentBeam.
Please read about the [available switches here](https://github.com/segmentio/nightmare/blob/a5e658bf04815bb2c3340fd05d34e2d158f6c7e6/Readme.md#switches)


## How Do I Add Other Providers?

Request it as an issue, or you can use a tool like [SelectorGadget](http://selectorgadget.com/). They have an awesome free Chrome extension.

## License / Disclaimer
[GNU General Public License v3 (GPL-3)](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)#summary)
### Text Summary
>You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.

A full copy of the GNU license under which this software is partially released is [available here](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)#fulltext)

##### In addition to the GNU license:
* This work is provided as is with no guarantee or warranty whether explicit or implied.
* You may not utilize this software to illegally obtain copies of software, music, movies, and/or any other media.
* Any actions conducted whether directly or indirectly while utilizing this software are the sole, full responsbility of the end-user.

#### In The Event I Have Not Been 100% Clear And Understood
What you do with this software is your responsibility. I will not be held liable for any damages caused by you, or your use of this software. Be sure to check your local laws and regulations before use.