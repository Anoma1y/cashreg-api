import app from './app';
import Config from './config';

app.listen(Config.port, () => {
  console.log(`Server is listening on port: ${Config.port}`);
  console.log('  Press CTRL-C to stop\n');
});
