package controllers;

import models.Kanban;
import play.mvc.Controller;
import securesocial.provider.SocialUser;
import controllers.securesocial.SecureSocial;

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
		Kanban tryit = Kanban.find("byName", "Kanban Development Board").first();
		if (tryit == null)
			tryit = Kanban.find("byName", "10K").first();
		renderArgs.put("offline", true);
		renderArgs.put("id", tryit.id);
		render("KanbanController/show.html");
		
		renderHtml("");
	}
	
	
	public static void sendgrid()
	{
		render();
	}
	
	
}