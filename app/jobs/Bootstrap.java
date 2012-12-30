package jobs;

import models.Kanban;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;
@OnApplicationStart
public class Bootstrap extends Job<Void>
{

	@Override
	public void doJob() throws Exception
	{
		if (Kanban.count() == 0)
			Fixtures.loadModels("data.yml");
	}

}
