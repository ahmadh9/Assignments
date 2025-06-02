import React from "react";

function Footer({ count }) {
  return (
    <div style={{
      marginTop: "20px",
      textAlign: "center",
      fontSize: "14px",
      color: "#555"
    }}>
      Total Students: {count}
    </div>
  );
}

export default Footer;
