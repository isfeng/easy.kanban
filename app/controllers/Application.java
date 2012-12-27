package controllers;

import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;
import controllers.securesocial.SecureSocial;
public class Application extends Controller
{
	
	public static void index()
	{
		/*
		SocialUser user = SecureSocial.getCurrentUser();
		System.out.println(user.email);
		System.out.println(user.displayName);
		*/
		render();
	}
	
	public static void kanban()
	{
		render();
	}

	public static void test()
	{
		System.out.println("test");
		render();
	}
}