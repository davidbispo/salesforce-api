const Service = require('moleculer').Service;
const superagent = require('superagent');

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
  }

  list (ctx) {
    return superagent
      .get('https://api-staging.jobspeaker.com/js/p/api/students?api_token=032ss15c79-dc94-442c-8fd6-55cae14bf320')
      .query({ limit: ctx.params.limit, offset: ctx.params.offset })
      .then((res) => {
        return res.body;
      });
  }
}

module.exports = StudentService;
