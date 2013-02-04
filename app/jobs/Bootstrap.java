package jobs;

import models.Kanban;
import models.ValueStream;
import play.Logger;
import play.Play;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;

@OnApplicationStart
public class Bootstrap extends Job<Void>
{
	
	@Override
	public void doJob() throws Exception
	{
		if (Play.mode.isProd())
		{
			Logger.debug("prod mode", "");
			if (Kanban.count() == 0)
				Fixtures.loadModels("init.yml");
		}
		else
		{
			Logger.debug("test mode", "");
			if (Kanban.count() == 0)
			{
				Fixtures.delete();
				Fixtures.loadModels("data.yml");
			}
		}

		Kanban tryit = Kanban.find("byName", "easykanban_development").first();
		String valuearr[] = new String[5];
		valuearr[0] = "Idea";
		valuearr[1] = "Issue";
		valuearr[2] = "In Progress";
		valuearr[3] = "Done";
		valuearr[4] = "Deploy";
		
		for (String v : valuearr)
		{
			ValueStream value = new ValueStream(v, tryit);
			value.save();
		}
	
	}
	
}
