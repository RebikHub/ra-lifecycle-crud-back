const http = require('http');
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

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));