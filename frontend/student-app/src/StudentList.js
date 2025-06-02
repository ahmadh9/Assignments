import React from "react";
import StudentCard from "./StudentCard";



function StudentList({ students }) {
  return (
    <div>
      <h2>All Students:</h2>

      <ul>
        {students.map((student) => (
         <StudentCard
          key={student.id}
          name={student.name}
          grade={student.grade}
        />
        ))}
      </ul>
    </div>
  );
}


export default StudentList;