package models;

import javax.persistence.Entity;

import com.google.gson.Gson;

@Entity
public class VideoNote extends StickyNote
{
	public String videoID;


	public VideoNote(Kanban kanban, int x, int y)
	{
		super(kanban, x, y);
	}


	public VideoNote(Kanban kanban, String videoID)
	{
		super(kanban, 0, 0);
		this.videoID = videoID;
	}


	public String toJson()
	{
		this.kanban = null;
		this.value = null;
		return new Gson().toJson(this);
	}

}
