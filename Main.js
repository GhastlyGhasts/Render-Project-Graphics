const canvas = document.getElementById("MainRender")
const context = canvas.getContext("2d")
var imageData =  context.createImageData(500,500)
var textureData = []

//const tex1 = new Image(500,500)
//tex1.src = "Resource/Textures/Test_Image.png"
//console.log(tex1)
//tex1.onload = function(){context.drawImage(tex1,0,0)}

//document.body.appendChild(tex1)
context.putImageData(imageData,0,0)

// Image Data Array
// data[i] = R 
// data[i+1] = G
// data[i+2] = B
// data[i+3] = A

for (let i = 0; i<imageData.data.length;i+=4){
    imageData.data[i] = 112
    imageData.data[i+1] = 112
    imageData.data[i+2] = 29
    imageData.data[i+3] = 255
    
}



// returns the index of the red
function findIndexOfXY(x, y){
    let total = (x+y*imageData.width)*4
    return total
}


function fillPixel(x,y,color){
    let i = findIndexOfXY(x,y)
    imageData.data[i]  =color[0]
    imageData.data[i+1]  =color[1]
    imageData.data[i+2]  =color[2]
    imageData.data[i+3]  =color[3]
   
    
   
}

function slope(point1,point2){
    return  (point2[1]-point1[1])/(point2[0]-point1[0])
}
//Point = [x,y]
function fillLine(point1,point2, color){
    let m =  slope(point1, point2)
    let b =  point1[1]- m*(point1[0])
    

    let minX = Math.min(point1[0], point2[0])
    let minY = Math.min(point1[1], point2[1])
    let maxX = Math.max(point1[0], point2[0])
    let maxY = Math.max(point1[1], point2[1])
    
    if (m == Infinity || m== -Infinity){
        
        for(let i = minY; i<maxY; i++){fillPixel(minX,i,color)}
    }else{

    for(let i = minX; i<maxX; i++){
       
        fillPixel(i, Math.round((m*i) + b), color)
    }}
}

function scanTri(point1,point2,point3,color){
    let topPoint =[]
    let yLevel = 0
    let minX =0
    let maxX =0
    if (point1[1] == point2[1]){
        yLevel = point1[1]
        topPoint = point3
         minX = Math.min(point1[0], point2[0])
    
         maxX = Math.max(point1[0], point2[0])

    }else if(point2[1]==point3[1]){
        topPoint = point1
        yLevel = point2[1]
        minX = Math.min(point2[0], point3[0])
    
         maxX = Math.max(point2[0], point3[0])
    }else{
        topPoint = point2
        yLevel = point1[1]
        minX = Math.min(point1[0], point3[0])
    
         maxX = Math.max(point1[0], point3[0])
    }
    for(let i = minX; i<maxX; i++){
    fillLine([topPoint[0], topPoint[1]], [i, yLevel],color)
   }
     
}

function fillTri(point1,point2, point3, color){
   fillLine(point1,point2,color)
   fillLine(point2,point3,color)  
   fillLine(point3,point1, color)


   // code here to check if iso or equi triangle, which does not require a jointed tri approach
   if (slope(point1,point2) == 0|| slope(point2,point3) == 0||slope(point3,point1) == 0 ){
    // non-joined
    scanTri(point1,point2,point3,color)
   }else{
    // jointed
    console.log("Jointed")
   }
}


fillTri([200,0],[300,100], [100,100],[255,0,0,255])
fillLine([0,10],[100,100],[255,0,0,255])

context.putImageData(imageData,0,0)

console.log(imageData.data)
