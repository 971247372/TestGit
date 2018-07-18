import { observable, action, computed, runInAction } from 'mobx';
export default class Session {
  @observable sessionTest = '123';
}
export const name = 'session';
