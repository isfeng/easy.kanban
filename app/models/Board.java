package models;

import javax.persistence.Entity;

@Entity
public class Board extends BaseModel
{
	public int width;
	public int height;
}
