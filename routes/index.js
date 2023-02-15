const router = require('koa-router')();
const gpt = require('../contorller/gpt');
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello ChatGPT'
  });
});
router.post('/message', async (ctx, next) => {
  await gpt.request(ctx, next);
});
router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
});

module.exports = router;
