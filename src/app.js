import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();

app.use(cors({ origin: true }));

const limiter = new rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(limiter);
// app.use(fileUpload({ debug: true }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(routes);

export default app;
