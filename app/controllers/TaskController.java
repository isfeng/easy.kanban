package controllers;

import controllers.securesocial.SecureSocial;
import play.mvc.Controller;
import play.mvc.With;

@With(SecureSocial.class)
public class TaskController extends Controller
{
	public static void addTask()
	{
		System.out.println("TaskController");
	}
}
