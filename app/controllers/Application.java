package controllers;

import java.util.List;

import models.Kanban;
import models.StickyNote;
import models.TextNote;
import play.mvc.Controller;

public class Application extends Controller
{

	public static void index()
	{
		/*
		 * SocialUser user = SecureSocial.getCurrentUser();
		 * System.out.println(user.email);
		 * System.out.println(user.displayName);
		 */
		render();
	}


	public static void kanban(long id)
	{
		render();
	}


	public static void load(long id)
	{
		// List<TextNote> notes = TextNote.find("byKanban", Kanban.findById(id)).fetch();
		List<TextNote> notes = TextNote.findAll();
		renderJSON(notes);
	}


	public static void test()
	{
		System.out.println("test");
		render();
	}


	public static void postNote(long kid, String title, String note)
	{
		Kanban k = Kanban.findById(kid);
		TextNote stickynote = new TextNote(k, title, note);
		stickynote.save();
		renderJSON(stickynote.id);
	}


	public static void updateNotePosition(long nid, int x, int y)
	{
		TextNote stickynote = TextNote.findById(nid);
		stickynote.x = x;
		stickynote.y = y;
		stickynote.save();
		renderJSON("OK");
	}
}