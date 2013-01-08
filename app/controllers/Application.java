package controllers;

import java.util.List;

import controllers.securesocial.SecureSocial;

import models.Kanban;
import models.StickyNote;
import models.TextNote;
import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;

public class Application extends Controller
{
	
	public static void welcome()
	{
		SocialUser user = SecureSocial.getCurrentUser();
		if (user == null)
			render();
		else
			KanbanController.index();
	}
	
	
	public static void tryit()
	{
		Kanban tryit = Kanban.find("byName", "10K").first();
		renderArgs.put("offline", true);
		renderArgs.put("id", tryit.id);
		render("KanbanController/show.html");
	}

	
}