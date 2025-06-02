import React from "react";
import StudentList from  "./StudentList";
import Footer from "./Footer";

function App (){
const students = [
{ id: 1,name: "sarah Ali",grade:95 },
{ id:2,name:"omar tarek",grade: 82},
{id:3, name:"Lina Haddad",grade:76 }


];

return(

  <div>
<h1>students List </h1>
<StudentList students={students}/>
<Footer count={students.length} />


  </div>
)

}
export default App;