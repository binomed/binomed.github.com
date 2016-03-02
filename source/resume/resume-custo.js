'use strict';

var JefResume = JefResume || function(){
	
	function init(){

		var easter_egg = new Konami(function() { 
            console.log("konami !");
        });
	}

	document.addEventListener('DOMContentLoaded', init);

	return{		
	}

}();