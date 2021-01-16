// Uncomment  one of the below to use as input
// and start the script

// const input = [
//     [2,8],
//     [1,1,2,2,6,5,5,8],
//     [3,3,4,4,6,7,7,8]
// ];

// const input = [
//     [4,8],
//     [1,2,2,12,5,7,7,16],
//     [1,10,10,12,5,15,15,16],
//     [9,9,3,4,4,8,8,14],
//     [11,11,3,13,13,6,6,14]
// ];

// const input = [
//     [2,4],
//     [1,1,2,2],
//     [3,3,4,4]
// ];

const [dimensions] = input;

// get last index of both dimensions
const lastIdxN = dimensions[0] - 1;
const lastIdxM = dimensions[1] - 1;

//get the first layer from the input
const firstLayer = Array.from(input.splice(1));

//populate second layer with undefined values
const secondLayer = firstLayer.map(a => {
    return a.map(b => undefined);
});

const constraints = {
    isEven: (n) => n % 2 === 0 && n > 0,
    isWithinLimits:(n) => n <= 100 && n > 0,
}

//check if there is a brick thats oversized
function isBrickOversized(){
    let result = false;

    firstLayer.forEach((row,i)=>{
        row.forEach((num,j)=>{
            const firstHalf = firstLayer[i][j];
            const secondHalf = firstLayer[i][j+1];
            const thirdHalf = firstLayer[i][j+2];

            const secondHalfVertical = firstLayer[i+1] && firstLayer[i+1][j];
            const thirdHalfVertical = firstLayer[i+2] && firstLayer[i+2][j] ;

            if(firstHalf === secondHalf && secondHalf === thirdHalf){
                result = true;
            } else if (firstHalf === secondHalfVertical && secondHalfVertical === thirdHalfVertical){
                result = true;
            }

        });
    })

    return result;
}

//returns horizontal if the brick at position (i,j) lies horizontally or undefined otherwise
//we use this to determine the orientation of  layer 2 brick
function findBrickOrientation(i,j){
    //get the two segments of the brick
    const firstHalf = firstLayer[i][j];
    //in case the brick is on the edge we output horizontal, to indicate that we need a vertical brick for the second layer
    const secondHalf = firstLayer[i][j+1] || firstHalf;
    if(firstHalf === secondHalf){
        return "horizontal";
    }
    return undefined;
}

function buildLayer(){
    //we start with brick No:1 (in our hand)
    let brickNumber = 1;

    firstLayer.forEach((row, i) =>{
        row.forEach((c,j)=>{
            //checking if there is a piece of brick in the second layer at this position
            //if yes we skip the position as it is already taken
            if(secondLayer[i][j] === undefined){
                secondLayer[i][j] = brickNumber

                if(findBrickOrientation(i,j) === "horizontal"){
                    //if we are at the last row we need to change the way we put the vertical brick
                    if(i === lastIdxN){
                        secondLayer[i-1][j] = brickNumber;
                    }else {
                        secondLayer[i+1][j] = brickNumber;
                    }

                }else{
                    //this is where we put a horizontal brick in the layer 2
                    secondLayer[i][j+1] = brickNumber;
                }
                // incrementing the brick number (picking up the next brick)
                brickNumber++;
            }
        });
    })
}

// checking constraints
// if our input is valid we build the second layer else our layout will not be possible
    if(constraints.isEven(dimensions[0]) &&
        constraints.isEven(dimensions[1]) &&
        constraints.isWithinLimits(dimensions[0]) &&
        constraints.isWithinLimits(dimensions[1]) &&
        !isBrickOversized()){
        buildLayer();
        let stringOutput = "";
        secondLayer.forEach(row=>{
            stringOutput += row.join(" - ") + "\n";
        });
        console.log(stringOutput);
    }else{
        console.log(-1, "no solution exists for this layout");
    }



