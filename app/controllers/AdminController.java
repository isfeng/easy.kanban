package controllers;

import java.util.List;

import models.Kanban;
import models.User;
import models.UserKanban;
import controllers.deadbolt.Deadbolt;
import controllers.securesocial.SecureSocial;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;

@With({ Deadbolt.class, SecureSocial.class })
public class AdminController extends Controller
{
	public static void index()
	{
		List<Kanban> kanbans = Kanban.all().fetch();
		renderArgs.put("kanbans", kanbans);
		render();
	}


	@Before
	static void checkKanbanAccessRight(long id) throws Throwable
	{
		SocialUser suser = SecureSocial.getCurrentUser();
		if (!suser.email.equals("sergio.huang@gmail.com"))
			forbidden();
	}
}
