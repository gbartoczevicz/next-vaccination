import { server } from '@shared/infra/http/server';

const port = Number(process.env.NODE_ENV) || 3333;

server.listen(port, () => console.log(`Server started at :${port}`));
