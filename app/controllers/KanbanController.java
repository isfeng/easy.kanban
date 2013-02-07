package controllers;

import java.util.HashMap;
import java.util.List;

import models.Board;
import models.Kanban;
import models.TextNote;
import models.User;
import models.UserKanban;
import models.ValueStream;
import play.data.validation.Required;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;
import controllers.deadbolt.Deadbolt;
import controllers.deadbolt.Restrict;
import controllers.deadbolt.RestrictedResource;
import controllers.securesocial.SecureSocial;
import controllers.securesocial.SecureSocialPublic;

@With(SecureSocialPublic.class)
public class KanbanController extends Controller
{
	public static void show(long id, boolean isNew)
	{
		// checkAccess(id);
		renderArgs.put("kanban", Kanban.findById(id));
		if (isNew)
			renderArgs.put("isNew", isNew);
		render();
	}
	
	
	public static void create(@Required String name, String goal, @Required int workflow, String workflow_customize, @Required String size, boolean _public)
	{
		if (validation.hasErrors())
		{
			params.flash(); // add http parameters to the flash scope
			validation.keep(); // keep the errors for the next request
			_new();
		}
		
		SocialUser socialUser = SecureSocial.getCurrentUser();
		User _user = User.find("bySocialID", socialUser.id.id).first();
		
		
		Board b = Board.getDefaultBoard(size);
		
		Kanban k = new Kanban();
		k.name = name;
		// k.goal = goal;
		k.board = b;
		if (_public)
			k._public = true;
		k.save();
		
		UserKanban uk = new UserKanban(_user, k);
		uk.save();
		
		createWorkflow(workflow_customize, k);
		// switch (workflow)
		// {
		// case 1:
		// createWorkflow("Todo,Done", k);
		// break;
		// case 2:
		// createWorkflow("Todo,In Progress, Done", k);
		// break;
		// case 3:
		// createWorkflow(name, k);
		// break;
		// case 4:
		// createWorkflow(workflow_customize, k);
		// break;
		// default:
		// error();
		// break;
		// }
		
		show(k.id, true);
	}
	
	
	private static void createWorkflow(String values, Kanban k)
	{
		if (values != null && !values.equals(""))
		{
			String valuearr[] = values.split(",");
			for (String v : valuearr)
			{
				ValueStream value = new ValueStream(v, k);
				value.save();
			}
		}
	}
	
	
	/**
	 * cant update value stream currently
	 * @param id
	 * @param name
	 * @param goal
	 */
	public static void update(long id, String name)
	{
		// checkAccess(id);
		Kanban k = Kanban.findById(id);
		k.name = name;
		k.save();
		index();
	}
	
	
	public static void delete(long id)
	{
		// checkAccess(id);
		Kanban k = Kanban.findById(id);
		
		TextNote.delete("kanban", k);
		ValueStream.delete("kanban=?", k);
		UserKanban.delete("kanban", k);
		
		k.delete();
		index();
	}
	
	
	public static void index()
	{
		SocialUser socialUser = SecureSocial.getCurrentUser();
		User user = User.find("bySocialID", socialUser.id.id).first();
		List<UserKanban> kanbans = UserKanban.find("byUser", user).fetch();
		renderArgs.put("kanbans", kanbans);
		render();
	}
	
	
	public static void notes(long id)
	{
		// checkAccess(id);
		List<TextNote> notes = TextNote.find("byKanban", Kanban.findById(id)).fetch();
		for (TextNote textNote : notes)
		{
			textNote.kanban = null;
			textNote.value = null;
		}
		renderJSON(notes);
	}
	
	
	public static void getBackground(long id)
	{
		// checkAccess(id);
		Kanban k = Kanban.findById(id);
		List<ValueStream> vs = ValueStream.find("byKanban", k).fetch();
		HashMap m = new HashMap();
		m.put("background", k.background);
		for (ValueStream valueStream : vs)
		{
			valueStream.kanban = null;
		}
		m.put("stream", vs);
		renderJSON(m);
	}
	
	
	public static void setBackground(long id, String dataURL)
	{
		// checkAccess(id);
		Kanban k = Kanban.findById(id);
		k.background = dataURL;
		k.save();
		renderJSON(new String("OK"));
	}
	
	
	public static void _new()
	{
		render();
	}
	
	
	public static void _update(long id)
	{
		// checkAccess(id);
		Kanban kanban = Kanban.findById(id);
		render(kanban);
	}
	
	
	public static void share(long id, String email)
	{
		// checkAccess(id);
		User u = User.find("byEmail", email).first();
		Kanban k = Kanban.findById(id);
		
		UserKanban uk = UserKanban.find("byUserAndKanban", u, k).first();
		if (uk == null)
		{
			UserKanban share = new UserKanban(u, k);
			share.save();
		}
		
		index();
	}
	
	
	public static void _share(long id)
	{
		// checkAccess(id);
		Kanban kanban = Kanban.findById(id);
		render(kanban);
	}
	
	
	public static void _edit(long id)
	{
		// checkAccess(id);
		Kanban kanban = Kanban.findById(id);
		render(kanban);
	}
	
	
	// private static void checkAccess(long id)
	// {
	// Kanban kanban = Kanban.findById(id);
	// if (!kanban._public)
	// {
	// SocialUser suser = SecureSocial.getCurrentUser();
	// UserKanban uk = UserKanban.findBySocialIDAndKanbanID(suser.id.id, id);
	// if (uk == null)
	// forbidden();
	// }
	// }
	
	
	@Before(unless = { "create", "index", "_new" })
	static void checkKanbanAccessRight(long id) throws Throwable
	{
		Kanban kanban = Kanban.findById(id);
		if (!kanban._public)
		{
			SecureSocial.DeadboltHelper.beforeRoleCheck();
			
			SocialUser suser = SecureSocial.getCurrentUser();
			UserKanban uk = UserKanban.findBySocialIDAndKanbanID(suser.id.id, id);
			if (uk == null)
				forbidden();
		}
	}
	
}
