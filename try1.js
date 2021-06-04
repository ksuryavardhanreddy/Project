//---------------EDGE---------------------//
class Edge {
    constructor(source, destination, edgeWeight) {
        this.u=source;
        this.v=destination;
        this.edgeWeight=edgeWeight;
    }
    static getEdgeWeight(allEdges, source, destination) {
        for(i=0; i<allEdges.length; i++) {
            if(allEdges[i].u==source && allEdges[i].v==destination)
                return allEdges[i].edgeWeight;
        }
        return Number.MAX_VALUE;
        var i; // hoisting...can declare varibles after it's use...
    }

    static isEdgeBw(source, destination, allEdges) {
        return Edge.getEdgeWeight(allEdges, source, destination)<Number.MAX_VALUE;
    }

    static findJ(near, elist, g) {
        var minEdgeWeight = Number.MAX_VALUE;
        var returnIndex=0;
        var temp = [];
        for(var i=0; i<near.length; i++) {
            if(Edge.isEdgeBw(i, near[i], elist) && near[i]!=-1) {
                if(Edge.getEdgeWeight(elist, i ,near[i])<minEdgeWeight) {
                    minEdgeWeight = Edge.getEdgeWeight(elist, i, near[i]);
                    returnIndex = i;
                }
                temp.push(new Edge(i, near[i], Edge.getEdgeWeight(elist, i ,near[i])));
            }
        }
        g.comparingEdgesSet.push(temp);
        return returnIndex;
    }

    static isEdgeInEdgeArray(edge, edgeArray) {
        for(var i=0; i<edgeArray.length; i++) {
            if(edge===edgeArray[i])
                return true;
        }
        return false;
    }

    static removeEdgeFromEdgeSet(edge, edgeSet) {
        for(var i=0; i<edgeSet.length; i++) {
            if(edge===edgeSet[i]) {
                var t=edgeSet[0];
                edgeSet[0] = edgeSet[i];
                edgeSet[i] = t;
                break;
            }
        }
        edgeSet.shift();
        return edgeSet;
    }
}
//--------------------------------------------end of edge--------------------------------------------//

//----------------------------------------------GRAPH----------------------------------------------//
class Graph {
    minEdge
    center
    graphRadius
    allEdges = []
    uniqueEdges = []
    vertices = []
    comparingEdgesSet = []
    mst = []
    vertexRadius
    constructor(nVertices) {
        this.nVertices = nVertices;
        var w = document.getElementById("myCanvas").width
        var h = document.getElementById("myCanvas").height
        this.center = new CoOrdinate(w/3, 20+(h/3));
        this.graphRadius = 220;
        this.vertexRadius=25;
        if(this.nVertices>8)
            this.graphRadius = 240
        this.initializeVertices();
    }
    initializeVertices() { // initializing the vertices with co-ordinates on canvas (x-rCos(theta), y+rSin(theta)) and their indices...
        theta = 360/this.nVertices;
        for(i=0; i<this.nVertices; i++) {
            this.vertices[i] = new Vertex(i);
            temp = theta*i;
            rCos_theta = this.graphRadius*Math.cos(temp*Math.PI/180);
            rSin_theta = this.graphRadius*Math.sin(temp*Math.PI/180);
            this.vertices[i].c = new CoOrdinate((this.center.x-rCos_theta).toFixed(2), (this.center.y+rSin_theta).toFixed(2));
        }
        var theta, i, temp, rCos_theta, rSin_theta;
    }
    addEdge(source, destination, edgeWeight) {
        this.allEdges[this.allEdges.length] = new Edge(source, destination, edgeWeight);
        this.uniqueEdges.push(new Edge(source, destination, edgeWeight));
        this.allEdges[this.allEdges.length] = new Edge(destination, source, edgeWeight);
    }

