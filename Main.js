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

function sleep(ms) {
    console.log("heyy")
    return new Promise(resolve => setTimeout(resolve, ms));
}
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

function sortPoints(points){
   return points.sort(function(a,b){return a[1]-b[1]})
}
//Point = [x,y]
function fillLine(point1,point2, color){
    
    /*let m =  slope(point1, point2)
    let b =  point1[1]- m*(point1[0])
    console.log(m)
    */
    let minX = Math.min(point1[0], point2[0])
    let minY = Math.min(point1[1], point2[1])
    let maxX = Math.max(point1[0], point2[0])
    let maxY = Math.max(point1[1], point2[1])
    //issue could be the min max system
    /*
    if (m == Infinity || m== -Infinity){
        
        for(let i = minY; i<maxY; i++){fillPixel(minX,i,color)}
    }else{

    for(let i = minX; i<maxX; i++){
       
        fillPixel(i, Math.round((m*i) + b), color)
    }} 
    */
    
    
    let x0 = point1[0]
    let x1 = point2[0]
    let y0 = point1[1]
    let y1 = point2[1]
    if (x0>x1){
        let tempx = x1
        let tempy = y1
        x1=x0
        x0=tempx
        y1 = y0
        y0=tempy
    }
    let dx = x1 - x0
    let dy = y1 - y0
    let D = 2*dy - dx
    let x= x0
    let y = y0
    let m = (y1-y0)/(x1-x0)
    

    if(m == Infinity || m== -Infinity){
        
        
        for(let i = minY; i<maxY; i++){fillPixel(minX,i,color)}
        
    }else if((m<-1||m>1)){
        // iterate over y 
        for(let y= y0; y<y1;y++){
            //this runs properly
            fillPixel(x, y,color)
            if (D > 0){
                x = x + 1
                D = D + (2 * (dx - dy))
            }else{
                D = D + 2*dx
            } 
            
        }
        
        
        
        
    } else{
        for (let x  = x0; x<x1; x++){
            fillPixel(x, y,color)
            if (D > 0){
                y = y + 1
                D = D + (2 * (dy - dx))
            }else{
                D = D + 2*dy
            } 
        
        }
    }
    
}
//function convertToXY(xi,yi,z){
   // let x = 
 //   return [x,y]
//}
 function scanTri(point1i,point2i,point3i,color){
    let points = sortPoints([point1i,point2i,point3i])

    if (points[0][1]==points[1][1]){
        point3 = points[2]
        point1 = points[0]
        point2 = points[1]
    }else{
       point3 = points[0]
       point1 = points[2]
       point2 = points[1] 
    }
    
    
    //console.log(point1,point2,point3)
    let m1 =  slope(point1, point3)
    let b1 =  point1[1]- m1*(point1[0])
    let m2 =  slope(point2, point3)
    let b2 =  point2[1]- m2*(point2[0])
    minY = Math.min(point3[1],point1[1])
    maxY = Math.max(point3[1],point1[1])
    
    
    for(let y = minY; y<=maxY; y++){
        // rewrite this to only use integer math
        //probably do something with bresseham 
        // the current problem is that the filling method uses non-integers, causing the weird line skips.
        // fix this soon, math.round is a temp fix
        if (m1 == Infinity || m1 == -Infinity){
            x1 = point1[0]
        }else{x1= Math.round((y-b1)/(m1))}
        

        if (m2 == Infinity || m2 == -Infinity){
            x2 = point2[0]
        }else{x2= Math.round((y-b2)/(m2))}

        
        fillLine([x1, y], [x2, y],color)
        context.putImageData(imageData,0,0)
        
        //await sleep(100)
        
   }
    // not working due to the fact that the rendering needs to be properly implemented
    //for a slope higher than 1 on a slope going negative, investigate line drawing

     //tommorow finish line drawing, filling, 3d projection and z buffering.
}

function fillTri(point1,point2, point3, color){
   //fillLine(point1,point2,color)
   //fillLine(point2,point3,color)  
   //fillLine(point3,point1, color)


   // code here to check if iso or equi triangle, which does not require a jointed tri approach
   
    scanTri(point1,point2,point3,color)
  
   
}

function fillQuad(point1,point2,point3,point4,color){
    fillTri(point1,point2,point3,color)
    fillTri(point1,point3,point4,color)
}

//fillTri([70,0],[300,200], [100,200],[255,0,0,255])
fillQuad([10,10],[110,10], [110,110], [10,110],[255,0,0,255])
//fillTri([300,0], [150,100], [0,0],[255,0,0,255])


//fillTri([300,0], [300,100], [150,0],[255,0,0,255])

fillTri([300,110], [220,10], [150,110],[255,0,0,255])

//fillLine([50,100],[0,0], [255,0,0,255])

console.log(sortPoints([[300,10], [220,250], [150,10]]))
context.putImageData(imageData,0,0)