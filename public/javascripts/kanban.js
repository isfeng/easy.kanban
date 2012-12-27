
//google web font
WebFontConfig = 
{
	google : 
	{
		families : [ 'Shadows+Into+Light::latin' ]
	}
};

(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http')
			+ '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();


var Sticky = new Class
({
	
	Implements:[Options, Events],
	
	options:
	{
		
	},
	
	initialize:function()
	{
		
	},
	
	tear: function()
	{
		
	}
	
});

var Postit = new Class
({
	
	Implements:[Options, Events],
	
	options:
	{
		
	},
	
	initialize:function()
	{
		
	},
	
	pull: function()
	{
		
	}
	
});

var Kanban = new Class
({
	
	Implements:[Options, Events],
	
	options:
	{
		
	},
	
	initialize:function()
	{
		
	},
	
	stick: function(sticky)
	{
		
	}
	
});