package models;

import java.util.List;

import models.deadbolt.Role;
import models.deadbolt.RoleHolder;
import securesocial.provider.SocialUser;

public class KanbanRoleHolder implements RoleHolder
{
	
	private String email;
	
	
	@Override
	public List<? extends Role> getRoles()
	{
		List<KanbanRole> roles = KanbanRole.find("byEmail", email).fetch();
		return roles;
		
	}
	
	
	public KanbanRoleHolder(String email)
	{
		this.email = email;
	}
	
	
	public static RoleHolder getBySocialUser(SocialUser suser)
	{
		return new KanbanRoleHolder(suser.email);
	}
}
