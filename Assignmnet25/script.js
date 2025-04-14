document.getElementById("btn1").onclick = function() {
    display.value += "1";
  };
  document.getElementById("btn2").onclick = function() {
    display.value += "2";
  };
  document.getElementById("btn3").onclick = function() {
    display.value += "3";
  };
  document.getElementById("btn4").onclick = function() {
    display.value += "4";
  };
  document.getElementById("btn5").onclick = function() {
    display.value += "5";
  };
  document.getElementById("btn6").onclick = function() {
    display.value += "6";
  };
  document.getElementById("btn7").onclick = function() {
    display.value += "7";
  };
  document.getElementById("btn8").onclick = function() {
    display.value += "8";
  };
  document.getElementById("btn9").onclick = function() {
    display.value += "9";
  };
  document.getElementById("btn0").onclick = function() {
    display.value += "0";
  };
  document.getElementById("btnPls").onclick = function() {
    display.value += "+";
  };
  document.getElementById("btnRim").onclick = function() {
    display.value += "%";
  };
  document.getElementById("btnMin").onclick = function() {
    display.value += "-";
  }
  document.getElementById("btnDiv").onclick = function() {
    display.value += "/";
  }
 
  document.getElementById("btnMul").onclick = function() {
    display.value += "*";
  }

  document.getElementById("btnEq").onclick = function() {
    display.value = eval(display.value);
  };
  
  document.getElementById("btnClr").onclick = function() {
    display.value = "";
  };
  