import app from './app';
import "./DB"

app.listen(app.get('port'));
console.log('Server on port', app.get('port'));