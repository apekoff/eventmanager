import express from 'express';
import bodyParser from 'body-parser';
// import apiv1 from './v1/routes/api1';
import apiv2 from './v2/routes/api2';
import { error } from 'util';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/v1', apiv1);
app.use('/v2', apiv2);

app.get('/', apiv2);
app.use((err, req, res, next) => {
  if (err.isBoom) {
    const errors = err.output.payload.message.split(',');
    let ret = '';
    errors.forEach((error) => {
      const singleError = error.split(/\[/);
      ret = singleError[singleError.length - 1];
      ret = ret.match(/.+[^\]]/)[0];
    });
    return res.status(err.output.statusCode).json(ret);
  }
  return res.json(err);
});

app.listen(process.env.PORT || 5000);

module.exports = app;
