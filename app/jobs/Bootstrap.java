package jobs;

import models.Kanban;
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
		if (Play.runingInTestMode())
		{
			Logger.debug("test mode", "");
			Fixtures.deleteAllModels();
			Fixtures.loadModels("data.yml");
		}
		else
		{
			Logger.debug("prod mode", "");
			if (Kanban.count() == 0)
				Fixtures.loadModels("init.yml");
		}

	}

}
