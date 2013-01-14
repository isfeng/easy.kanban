package models;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import models.deadbolt.Role;

@Entity
public class KanbanRole extends BaseModel implements Role
{
	public String roleName;
	
	
	@Override
	public String getRoleName()
	{
		return roleName;
	}
	
	
	@ManyToOne
	public User user;
}
