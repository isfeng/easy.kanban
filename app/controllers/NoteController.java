package controllers;

import controllers.securesocial.SecureSocial;
import models.Kanban;
import models.TextNote;
import play.mvc.Controller;
import play.mvc.With;

@With(KanbanSecure.class)
public class NoteController extends Controller
{

	public static void create(long id, String title, String note)
	{
		Kanban k = Kanban.findById(id);
		TextNote stickynote = new TextNote(k, title, note);
		stickynote.save();
		renderJSON(stickynote.id);
	}


	public static void delete(long id)
	{
		TextNote tn = TextNote.findById(id);
		tn.delete();
		renderJSON("OK");
	}


	public static void updatePosition(long id, int x, int y)
	{
		TextNote stickynote = TextNote.findById(id);
		stickynote.x = x;
		stickynote.y = y;
		stickynote.save();
		renderJSON("OK");
	}

}
