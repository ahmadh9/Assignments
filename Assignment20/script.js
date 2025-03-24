
const grades = [60, 70, 80, 90];


grades.forEach(function(grade) {
    console.log(grade);
});
const newGrades = grades.map(function(grade) {
    return grade + 5;
});

console.log(newGrades); // [65, 75, 85, 95]


function sum(...numbers){
  return  numbers.reduce((a , b)=> a + b ,0);
}
console.log(sum(1,2,3,4,53,1,34,4,1))