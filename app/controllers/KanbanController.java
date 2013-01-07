package controllers;

import java.util.List;

import controllers.securesocial.SecureSocial;

import models.Kanban;
import models.TextNote;
import models.User;
import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;

@With(KanbanSecure.class)
public class KanbanController extends Controller
{
	
	public static void show(long id)
	{
		render(id);
	}
	
	
	public static void create(String name, String goal)
	{
		SocialUser socialUser = SecureSocial.getCurrentUser();
		User _user = User.find("byEmail", socialUser.email).first();
		
		Kanban k = new Kanban();
		k.name = name;
		k.goal = goal;
		k.user = _user;
		k.save();
		
		index();
	}
	
	
	public static void delete(long id)
	{
		
	}
	
	
	public static void index()
	{
		SocialUser socialUser = SecureSocial.getCurrentUser();
		User user = User.find("byEmail", socialUser.email).first();
		List<Kanban> kanbans = Kanban.find("byUser", user).fetch();
		renderArgs.put("kanbans", kanbans);
		render();
	}
	
	
	public static void notes(long id)
	{
		List<TextNote> notes = TextNote.find("byKanban", Kanban.findById(id)).fetch();
		renderJSON(notes);
	}
	
	
	public static void getBackground(long id)
	{
		Kanban k = Kanban.findById(id);
		renderJSON(k.background);
	}
	
	
	public static void setBackground(long id, String dataURL)
	{
		Kanban k = Kanban.findById(id);
		k.background = dataURL;
		k.save();
		renderJSON("OK");
	}
	
	
	public static void _new()
	{
		render();
	}
}
