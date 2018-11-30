'use strict';

var JefHelper = JefHelper || function(){
	
	function loadCss(cssPath, cssId){
		var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.id   = cssId;
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = cssPath;
	    link.media = 'all';
	    head.appendChild(link);
	}

	return{
		loadCss : loadCss
	}

}();