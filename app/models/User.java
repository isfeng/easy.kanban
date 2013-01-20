package models;

import javax.persistence.Entity;
import javax.persistence.Table;

import securesocial.provider.ProviderType;

@Entity
@Table(name="kanban_user")
public class User extends BaseModel
{
	public String email;
	public String name;
	public String socialID;
	public ProviderType providerType;
	public int kanban_limit;
}
