import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
// import apiv1 from './v1/routes/api1';
import apiv2 from './v2/routes/api2';
import swaggerDocument from './swagger.json';

dotenv.config();
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static('./client/dist/'));
// app.use(express.static('./client/public/'));

// app.use('/api/v1', apiv1);
app.use('/api/v2', apiv2);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT);

module.exports = app;
