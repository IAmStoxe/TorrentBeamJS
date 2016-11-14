#TorrentBeamJS

##What Is It?

After the shutdown of KAT (KickAssTorrents) it has been harder and harder to find a reliable, consistent torrent provider. Even without KAT it was possible to find reliable sources through Torrentz.eu. Then that seemingly randomly shutdown. Now what are people supposed to do? Enter TorrentBeamJS. While this won't be anywhere near as cool, or awesome as KAT / Torrentz.eu were, it can help find torrents from several sources all with a single search.

##How Does It Work?

The premise is very simple. Most torrent websites provide a search function. The application emulates a browser (utilizing Nightmare (<https://www.npmjs.com/package/nightmare>)) to bypass straight HTTP request "securities" put in place by these websites, such as JavaScript rendering.

It works from a JSON file, namely search_config.json. Within this magical JSON file is an array of configuration objects for the individual providers. Here is the provided configuration of TorLock:

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

As you can see this provides all the necessary information points as keys in the config, with their accompanying value of their CSS selector for that specific website. These should be pretty self explanatory.

##How Do I Add Other Providers?

Request it as an issue, or you can use a tool like SelectorGadget (<http://selectorgadget.com/>). They have an awesome free Chrome extension.
