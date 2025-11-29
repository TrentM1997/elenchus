import './Config.js'
import { PORT } from './Config.js';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express, { Request, Response } from 'express';
import cors from 'cors';
import mime from 'mime'
import cookieParser from 'cookie-parser';
const app = express();
import { responseBinder } from '../core/middleware/responseBinder.js';
import { globalErrorHandler } from '../core/middleware/globalErrorHandler.js';
import { router } from '../core/routes/router.js';
import { spaFallback } from '../core/routes/spaFallback.js';

const corsOptions: object = {
	origin: ['https://elenchusapp.io', 'http://localhost:5173'],
	credentials: true,
	methods: 'OPTIONS, HEAD, GET, PUT, POST, DELETE',
	allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin || '');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const clientDistPath = path.resolve(__dirname, '../../../client/dist');

mime.define({ 'image/svg+xml': ['svg'] });


app.use(
	express.static(path.join(clientDistPath), {
		setHeaders: (res, filePath) => {
			if (filePath.endsWith('.svg')) {
				res.setHeader('Content-Type', 'image/svg+xml');
			}
		},
	})
);


app.options('*', (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://elenchusapp.io');
	res.header(
		'Access-Control-Allow-Methods',
		'OPTIONS, HEAD, GET, PUT, POST, DELETE'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.sendStatus(200);
});

app.use(responseBinder);

app.use(router);

app.use(globalErrorHandler);

app.use(spaFallback);

app.listen(PORT, () => {

	return console.log(`Express is listening at ${PORT}`);
});