package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Entity
public class UserKanban extends BaseModel
{
	public UserKanban(User _user, Kanban k)
	{
		this.user = _user;
		this.kanban = k;
	}
	
	
	@ManyToOne
	public User user;
	
	@ManyToOne
	public Kanban kanban;
	
	@OneToOne
	public User owner;
	
	
	public static UserKanban findByEmailAndKanbanID(String email, long id)
	{
		User u = User.find("byEmail", email).first();
		Kanban k = Kanban.findById(id);
		return UserKanban.find("byUserAndKanban", u, k).first();
	}
}
