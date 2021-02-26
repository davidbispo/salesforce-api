const Service = require('moleculer').Service;
const { MoleculerClientError } = require('moleculer').Errors;
const jsonwebtoken = require('jsonwebtoken');
const SECRET = 'pso0298di-ldaspdaps-apsodkposk';

class AuthService extends Service {
  constructor (broker) {
    super(broker);

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
        sign: this.sign
      }
    });
  }

  verify (ctx) {
    return jsonwebtoken.verify(ctx.params.token, SECRET);
  }

  refresh (ctx) {
    const claims = jsonwebtoken.verify(ctx.params.refreshToken, SECRET);
    if (typeof (claims) !== 'object' || !claims.uid) {
      ctx.meta.$statusCode = 403;
      return new MoleculerClientError('Forbidden', 403);
    }
  }

  sign (ctx) {
    return jsonwebtoken.sign(ctx.params.claims, SECRET);
  }
}

module.exports = AuthService;
