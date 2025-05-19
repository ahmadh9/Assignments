import Pool from "../config/db.js";

//

export const createUser = async (req,res)=>{

    const { name, email}= req.body;
    await Pool.query("INSERT INTO users (name,email) values ($1,$2)" ,[
        name,
        email,
    ]);
    
    res.redirect('/');
};

//read
export const getUser = async (req,res)=>{

   const result= await Pool.query("SELECT * FROM users");
    res.render('index.ejs', { users: result.rows})
};

//
export const updateUsers = async (req,res)=>{

    const { name, email}= req.body;
    const id  = req.params.id
    await Pool.query("UPDATE USERS SET NAME= $1 , email=$2 WHERE id=$3");
    res.render('index.ejs', {users:result.rows})
};


//
export const deleteUsers = async (req,res)=>{

    const { name, email}= req.body;
    const id  = req.params.id
  await Pool.query("DELETE FROM users WHERE id = $1", [id]);

};