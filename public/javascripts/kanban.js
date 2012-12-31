
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


Mooml.register('text_note_tmpl', function() {
    div(
		div ({'id':'text_note_form'},
            label('Title'),
            input({'type':'text', 'id':'text_note_title'}),
            label('Note'),
            textarea({'id':'text_note_area'})
    	)
	);
});

Mooml.register('post_tmpl', function(note) {
    div({'class':'note', 'nid':note.nid},
        h6(note.title),
        p(note.note)
    );
});


var StickyNote = new Class
({
	
	Implements:[Options, Events, Mooml.Templates],
	
	options:
	{
		onTextOk: Class.empty,
		onDrawOk: Class.empty,
		onMove: Class.empty
	},
	
	initialize:function(options)
	{
		this.setOptions(options);
	},
	
	tear: function()
	{
		alert('tear');
	},

	showTextForm: function()
	{
		this.sm = new SimpleModal({"btn_ok":"post it"});
        this.sm.addButton("Action button", "btn primary", function(){
        	this._onTextOK('noid', $('text_note_title').value, $('text_note_area').value);
        	this.fireEvent('textOk', this.post_text_el);
        	this.hide();
        }.bind(this));
        this.sm.addButton("Cancel", "btn secondary");
        this.sm.show({
            "model": "modal",
            "title": "Title",
            "contents": Mooml.render('text_note_tmpl').get('html')
        }); 
	},

	showDrawForm: function()
	{
		
	},

	hide: function()
	{
		this.sm.hide();
	},

	_onTextOK: function(nid, title, note)
	{
		this.title = title;
		this.note = note;
		this.post_text_el = Mooml.render('post_tmpl',{'title':title,'note':note,'nid':nid});
	},

	_onDrawOK: function()
	{

	}

		
});

StickyNote.buildNoteEl = function(nid, title, note)
{
	return Mooml.render('post_tmpl',{'title':title,'note':note,'nid':nid});
}

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
		var stickyNote = new StickyNote({onTextOk: function(el){
				this.kanban.stickText(el, 0, 0);
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
	
	initialize:function(container, kid)
	{
		this.kanbanID = kid;
		this.container = container;
		
	},
	
	stickText: function(textNote, x, y)
	{
		var el = textNote.inject($(this.container));
		console.log({'x':x,'y':y});
		new Drag.Move(el,{
            container : this.container,
            onComplete: function()
            {
            	console.log(el.getPosition());

            }
        })

        el.setPosition({'x':x,'y':y});
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
		    url: 'kanbans/'+this.kanbanID,
		    method: 'get',
		    onRequest: function(){
		        console.log('onRequest');
		    },
		    onSuccess: function(json){
		        json.each(function(el){
		        	console.log(el);
		        	this.stickText(StickyNote.buildNoteEl(el.id, el.title, el.note), el.x, el.y);
		        }.bind(this));
		    }.bind(this),
		    onFailure: function(){
		        console.log('onFailure');
		    }
		});

		myRequest.send();
	},

	addStack: function(stack)
	{
		var postStack = new PostStack(this, stack);
	}
	
});