    //__Prims_MST__//
    prims() {
        var heap = new Heap(this.allEdges);
        
        var min = heap.peek();
        var k=min.u;
        var l=min.v;
        var minCost = min.edgeWeight;
        this.mst.push(min);
        this.minEdge = min;
        var near = [];

        //__Initialize__NEAR__//
        for(var i=0; i<this.nVertices; i++) {
            if(Edge.getEdgeWeight(this.allEdges, i, k)>Edge.getEdgeWeight(this.allEdges, i, l))
                near[i]=l;
            else
                near[i]=k;
        }
        near[k]=-1; near[l]=-1;

        for(var k=0; k<this.nVertices-2; k++) {
            // Find a vertex 'J' such that near[J]!=0 AND edge-cost of (J,near[J]) is minimum
            var j = Edge.findJ(near, this.allEdges, this);
            this.mst.push(new Edge(j, near[j], Edge.getEdgeWeight(this.allEdges, j, near[j])));
            minCost+=Edge.getEdgeWeight(this.allEdges, j, near[j]);
            near[j]=-1;
            //__UPDATE__NEAR__//
            for(var i=0; i<this.nVertices; i++) {
                if(near[i]!=-1 && Edge.getEdgeWeight(this.allEdges, i, near[i])>Edge.getEdgeWeight(this.allEdges, i, j))
                    near[i]=j
            }
        }

        console.log("Min Spanning with ",this.mst.length," edges, of weight ",minCost," can be formed which is:")
        console.log(this.mst);
    }
}
//--------------------------------------------end of Graph--------------------------------------------//

//-------------------------------------------Vertex BluePrint---------------------------------------//
class Vertex {
    c // co-ordinate of the vertx on the canvas..
    dist
    constructor(index) {
        this.index=index;
        this.dist=0;
    }
    static isVertexInVertexArray(vertex, vertexArray) {
        for(var i=0; i<vertexArray.length; i++) {
            if(vertex===vertexArray[i])
                return true;
        }
        return false;
    }
}

//-------------------------------------------Co-Ordinate BluePrint---------------------------------------//
class CoOrdinate {
    constructor(x, y) {
        this.x=x;
        this.y=y;
    }
}

//---------------------------------------------Min-Priority-Queue-------------------------------------------//
class Heap {
    index
    allEdges = []

    constructor(allEdges) {
        this.allEdges = allEdges;
        this.index=allEdges.length-1;
        this.heapify();
    }
    heapify() {
        var n=this.allEdges.length;
		for(var i=(n/2)-1; i>=0; i--)
	        this.adjust(i,n);
    }
    adjust(parent , n) {
        lchild = (2*parent)+1;
        rchild = (2*parent)+2;
        min = parent;
        if(lchild<n && this.allEdges[lchild].edgeWeight<this.allEdges[min].edgeWeight)
            min=lchild;
        if(rchild<n && this.allEdges[rchild].edgeWeight<this.allEdges[min].edgeWeight)
            min=rchild;
        if(min!=parent) {
            t = this.allEdges[min];
            this.allEdges[min] = this.allEdges[parent];
            this.allEdges[parent] = t;
            this.adjust(min, n);
        }
        var lchild, rchild, t, min;
    }
    reAdjust() {
        var t = allEdges[0];
        allEdges[0] = allEdges[this.index];
        allEdges[this.index] = t;
        this.adjust(0, this.index);
        this.index--;
    }
    getNext() {
        if(!this.isEmpty()) {
            var r = allEdges[0];
            this.reAdjust();
            return r;
        }
        return null;
    }
    peek() {
        return this.allEdges[0];
    }
    isEmpty() {
        return this.index<0;
    }
}
//---------------------------------------------end of heap-------------------------------------------//

//---------------------------------------MAIN class---------------------------------------//
// g = new Graph(8);
// g.addEdge(0,2,4); // 1 3 4
// g.addEdge(2,3,3); // 3 4 3
// g.addEdge(3,4,3); // 4 5 3
// g.addEdge(4,1,9); // 5 2 9
// g.addEdge(1,7,3); // 2 8 3
// g.addEdge(7,6,3); // 8 7 3
// g.addEdge(6,5,8); // 7 6 8
// g.addEdge(5,0,7); // 6 1 7
// g.addEdge(5,2,2); // 6 3 2
// g.addEdge(2,6,9); // 3 7 9
// g.addEdge(6,3,7); // 7 4 7
// g.addEdge(6,4,2); // 7 5 2
// g.addEdge(4,7,7); // 5 8 7

// g.prims();
// g.comparingEdgesSet.unshift(g.mst);
// includer()
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth/2;
canvas.height = window.innerHeight;
var cc = canvas.getContext('2d');
cc.fillStyle = 'black'
cc.fillRect(0, 0, canvas.width, canvas.height);



