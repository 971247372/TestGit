import passport from 'passport';
import { isDev, CTX } from '../config';

export const init = async (app, { api }) => {
  const Strategy = require('./strategy/index').Strategy;
  const WechatStrategy = require('./wechat-strategy').Strategy;
  passport.use(new Strategy((req, username, password, imageVerifyCode, done) => {
    // const sessionId = req.session.id;
    const promise = Promise.resolve();
    // if (!isDev && req.headers['x-leanbi-captcha'] !== 'false') {
    //   // not check code image while in dev
    //   promise = api.get('/verify/verify-code-image/verify', {
    //     params: {
    //       sessionId,
    //       imageVerifyCode
    //     }
    //   });
    // }
    const Authorization = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    promise
      .then(() =>
        api.get('/login/account', {
          headers: {
            Authorization
          }
        }))
      .then(data => {
        console.info('User login: ', data);
        return done(null, data);
      })
      .catch(error => {
        console.log(error);
        return done(error);
      });
  }));

  passport.use(
    'wechat',
    new WechatStrategy((req, code, done) => {
      console.log('wechat code: ', code);
      api
        .get('/login/mobile/permit', {
          params: {
            code
          }
        })
        .then(
          data => {
            if (!data) {
              return done(new Error('获取用户信息失败'));
            }
            console.info('Wechat User login: ', data);
            return done(null, data);
          },
          error => {
            console.log(error);
            return done(error);
          }
        );
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  app.use(passport.initialize());
  app.use(passport.session());
};
