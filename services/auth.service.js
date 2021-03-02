const Service = require('moleculer').Service;
const { MoleculerClientError } = require('moleculer').Errors;
const jsonwebtoken = require('jsonwebtoken');
const SECRET = 'pso0298di-ldaspdaps-apsodkposk';
const JobspeakerClient = require('./JobspeakerClient');

class AuthService extends Service {
  constructor (broker) {
    super(broker);

    this.client = new JobspeakerClient(process.env.environment);

    this.parseServiceSchema({
      name: 'auth',
      version: 'v2',
      dependencies: [],
      actions: {
        refresh: {
          params: {
            refreshToken: {
              type: 'string',
              min: 25,
              max: 200
            },
            $$strict: true
          },
          rest: {
            method: 'POST',
            path: '/refresh'
          },
          handler: this.refresh
        },
        sign: this.sign,
        verify: this.verify
      }
    });
  }

  verify (ctx) {
    return jsonwebtoken.verify(ctx.params.token, SECRET);
  }

  async refresh (ctx) {
    const claims = jsonwebtoken.verify(ctx.params.refreshToken, SECRET);
    if (typeof (claims) !== 'object' || !claims.uid || !claims.key) {
      ctx.meta.$statusCode = 403;
      return new MoleculerClientError('Forbidden', 403);
    } else {
      let token;
      try {
        token = await this.client.auth(claims.uid, claims.key);
      } catch {
        ctx.meta.$statusCode = 403;
        return new MoleculerClientError('Forbidden', 403);
      }
      return {
        token: jsonwebtoken.sign(
          {
            authId: token.token,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6)
          },
          SECRET
        ),
        refreshToken: ctx.params.refreshToken
      };
    }
  }

  sign (ctx) {
    return jsonwebtoken.sign(ctx.params.claims, SECRET);
  }
}

module.exports = AuthService;
