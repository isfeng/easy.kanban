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
//		List<TextNote> notes = TextNote.find("byKanban", Kanban.findById(id)).fetch();
		List<TextNote> notes = TextNote.findAll();
		renderJSON(notes);
	}

	public static void test()
	{
		System.out.println("test");
		render();
	}


	public static void postNote(int id, int x, int y, String title, String note)
	{
		Kanban k = Kanban.findById(id);
		TextNote stickynote = new TextNote(k, x, y, title, note);
		stickynote.save();
		ok();
	}
}