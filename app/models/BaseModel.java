package models;

import java.util.Date;

import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import play.db.jpa.Model;

@MappedSuperclass
public class BaseModel extends Model
{
	public Date created_at;
	public Date updated_at;
	
	
	@PrePersist
	protected void onCreate()
	{
		created_at = new Date();
	}
	
	
	@PreUpdate
	protected void onUpdate()
	{
		updated_at = new Date();
	}
	
}
