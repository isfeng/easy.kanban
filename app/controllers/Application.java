package controllers;

import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;
import controllers.securesocial.SecureSocial;
@With( SecureSocial.class )
public class Application extends Controller
{
	
	public static void index()
	{
		SocialUser user = SecureSocial.getCurrentUser();
		System.out.println(user.email);
		System.out.println(user.displayName);
		render();
		
	}
	
}