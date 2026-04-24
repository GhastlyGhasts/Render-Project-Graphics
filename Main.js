const canvas = document.getElementById("MainRender")
const context = canvas.getContext("2d")
var imageData =  context.createImageData(500,500)
var textureData = []
var FOV = 200
const content = ""
//fetch("Cube.obj", "utf-8").then(response=>response.text()).then(data => content).catch(error => console.error("error",error))
var ZBuffer = []
//script for the new refactor classes
//import * as cls from "./Class.js"
//import * as parse from "./parse.js"
//parse.parseOBJ(content)
//var RedGreenBlue = new cls.mesh(0,new cls.point3d(2,2,3),new cls.point3d(1,2,3))
/*

A mesh will be represented by a series of points, each offset by the position.
Inside of the class, each point is represented as it's offset from the origin.
These will be read from a OBJ file, where the first  verticies are read, then
the F lines are parsed to determine the placement of faces. Lastly, the U, V coords 
are also determined in a way such that interpolation between the coordanates are possible
in this render system.
*/
context.putImageData(imageData,0,0)

// Image Data Array
// data[i] = R 


// data[i+1] = G
// data[i+2] = B
// data[i+3] = A
var matrixOfQuads = [
   //back
   50,50,100,
   100,50,100,
   100,100,100,
   50,100,100,[0,255,0,255],
   
   
  
 
   //bottom
   50,100,75,
   100,100,75,
   100,100,100,
   50,100,100,[0,0,255,255],
   
   
   //top
   50,50,75,
   100,50,75,
   100,50,100,
   50,50,100,[0,0,255,255],
   //side
   
   
   
   50,100,100,
   50,50,100,
   50,50,75,
   50,100,75,[0,255,0,255],
   
   //front
   50,50,75,
   100,50,75,
   100,100,75,
   50,100,75,[255,0,0,255],
   
   
   
   
]
function sleep(ms) {
    console.log("heyy")
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calcFocalLen(fov){
    Focal = fov
    return Focal
}
function wipeScreen(){
for (let i = 0; i<imageData.data.length;i+=4){
    imageData.data[i] = 112
    imageData.data[i+1] = 112
    imageData.data[i+2] = 29
    imageData.data[i+3] = 255
    if(i%4 == 0){
     ZBuffer[i] = 9999   
    }
    
}}
wipeScreen()


// returns the index of the red
function findIndexOfXY(x, y){
    let total = (x+y*imageData.width)*4
    return total
}
function findZBufferIndexOfXY(x,y){
    let total = (x+y*imageData.width);
}

function findAreaOfTri(point1,point2,point3){
    let x1 = +point1[0]
   let x2 = +point2[0]
   let x3 = +point3[0]
   let y1 = +point1[1]
   let y2 = +point2[1]
   let y3 = +point3[1]
   return 1/2*(Math.abs( (x1*(y2-y3))+ (x2*(y3-y1))+ (x3*(y1-y2))))
}
// 
function baryocentricCalc(mpoint,point1,point2,point3){
   let xc = +point1[0]
   let xb = +point2[0]
   let xa = +point3[0]
   let yc = +point1[1]
   let yb = +point2[1]
   let ya = +point3[1]
   let xm = mpoint[0] 
   let ym = mpoint[1]
   
   let bfA = findAreaOfTri([x1,y1],[x2,y2],[x3,y3])  
   let bu = (findAreaOfTri([xc,yc],[xb,yb],[xm,ym]))/bFA
   let bw = (findAreaOfTri([xa,ya],[xb,yb],[xm,ym]))/bFA
   let bv = (findAreaOfTri([xc,yc],[xa,ya],[xm,ym]))/bFA
   return [b1,b2,b3]
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
   let x0 = +point1[0]
   let x1 = +point2[0]
   let y0 = +point1[1]
   let y1 = +point2[1]
   let z0 = +point1[2]
   let z1 = +point2[2]
   let dx = Math.abs(x1-x0)
   let dy = Math.abs(y1-y0)
   let sx = Math.sign(x1-x0)
   let sy = Math.sign(y1-y0)
   let err = dx-dy
   let i = 0
   while(true){
    i++;
    let err2 = err*2
    
    fillPixel(x0,y0,color)
        if (Math.round(x0)==Math.round(x1)&&Math.round(y0)==Math.round(y1)){break}
        
        if(err2 > -1*dy){err -= dy;x0+=sx}
        if(err2 < dx){err +=dx;y0+=sy}
   }
    
}
function convertToXY(xi,yi,z){
   
   // this projection make no sense
   let x =0
   let scale = FOV
   let y = 0
   if (z==0){
        x = xi*scale;
        y = yi*scale;
   }else{
    x = ((xi/(z))*scale) 
    y = ((yi/(z))*scale) 
   }
   
   //console.log(xi,yi," v ", x,y,z)
   
   return [x,y]
}
function fillTri(point1,point2,point3, color){
    let m1 =  slope(point1, point3)
    let b1 =  point1[1]- m1*(point1[0])
    let m2 =  slope(point2, point3)
    let b2 =  point2[1]- m2*(point2[0])
    let minY = Math.min(point3[1],point1[1])
    let maxY = Math.max(point3[1],point1[1])
    let x1 = 0
    let x2 = 0
   
    
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
        
        
        //await sleep(100)
        
   }
   
   
   
   
}
 function scanTri(point1i,point2i,point3i,color){
    let points = sortPoints([point1i,point2i,point3i])
    let point3 =[]
    let point2 =[]
    let point1 =[]
    if (points[0][1]==points[1][1]){
         point3 = points[2]
         point1 = points[0]
         point2 = points[1]
    }else{
        point3 = points[0]
        point1 = points[2]
        point2 = points[1] 
    }
    point3= point3.map(Math.round)
    point2= point2.map(Math.round)
    point1 = point1.map(Math.round)
    
    if (point1[1] == point2[1] || point2[1] == point3[1]||point1[1] == point3[1]){
        fillTri(point1,point2,point3,color)
    }else{

        let point4 = [Math.round(point1[0] + ((point2[1] - point1[1]) / (point3[1] - point1[1])) * (point3[0] - point1[0])),    point2[1]]
        //console.log(point1,point2,point4)
        
        fillTri(point4,point2,point1,color)
        fillTri(point4,point2,point3,color)
        //fillTri(point1,point4,point3,color)
    }
    
    //console.log(point1,point2,point3)
    
    // not working due to the fact that the rendering needs to be properly implemented
    //for a slope higher than 1 on a slope going negative, investigate line drawing

     //tommorow finish line drawing, filling, 3d projection and z buffering.
}



