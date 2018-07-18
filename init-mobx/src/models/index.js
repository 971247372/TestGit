const context = require.context('./', false, /\.js$/);
const keys = context.keys().filter(item => item !== './index.js');

const models = {};
for (let i = 0; i < keys.length; i += 1) {
  const Model = context(keys[i]).default;
  models[context(keys[i]).name] = new Model();
}

export default models;
