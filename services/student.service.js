const Service = require('moleculer').Service;
const JobspeakerClient = require('./JobspeakerClient');

class StudentService extends Service {
  constructor (broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'students',
      version: 'v1',
      dependencies: [],
      actions: {
        list: {
          rest: {
            method: 'GET',
            path: '/'
          },
          handler: this.list
        }
      }
    });
    this.client = new JobspeakerClient(process.env.environment);
  }

  list (ctx) {
    return this.client.listStudents(
      ctx.meta.user.token,
      ctx.params.limit,
      ctx.params.offset
    );
  }
}

module.exports = StudentService;
