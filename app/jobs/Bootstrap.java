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
		Fixtures.deleteAllModels();
		Fixtures.loadModels("data.yml");
	}

}
