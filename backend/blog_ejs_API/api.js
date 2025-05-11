const express= require("express");
const bodyParser = require("body-parser");
const app =express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let posts = [
    {
      id: 1,
      title: "Hello and welcome",
      content: "This is my first blog post.",
      author: "Ahmed",
      date: "2025-05-11"
    }
  ];
  

  app.get("/posts",(req,res)=>{
res.status(200).json(posts);

  })
  let lastId = 1;
app.post("/posts",(req,res)=>{


    const newPost ={
        id: lastId+1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toISOString()
    };
    posts.push(newPost);
    lastId++;
    res.status(201).json(newPost);
})

app.get("/posts/:id",(req, res)=> {
    const id  = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);


    if(post){
        res.status(200).json(post);

    } else{
        res.status(404).json({ Error: "page not found" });

    }
});


app.patch("/posts/:id",(req,res)=>{
const id =parseInt(req.params.id);
const postIndex =posts.findIndex(post => post.id === id);

if(postIndex > -1){
    const postObj =posts[postIndex];
    const updatedPost ={
        id,
        title: req.body.title || postObj.title,
        content: req.body.content || postObj.content,
        author: req.body.author || postObj.author,
        date: postObj.date
    };
    posts[postIndex] = updatedPost;
    res.status(200).json(updatedPost);
}else{
    res.status(404).json({ error: `Post with ID ${id} not found` });
}

});
app.delete("/posts/:id",(req,res)=>{
const id = parseInt(req.params.id);
const postIndex = posts.findIndex(post => post.id === id);

if(postIndex > -1){
posts.splice(postIndex, 1);
res.sendStatus(200);

 } else {
    res.status(404).json({ error:`Post with ID ${id} not found`});
 }
});



  app.listen(4000, () => {
    console.log("API Server running on http://localhost:4000");
  });
  