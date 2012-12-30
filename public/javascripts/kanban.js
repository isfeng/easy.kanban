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


var StickyNote = new Class
({

	Implements:[Options, Events, Mooml.Templates],

	options:
	{
		onTextOk: Class.empty,
		onDrawOk: Class.empty
	},

	initialize:function(options)
	{
		this.setOptions(options);

		this.registerTemplate('text_note_tmpl', function() {
			div(
				div ({'id':'text_note_form'},
		            label('Title'),
		            input({'type':'text', 'id':'text_note_title'}),
		            label('Note'),
		            textarea({'id':'text_note_area'})
	        	)
			);
		});

		this.registerTemplate('draw_note_tmpl', function() {

		});
	},

	tear: function()
	{
		alert('tear');
	},

	showTextForm: function()
	{
		this.sm = new SimpleModal({"btn_ok":"post it"});
        this.sm.addButton("Action button", "btn primary", function(){
        	this.fireEvent('textOk', [$('text_note_title').value, $('text_note_area').value]);
        	this.hide();
        }.bind(this));
        this.sm.addButton("Cancel", "btn secondary");
        this.sm.show({
            "model": "modal",
            "title": "Title",
            "contents": this.renderTemplate('text_note_tmpl').get('html')
        });
	},

	showDrawForm: function()
	{

	},

	hide: function()
	{
		this.sm.hide();
	}

});

var PostStack = new Class
({

	Implements:[Options, Events],

	options:
	{

	},

	/* add edit event */
	initialize:function(kanban, stack)
	{
		this.kanban = kanban;
		$(stack).addEvent("click", function(){
			this.pull();
			}.bind(this)
		);
	},

	pull: function()
	{
		var stickyNote = new StickyNote({onTextOk: function(title, area){
				this.kanban.stickText(title, area);
			}.bind(this)
		});
		stickyNote.showTextForm();
	}

});

var Kanban = new Class
({

	Implements:[Options, Events],

	options:
	{

	},

	initialize:function(id, container)
	{
		this.id = id;
		this.container = container;
		this.template = new Mooml.Template('post_tmpl', function(note) {
		    div({'class': 'note'},
		        h6(note.title),
		        p(note.area)
		    );
		});
	},

	stickText: function(title, area)
	{
		var el = this.template.render({'title':title,'area':area}).inject($(this.container));
		new Drag.Move(el,{
            container : this.container
        })
	},

	stickDraw: function()
	{

	},

	clear: function()
	{

	},

	load: function()
	{
		var myRequest = new Request.JSON({
		    url: 'kanbans/id',
		    method: 'get',
		    onRequest: function(){
		    	console.log('loading');
		    },
		    onSuccess: function(json){
				console.log(json[0]);
		    },
		    onFailure: function(){
		        console.log('failure');
		    }
		});
		myRequest.send();
	},

	addStack: function(stack)
	{
		var postStack = new PostStack(this, stack);
	}

});