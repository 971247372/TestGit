/**
 * @Author: vicky
 * @Date:   2017-08-02 17:22:26
 * @Last modified by:   vicky
 * @Last modified time: 2017-08-17 10:59:57
 */

import passport from 'passport';
import express from 'express';

const router = express.Router(); // eslint-disable-line

export default ({ api }) => {
  // permit, 查询二维码扫描状态
  router.get('/login/permit', async (req, res, next) => {
    api
      .get(req.path, { params: req.query })
      .then(user => {
        // isFastLogin != 1, 代表已注册登录成功
        if (user && user.userDto && user.userDto.isFastLogin !== 1) {
          return req.logIn(user, () => {
            res.json(user);
          });
        }
        res.json(user);
      })
      .catch(e => next(e));
  });

  // do login
  router.post('/login-manage', passport.authenticate('lean'), (req, res) => {
    const user = req.user;
    res.json(user);
  });

  // do logout
  router.all('/logout', (req, res) => {
    req.logout();
    res.json({});
  });

  router.get('/loadAuth', (req, res) => {
    const user = req.user;
    res.json(user || { userDto: null, token: null });
  });

  return router;
};
