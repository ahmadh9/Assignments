import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';


inquirer
  .prompt([
{
    message:"insert url",
    name:"url",
},
  ])
  .then((answers) => {
console.log(answers.url);
var qr_svg = qr.image(answers.url);
qr_svg.pipe(fs.createWriteStream('qr-img.png'));
 fs.writeFile('qr-inputs',answers.url,(er)=>{
    if(err) throw err;
 })

  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });