import express, { Router } from 'express';
import bodyParser from 'body-parser';
import dotnev from 'dotnev';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes/usersRoutes.js';





dotnev.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname,'../public'));

app.use('/',router);


app.listen(process.env.pot, ()=>
{})
