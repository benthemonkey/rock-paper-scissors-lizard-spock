/* global BrowserPolicy */

BrowserPolicy.framing.disallow()
BrowserPolicy.content.disallowInlineScripts()
BrowserPolicy.content.disallowEval()
BrowserPolicy.content.allowInlineStyles()
BrowserPolicy.content.allowFontDataUrl()

BrowserPolicy.content.allowOriginForAll('*.googleapis.com')
BrowserPolicy.content.allowOriginForAll('*.gstatic.com')
