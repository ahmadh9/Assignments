let arr=[1,2,3,4,5];

let result = arr.map(num => num *3);
console.log(result);

let arr1= [1 ,2,2,3,3 ,4 ,5]

let numbers = arr1.filter((num,index)=> arr1.indexOf(num) === index);
console.log(numbers);


let arr2 = [
{name: "hussam",age: 30} ,
{name: "Ali",age:40} ,
{name: "Ahmad",age:22}
];

arr2.sort((i,j) => i.age - j.age);

console.log(arr2);

let prices = [50, 10, 100, 5, 25];

prices.sort((a,b) => a - b);
console.log(prices);