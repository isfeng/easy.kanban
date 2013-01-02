package jobs;

import models.Kanban;
import models.User;
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
				Fixtures.loadModels("data.yml");
		}
		
	}
	
}