var canvas2 = document.getElementById('myCanvas2');
canvas2.width = window.innerWidth/3;
canvas2.height = window.innerHeight;
document.getElementById("myCanvas2").style.height = window.innerHeight;
var cc2 = canvas2.getContext('2d');
cc2.fillStyle = 'black'
cc2.fillRect(0, 0, canvas2.width, canvas2.height);
//----------------------------------------------------------------------//
function drawNew() {
    vertex = new Vertex(8);
    vertex.c = new CoOrdinate(25, 25)
    color = 'white'
    drawCircle(vertex.c.x , vertex.c.y,20, vertex.index, color);
    function drawCircle(x, y, radius, index, color) {
        var startAngle = 0;
        var endAngle = Math.PI*2;
        cc2.beginPath();
        cc2.fillStyle = color;
        cc2.arc(x, y, radius, startAngle, endAngle, true);
        cc2.fill();
        cc2.fill();
        cc2.fillStyle = 'black'; //708090
        cc2.font = "30px Arial";
        cc2.font = "bold 25px Courier New";
        cc2.fillText((index+1).toString(), x-7, parseInt(y)+5);
        cc2.beginPath();
    }
}

// drawNew();

//-------------------------Static_Drawing_functions---------------------//
class Draw {
    constructor() {
    }
    static drawVertices(color) {
        for(var i=0; i<g.nVertices; i++) {
            Draw.drawVertex(g.vertices[i], color);
        }
        cc.beginPath();
    }

    static drawVerticesSet(vertexSet, color) {
        for(var i=0; i<vertexSet.length; i++) {
            if(Vertex.isVertexInVertexArray(vertexSet[i], finalVertices))
                Draw.drawVertex(vertexSet[i], '#00BFFF');
            else
                Draw.drawVertex(vertexSet[i], color);
        }
        cc.beginPath();
    }

    static drawVertex(vertex, color) {
        drawCircle(vertex.c.x , vertex.c.y, g.vertexRadius, vertex.index, color);

        function drawCircle(x, y, radius, index, color) {
            var startAngle = 0;
            var endAngle = Math.PI*2;

            cc.beginPath();
            cc.fillStyle = color;
            cc.arc(x, y, radius, startAngle, endAngle, true);
            cc.fill();
            cc.fill();
            cc.fillStyle = 'black'; //708090
            cc.font = "30px Arial";
            cc.font = "bold 25px Courier New";
            cc.fillText((index+1).toString(), x-7, parseInt(y)+5);
            cc.beginPath();
        }
    }

    static drawEdges(color) {
        for(var i=0; i<g.allEdges.length; i++) {
            Draw.drawEdge(g.allEdges[i], color)
        }
    }

    static drawEdge(e, color) {
        drawLine(g.vertices[e.u].c.x, g.vertices[e.u].c.y,
                g.vertices[e.v].c.x, g.vertices[e.v].c.y, color);
        function drawLine(x1, y1, x2, y2, color) { // this function should only be accessed by drawEdge() function...
            cc.strokeStyle = color
            cc.moveTo(x1, y1);
            cc.lineTo(x2, y2);
            cc.stroke();
            cc.beginPath();
        }
        Draw.drawVertex(g.vertices[e.u], '#FFFAFA'); // D8BFD8
        Draw.drawVertex(g.vertices[e.v], '#FFFAFA');
    }
    static animateEdgeSet(edgeSet, edgeColor, verticesColor, isAllEdges) {
        vertexSet = [];
        var i=-1;
        function updateI() {
            return i++;
        }
        function animateAllEdges() {
            if(i<edgeSet.length-1) {
                updateI();
                if(Edge.isEdgeInEdgeArray(edgeSet[i],finalEdges)) {
                    edgeColor = '#FFD700';
                }
                animateEdge(edgeSet[i], edgeColor, verticesColor, !isAllEdges);
                requestAnimationFrame(animateAllEdges)
            }
            requestAnimationFrame(animateAllEdges)
        }
        animateAllEdges();
    }
}

//---------------------------------------------------------------//

