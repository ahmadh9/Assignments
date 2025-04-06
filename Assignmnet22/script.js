
let arr1=[1,3,6,87,4,22,3];
function findMax(arr) {
    let max = arr[0]; 
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]; 
      }
    }
    return max;
  }
  console.log(findMax(arr1));

   let grades = [75, 88, 92, 60];


  function findMax(arr){

    let max = arr[0];
    for (let i=1; i< arr.length;i++){

        if (arr[i] > max){
            max = arr[i];
        }
    }
    return max;
  }
console.log(findMax(grades)); 

  


function reverseArray(arr) {
    let reversed = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      reversed.push(arr[i]);
    }
    return reversed;
  }
  
  

function reverseArray(arr){


    let reversed=[];

    for(let i = arr.length -1 ; i>=0;i--){

        reversed.push(arr[i]);
    }
    return reversed;
}
console.log(reverseArray(grades))

function findTwoSum(arr, target) {
for(let i=0;i<arr.length;i++){

    for  (let j = i+1 ;j<arr.length;j++){
        if(arr[i] + arr[j] === target){
            return [arr[i],arr[j]];
        }


    }

}
return null;

}

console.log(findTwoSum(grades,152))