function fillQuad(point1,point2,point3,point4,color){
    console.log(point1,point2,point3,point4)
    scanTri(point1,point2,point3,color)
    scanTri(point1,point3,point4,color)
}

//fillTri([70,0],[300,200], [100,200],[255,0,0,255])
//fillQuad([10,10],[110,10], [110,110], [10,110],[255,0,0,255])
//fillTri([300,0], [150,100], [0,0],[255,0,0,255])


//fillTri([300,0], [300,100], [150,0],[255,0,0,255])

//scanTri([300,121], [220,10], [150,110],[255,0,0,255])


//scanTri([300,200], [100,200], [150,110],[255,0,0,255])
//fillLine([100,100],[100,10], [255,0,0,255])



for(let i = 0; i<matrixOfQuads.length; i+=13){
    
    fillQuad(
    convertToXY(matrixOfQuads[i],matrixOfQuads[i+1],matrixOfQuads[i+2]),
    convertToXY(matrixOfQuads[i+3],matrixOfQuads[i+4],matrixOfQuads[i+5]),
    convertToXY(matrixOfQuads[i+6],matrixOfQuads[i+7],matrixOfQuads[i+8]),
    convertToXY(matrixOfQuads[i+9],matrixOfQuads[i+10],matrixOfQuads[i+11]),
    matrixOfQuads[i+12])
}
function mainFunc(){
    
    FOV = document.getElementById("rangeFOV").value
    wipeScreen();
    for(let i = 0; i<matrixOfQuads.length; i+=13){
    
    fillQuad(
    convertToXY(matrixOfQuads[i],matrixOfQuads[i+1],matrixOfQuads[i+2]),
    convertToXY(matrixOfQuads[i+3],matrixOfQuads[i+4],matrixOfQuads[i+5]),
    convertToXY(matrixOfQuads[i+6],matrixOfQuads[i+7],matrixOfQuads[i+8]),
    convertToXY(matrixOfQuads[i+9],matrixOfQuads[i+10],matrixOfQuads[i+11]),
    matrixOfQuads[i+12])
    }
    context.putImageData(imageData,0,0)
} 

mainFunc()
//setInterval(mainFunc,10)