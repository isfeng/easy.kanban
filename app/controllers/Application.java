package controllers;

import models.Kanban;
import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;
import controllers.securesocial.SecureSocial;
import controllers.securesocial.SecureSocialPublic;

@With( SecureSocialPublic.class )
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
		Kanban tryit = Kanban.find("byName", "tryit").first();
		if(tryit != null)
		{
			renderArgs.put("offline", true);
			renderArgs.put("kanban", tryit);
			render("KanbanController/show.html");	
		}
		else
		{
			welcome();
		}
	
	}
	

	public static void about()
	{
		render();
	}
}