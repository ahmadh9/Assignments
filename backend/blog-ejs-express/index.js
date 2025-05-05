import express from 'express';
import path from 'path';
import { title } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));


let posts = [];
let nextId = 1 ;
 app.get('/', (req,res)=>{

  const intro = 'welcome to my blog! read and learn!';
res.render('home',{ intro, posts});
 }
     );

app.get('/new',(req,res)=>{
res.render('edit-post',{ post:null });

app.post('/posts', (req, res)=>{
const newPost = {
id: nextId++,
title: req.body.title,
content: req.body.content

};

posts.push(newPost);
res.redirect('/');

})


});

app.get('/edit/:id',(req,res)=>{

const post = posts.find(p=> p.id == req.params.id);
res.render('edit-post', { post});


});

app.post('/edit/:id', (req, res)=>{
const index =posts.findIndex(p => p.id == req.params.id);
posts[index].title = req.body.title;
posts[index].content = req.body.content;
res.redirect('/');


});
app.post('/delete/:id', (req, res) => {

  posts = posts.filter(p => p.id != req.params.id);
  res.redirect('/');

});

     app.listen(3000,()=>{
      console.log('server running on port 3000!');
     })