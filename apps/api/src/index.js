import { Hono } from 'hono';
const app = new Hono();
app.get('/', (c) => {
    return c.json({
        status: 'ok',
        service: 'Provo API',
        timestamp: new Date().toISOString()
    });
});
export default app;
