import React from "react";
import AlertButton from "./AlertButton";

function StudentCard({ name, grade }) {
  const badge = grade >= 85 ? "Excellent Student" : "Needs Improvement";
    const message = `Student: ${name} — Grade: ${grade}`;

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
      <h3>{name}</h3>
      <p>Grade: {grade}</p>
      <p><strong>{badge}</strong></p>
            
      <AlertButton message={message} />
    </div>
  );
}

export default StudentCard;
