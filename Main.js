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

function scanTri(point1i,point2i,point3i,color){
    
    let point1 = 0
    let point2 = 0
    let point3 = 0
    if (slope(point1i, point2i) == 0){
        point3 = point3i
        point1 = point1i
        point2 = point2i
    }else if(slope(point2i,point3i) == 0){
        point3 = point1i
        
        point1 = point3i
        point2 = point2i
    }else{
        point3 = point2i
        point1 = point1i
        point2 = point3i
    }
     
    let m1 =  slope(point1, point3)
    let b1 =  point1[1]- m1*(point1[0])
    let m2 =  slope(point2, point3)
    let b2 =  point2[1]- m2*(point2[0])
    minY = Math.min(point3[1],point1[1])
    maxY = Math.max(point3[1],point1[1])
    console.log(b1, m1, b2, m2)
    
    for(let y = minY; y<=maxY; y++){
        if (m1 == Infinity || m1 == -Infinity){
            x1 = point1[0]
        }else{x1= (y-b1)/(m1)}
        

        if (m2 == Infinity || m2 == -Infinity){
            x1 = point2[0]
        }else{x2= (y-b2)/(m2)}

        
        fillLine([x1, y], [x2, y],color)
        console.log()
        
   }
     //method does not work, change this to use the specified scan line

     //tommorow finish line drawing, filling, 3d projection and z buffering.
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


context.putImageData(imageData,0,0)

console.log(imageData.data)
