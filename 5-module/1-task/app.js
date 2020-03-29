const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = [];

const addClient = async () => new Promise((resolve) =>
  clients.push(resolve)
);

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await addClient();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    ctx.status = 200;
    await clients.map((resolve) => resolve(message));

    clients = [];
  }
});

app.use(router.routes());

module.exports = app;
