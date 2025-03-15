//1
let st1 = "This is the first trying , This is the first trying This is the first trying";

function lengthCheck(st1) {
    if (st1.length < 280) { 
        return "The tweet is accepted";
    } else {
        return "Too long tweet";
    }
}
console.log(lengthCheck(st1));
//2

let username = "Akm132";
 
  if( username.charAt(0) === username.charAt(0).toUpperCase()) {
    console.log ("username Accepted");
  } else {
    console.log("username Must begin with upper case!")
  }

  //3

  let st3 = "This is the first trying , This is the first trying This is the first trying";

  
  console.log(st3.toLowerCase());
  console.log(st3.toUpperCase());

  //4

  let email="  ahmadkhammad95@gmail.com   ";
  console.log(email.trim())
  console.log(email);
  //5

  let st4 = "This is the first trying , This is the first trying This is the first trying";
console.log(st4.slice(0,18));

//6 
let pnumber = "0780090128";
console.log("*******" + pnumber.substring(7,10));

//7
let st5 = "This is the first trying for BadWord, This is the first trying This is the first trying";

console.log(st5.replaceAll("BadWord" , "*****"))
//8
let st6 = "This is the first trying for BadWord, This is the first trying This is the first trying";

console.log(st5.includes("BadWord" , "is"))
//9
let st7 = "This is the first trying for BadWord, This is the first trying This is the first trying";

console.log(st7.split(" "));

//10
let st8 = "image.png";

console.log(st8.endsWith(".png"))

//11
let st9 = "Repeating ";
console.log(st9.repeat(24))
//12
let st10 ="concat";
 let st11 = " try"
 console.log(st10.concat(st11))

 //13
 let st12 = "This is the first trying for BadWord, This is the first trying This is the first trying";

console.log(st12.indexOf("trying"));
console.log(st12.lastIndexOf("trying"));