//-------------------------Animate_Edge-------------------------//
var vertexSet = []
function animateEdge(edge, edgeColor, vertexColor, singleReq) {
    if(Edge.isEdgeInEdgeArray(edge, finalEdges)) {
        edgeColor = '#FFD700';
    }
    var x1 = parseFloat(g.vertices[edge.u].c.x), y1=parseFloat(g.vertices[edge.u].c.y);
    var x2 = parseFloat(g.vertices[edge.v].c.x), y2=parseFloat(g.vertices[edge.v].c.y);

    if(singleReq) {
        vertexSet.push(g.vertices[edge.u]);
        vertexSet.push(g.vertices[edge.v]);
    }
    // var x1=parseFloat(a), y1=parseFloat(b);
    // var x2=parseFloat(c), y2=parseFloat(d);

    var m=(y2-y1)/(x2-x1); // slope of line

    var x=x1, y=y1; // dont touch

    function update() {
        if(x1<x2)
            x+=4;
        else if(x1>x2)
            x-=4;
        y = setY(x, y);
    }

    function setY(x, y) {
        if(x1>x2 || x2>x1)
        return (m*(x-x1))+y1
        if(y1>y2)
            return y-=4;
        else return y+=4;
    }

    function clearLine(x1, y1, x2, y2) {
        cc.strokeStyle = 'white';
        cc.beginPath();
        cc.moveTo(x1, y1);
        cc.lineTo(x2, y2);
        cc.stroke();
        cc.beginPath();
    }

    function drawLine(x1, y1, x2, y2) {
        clearLine(x1, y1, x2, y2);
        cc.strokeStyle = edgeColor;
        cc.beginPath();
        cc.moveTo(x1, y1);
        cc.lineTo(x2, y2);
        cc.stroke();
        cc.stroke();
        cc.stroke();
        cc.beginPath();

        if(singleReq) {
            Draw.drawVerticesSet(vertexSet, vertexColor)
            Draw.drawVerticesSet(vertexSet, vertexColor)
        }
        else
            Draw.drawVertices(vertexColor)
    }

    function loop() {
        if(x1>x2) {
            if(y1>y2) {
                if(x>x2 || y>y2) {
                    var px=x, py=y;
                    update();
                    drawLine(x1, y1, x, y);
                    requestAnimationFrame(loop);
                }
            }
            else {
                if(x>x2 || y<y2) {
                    var px=x, py=y;
                    update();
                    drawLine(x1, y1, x, y);
                    requestAnimationFrame(loop);
                }
            }
        }
        else {
            if(y1>y2) {
                if(x<x2 || y>y2) {
                    var px=x, py=y;
                    update();
                    drawLine(x1, y1, x, y);
                    requestAnimationFrame(loop);
                }
            }
            else {
                if(x<x2 || y<y2) {
                    var px=x, py=y;
                    update();
                    drawLine(x1, y1, x, y);
                    requestAnimationFrame(loop);
                }
            }
        }
    }
    requestAnimationFrame(loop);
}
//---------------------------------------------End_of_animation_calls-----------------------------------------------//


/* --------------------------------------1.) printing the graph -------------------------------------------------------

--------------------------------------2.) highlight the initial min Edge found--------------------------------------
--------------- 2.1) add mst[0] to finalized edges
--------------- 2.2) animate mst[0]
--------------- 2.3) add vertices connected by mst[0] to finalized vertices


--------------------------------------3.) Including the second min edge--------------------------------------
--------------- 3.1) Highlight the comparingEdgeSet[1].....(green color)
--------------- 3.2) selecting the edge to add in red..
--------------- 3.3) add mst[i] to final edges..
--------------- 3.4) add vertices connected by mst[1] to final vertices..
--------------- 3.5) confirming mst[1] in gold..
--------------- 3.6) removing mst[1] from comparingEdgeSet[1]
--------------- 3.7) un-Highlighting the modified comparingEdgeSet[1]....(same as highlighting in gray) */
function halt(timer) {
    return new Promise((resolve, reject)=> {
        setTimeout(()=> {
            resolve('Halted')
        }, timer);
    });
}


function getIndexOfEdge(edge, edgeSet) {
    for(var i=0; i<edgeSet.length; i++) {
        if(edge.u===edgeSet[i].u && edge.v===edgeSet[i].v && edge.edgeWeight===edgeSet[i].edgeWeight) {
            return i
        }
    }
    return 0;
}

