// function calculateSalary(salary,bonus){

// return salary+bonus;
// }

// let total = calculateSalary(100,20);

// console.log(total)

// function result(name,marks){
//   if(marks>50){
//     return name + " passed "
//   } else {
//    return name + " failed "
//   }
// }
// let check = result("Ahmad", 70);

// console.log(check)

// function isPassed(num){

//   return num>50;

// }

// console.log(isPassed(51))

// function isQualified(age,hasLicense){

//   return age > 18 && hasLicense;

// }

// isQualified(19);

// let people = [
//   { name: "Omar", age: 22, hasLicense: true },
//   { name: "Lina", age: 17, hasLicense: true },
//   { name: "Salim", age: 30, hasLicense: false }
// ];

// let qualifiedPeople = [];

// for(let i=0;i<people.length;i++){
// if(isQualified(people[i].age,people[i].hasLicense)){
// qualifiedPeople.push(people[i]);
// }

// }
// console.log(qualifiedPeople)

// let employees = [
//   { name: "Ahmad", salary: 900, active: true },
//   { name: "Lina", salary: 700, active: false },
//   { name: "Yazan", salary: 850, active: true }
// ];

// for(let i = 0; i<employees.length;i++){

//   if(employees[i].active){

//     employees[i].salary = employees[i].salary + 100;

//   }

// }
// console.log(employees)

// function calculateDiscount(price, percentage){

//   return finalPrice = price-(percentage/100)*price
// }
// console.log(calculateDiscount(480,25))

// let arr=[1,2,3,4,5,20];

// function sumArray(){

// let arr1=[1,3,5,7,9]
// return sum;
// }
// function sumArray(arr) {
//   let total = 0;

//   for (let i = 0; i < arr.length; i++) {
//    total = total+arr[i];
//   }

//   return total;
// }

// console.log(sumArray(arr))

// let nums = [2, 4, 6, 3];

// function countUntilTarget(nums, target) {

// let current = 0;
// let count=0
//   for (let i = 0; i < nums.length; i++) {
//     if(current+nums[i]<target){
//       count++;
//       current=current+nums[i];
//     }

//   }
//   return current;
// }
// console.log(countUntilTarget(nums, 16));


// let nums = [ 7, 1, 9, -1, 100, 200];
  

//  function findMaxBeforeStop(nums){
// let max = nums[0];

//   for(let i=0;i<nums.length;i++){
// if(nums[i] === -1 ){
// break;
// } if(nums[i]>max) {
//   max= nums[i]

// }

//   } return max;
//  }
//  console.log(findMaxBeforeStop(nums))

let nums = [1, 2, 2, 3, 4, 4, 5];

function sumOfUnique(nums){
let current=nums[0];
  for(let i=0; i<nums.length;i++){
if(current!=nums[i]){
nums[i]=current;  
}

  } return current;
}
console.log(sumOfUnique(nums))