const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const router = new Router();
const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const notes = [];
let nextId = 1;

router.get('/notes', async (ctx, next) => {
    ctx.response.body = JSON.stringify(notes);
    console.log(notes);
});

router.post('/notes', async(ctx, next) => {
    const data = JSON.parse(ctx.request.body)
    notes.push({text: data, id: nextId++});
    ctx.response.body = notes;
    ctx.response.status = 204;
});

router.delete('/notes/:id', async(ctx, next) => {
    const noteId = Number(ctx.params.id);
    const index = notes.findIndex(o => o.id === noteId);
    if (index !== -1) {
        notes.splice(index, 1);
    }
    ctx.response.status = 204;
});

// server for repo: ra-ra-lifecycle-chat
const messages = [];
let messageId = 1;

router.get('/messages', async (ctx, next) => {
    const from = Number(ctx.request.query.from)
    if (ctx.request.query.from === 0) {
        ctx.response.body = JSON.stringify(messages);
        return;
    }

    const fromIndex = messages.findIndex(o => o.id === from);
    if (fromIndex === -1) {
        ctx.response.body = JSON.stringify(messages);
        return;
    }

    ctx.response.body = JSON.stringify(messages.slice(fromIndex + 1));
});

router.post('/messages', async(ctx, next) => {
    const message = JSON.parse(ctx.request.body);
    messages.push({data: message, id: messageId++});
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
app.listen(port, () => console.log('server started'));