function modifyComparingEdgeSet(index) {
    var sh = getIndexOfEdge(g.mst[index], g.comparingEdgesSet[index]);
    var t = g.comparingEdgesSet[index][0];
    g.comparingEdgesSet[index][0] = g.comparingEdgesSet[1][sh];
    g.comparingEdgesSet[index][sh] = t;
    g.comparingEdgesSet[index].shift();
}
var finalEdges = []
var finalVertices = []
async function includer() {
    Draw.animateEdgeSet(g.allEdges, '#D3D3D3', '#FFFAFA', true)
    await halt(3000)
    finalEdges = [g.mst[0]]
    await halt(1000)
    animateEdge(g.mst[0], '#FFD700', '#00BFFF', true)
    await halt(1000)
    putConsoleWeight((g.mst[0].u)+1, (g.mst[0].v)+1, g.mst[0].edgeWeight, '#00BFFF')
    finalVertices = [g.vertices[g.minEdge.u], g.vertices[g.minEdge.v]]
    await halt(2000)
    for(var i=1; i<g.comparingEdgesSet.length; i++) {
        await halt(4000)
        Draw.animateEdgeSet(g.comparingEdgesSet[i], '#FF00FF', '#FF00FF', false)
        await halt(2000)
        vertexSet = []
        finalVertices.push(g.vertices[g.mst[i].u])
        finalVertices.push(g.vertices[g.mst[i].v])
        finalEdges = [...finalEdges, g.mst[i]]
        await halt(1500)
        animateEdge(g.mst[i], '#FFD700', '#00BFFF', true)
        await halt(1000)
        putConsoleWeight((g.mst[i].u)+1, (g.mst[i].v)+1, g.mst[i].edgeWeight, '#00BFFF');
        modifyComparingEdgeSet(i)
        await halt(2000)
        Draw.animateEdgeSet(g.comparingEdgesSet[i], '#D3D3D3', '#FFFAFA', false) // try to snap them away instead of animation...
    }
    await halt(4000)
}

//-----------------------------------console--------------------------------//
var g
async function fixVertices() {
    document.getElementById("setVertices").setAttribute("disabled", "")
    var n = document.getElementById('vertices')
    document.getElementById("vertices").setAttribute("disabled", "")
    g = new Graph(n.value)
    setDropdowns();
    await halt(1500)
    Draw.drawVertices('#D3D3D3')
}

function setDropdowns() {
    var n = document.getElementById('vertices').value;
    var select = document.getElementById("vertex-1")    
    for(var i=1; i<=n; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById("vertex-1").style.display = "inherit"

    var select = document.getElementById("vertex-2")    
    for(var i=1; i<=n; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById("vertex-2").style.display = "inherit"

    document.getElementById("edgeWeight").style.display = "inherit"

    document.getElementById("addEdge").style.display = "inherit"

    document.getElementById("prims").style.display = "inherit"
}

async function addEdgeFromConsole() {
    var vertex_1 = document.getElementById("vertex-1").value
    var vertex_2 = document.getElementById("vertex-2").value
    var weight = document.getElementById("edgeWeight").value
    document.getElementById("edgeWeight").value = ''
    g.addEdge(Number.parseInt(vertex_1)-1, Number.parseInt(vertex_2)-1, Number.parseInt(weight))
    animateEdge(new Edge(Number.parseInt(vertex_1)-1, Number.parseInt(vertex_2)-1, Number.parseInt(weight)), '#2F4F4F', '#D3D3D3', true)
    await halt(1500)
    putConsoleWeight(vertex_1, vertex_2, weight, '#B0C4DE');
}

async function consolePrims() {
    document.getElementById("vertex-1").setAttribute("disabled", "")
    document.getElementById("vertex-2").setAttribute("disabled", "")
    document.getElementById("addEdge").setAttribute("disabled", "")
    document.getElementById("prims").setAttribute("disabled", "")
    g.prims()
    g.comparingEdgesSet.unshift(g.mst)
    includer()
}

//------------extract edgeWriter and hilight accordingly------------//

function putConsoleWeight(vertex_1, vertex_2, weight, color) {
    if(vertex_1>vertex_2) {
        var t = vertex_1;
        vertex_1 = vertex_2;
        vertex_2 = t;
    }
    cx1 = Number.parseFloat(g.vertices[Number.parseInt(vertex_1)-1].c.x)
    cy1 = Number.parseFloat(g.vertices[Number.parseInt(vertex_1)-1].c.y)
    cx2 = Number.parseFloat(g.vertices[Number.parseInt(vertex_2)-1].c.x)
    cy2 = Number.parseFloat(g.vertices[Number.parseInt(vertex_2)-1].c.y)
    console.log(cx1, cx2, cy1, cy2)
    a = (cx2+cx1)/2
    b = (cy2+cy1)/2
    if(Number.parseInt(vertex_1)+Number.parseInt(g.nVertices/2)==vertex_2 || Number.parseInt(vertex_2)+Number.parseInt(g.nVertices/2)==vertex_1) {
        a = ((4*cx2)+(2*cx1))/6
        b = ((4*cy2)+(2*cy1))/6
        console.log('yes')
    }
    cn = new CoOrdinate(a.toFixed(2), b.toFixed(2))
    cc.fillStyle = color;
    cc.font = "italic 18px Arial"
    cc.fillText(weight.toString(), cn.x-3, cn.y-3)
    cc.beginPath()
}
