const superagent = require('superagent');

class JobspeakerClient {
  constructor (environment = 'staging') {
    if (environment === 'production') {
      this.url = 'https://api.jobspeaker.com';
    } else {
      this.url = 'https://api-staging.jobspeaker.com';
    }
  }

  auth (uid, key) {
    return superagent
      .get(`${this.url}/js/p/api/auth`)
      .query({ client_id: uid, key })
      .then((res) => {
        return res.body;
      });
  }

  listStudents (token, limit, offset) {
    return superagent
      .get(`${this.url}/js/p/api/students`)
      .query({ limit, offset, api_token: token })
      .then((res) => {
        return res.body;
      });
  }
}

module.exports = JobspeakerClient;
