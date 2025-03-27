let array = [1, 4, 2, 8, 9];

function even(array) {
  let results = [];
  array.forEach((number) => {
    if (number % 2 === 0) {
      results.push("even");
    } else {
      results.push("odd");
    }
  });

  return results;
}

console.log(even(array));

let testWord = "Javascript";

function vowles(word) {
  let counter = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === "a" || word[i] === "e" || word[i] === "o" || word[i] === "u" || word[i] === "i") {
      counter++;
    }
   
  }
  return counter;
}

console.log(vowles(testWord));


let testWord1 = "I love JavaScript programming";

function longest(word){
    let wordarray=word.split(" ")
    let largest="";
    for( let i =0; i<wordarray.length;i++){
        if (wordarray[i].length > largest.length) {
            largest = wordarray[i];
    }
}
return largest;
}

console.log(longest(testWord1));



for(let i=1; i<=50;i++){
    if (i % 5 == 0 && i % 3 == 0) console.log("FizzBuzz");
    else if (i % 3 == 0) console.log("Fizz");
    else if (i % 5 == 0) console.log("Buzz");
    else console.log(i);

}

////

function findSecondLargest(arr) {
  
    let largest, secondLargest;

    if (arr[0] > arr[1]) {
        largest = arr[0];
        secondLargest = arr[1];
    } else {
        largest = arr[1];
        secondLargest = arr[0];
    }

    for (let i = 2; i < arr.length; i++) {
        if (arr[i] > largest) {
            secondLargest = largest;
            largest = arr[i];
        } else if (arr[i] > secondLargest && arr[i] !== largest) {
            secondLargest = arr[i];
        }
    }

    return secondLargest;  
}


let array1 = [5, 2, 10, 8, 3];
console.log("second largest", findSecondLargest(array1)); 
/////

let array2 = [1, [2, [3, 4], 5], 6];

let flatArray = [].concat(...array);

console.log("Updated Array:", flatArray);
