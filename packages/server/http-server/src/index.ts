import { Server } from '@shared/infra/http/server';

const port = Number(process.env.NODE_ENV) || 3333;

Server.listen(port, () => console.log(`Server started at :${port}`));
