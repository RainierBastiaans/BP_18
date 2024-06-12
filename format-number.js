export function formatLargeNumber(number) {
    // Convert the number to a string
    const numberString = number.toString();
    // Split the string into groups of 3 digits (reversed)
    const groups = [];
    for (let i = numberString.length - 1; i >= 0; i -= 3) {
        if (i >=3){
            groups.push(numberString.slice(Math.max(i - 3, 0), i));
        }
        else {
            groups.push(numberString.slice(Math.max(i - 3, 0), i+1))
        }
    }
  
    // Reverse the groups to get the correct order
    const formattedNumber = groups.reverse().join(" ");
  
    return formattedNumber;
  }