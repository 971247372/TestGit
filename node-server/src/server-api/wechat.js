/**
 * @Author: vicky
 * @Date:   2017-08-02 17:22:26
 * @Last modified by:   vicky
 * @Last modified time: 2017-08-17 10:59:57
 */

import passport from 'passport';
import express from 'express';
import { CTX, isDev } from '../config';

const router = express.Router(); // eslint-disable-line

export default ({ api }) => {
  router.get('/auth', (req, res) => {
    const { redirect, mobile } = req.query;
    req.session.wechat = {
      redirect
    };

    const prefix = isDev ? CTX : `${CTX}/mobile`;

    if (isDev) {
      // 开发环境用假登录
      return api
        .get(`/login/dev/${mobile || '13862554239'}`)
        .then(data =>
          req.logIn(data, () => {
            res.redirect(req.session.wechat.redirect);
          }))
        .catch(err => {
          console.log(err);
          res.redirect(`${prefix}/login-fail`);
        });
    }
    api
      .get('/login/mobile')
      .then(data => res.redirect(data))
      .catch(err => {
        console.log(err);
        res.redirect(`${prefix}/login-fail`);
      });
  });

  router.get('/auth/callback', passport.authenticate('wechat'), async (req, res) => {
    const prefix = isDev ? CTX : `${CTX}/mobile`;
    res.redirect(req.session.wechat.redirect
      ? decodeURIComponent(req.session.wechat.redirect)
      : `${prefix}/login-fail`);
  });

  return router;
};
