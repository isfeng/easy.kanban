package models;

import java.util.Date;

import javax.persistence.MappedSuperclass;

import play.db.jpa.Model;

@MappedSuperclass
public class BaseModel extends Model
{
	public Date created;
	public Date updated;
}
