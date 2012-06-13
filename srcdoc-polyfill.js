(function( window, document, undefined ) {
	
	var idx, iframes;
	var _srcDoc = window.srcDoc;
	var isCompliant = !!("srcdoc" in document.createElement("iframe"));
	var implementations = {
		compliant: function( iframe, content ) {

			if (content) {
				iframe.setAttribute("srcdoc", content);
			}
		},
		legacy: function( iframe, content ) {

			var jsUrl;

			if (!iframe || !iframe.getAttribute) {
				return;
			}

			if (!content) {
				content = iframe.getAttribute("srcdoc");
			}

			if (content) {

				// Create a "javascript: " URL. Wrap the content in quotes and
				// escape unsafe characters (this is in addition to any
				// escaping already done to sanitize the `srcdoc` attribute)
				jsUrl = "javascript: '" +
					content.replace(/([\\'])/g, "\\$1") +
					"'";

				iframe.setAttribute("src", jsUrl);

				// Explicitly set the iFrame's window.location for
				// compatability with IE9, which does not react to changes in
				// the `src` attribute when it is a `javascript:` URL, for
				// some reason
				if (iframe.contentWindow) {
					iframe.contentWindow.location = jsUrl;
				}
			}
		}
	};
	var srcDoc = window.srcDoc = {
		// Assume the best
		set: implementations.compliant,
		noConflict: function() {
			window.srcDoc = _srcDoc;
			return srcDoc;
		}
	};

	// If the browser supports srcdoc, no shimming is necessary
	if (isCompliant) {
		return;
	}

	srcDoc.set = implementations.legacy;

	// Automatically shim any iframes already present in the document
	iframes = document.getElementsByTagName("iframe");
	idx = iframes.length;

	while (idx--) {
		srcDoc.set( iframes[idx] );
	}

}( this, this.document ));