import React from "react";

function AlertButton({ message }) {
  const handleClick = () => {
    alert(message);
  };

  return (
    <button onClick={handleClick} style={{
      marginTop: "10px",
      padding: "6px 12px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    }}>
      Show Alert
    </button>
  );
}

export default AlertButton;
