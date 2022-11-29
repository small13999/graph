class Node {
    constructor(x, y, v, next) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.next = next;
        this.color = "white";
    }
}

class E1 {
    constructor(v, next) {
        this.v = v;
        this.next = next;
    }
}

class Queue {
    #arr = [];

    add(item) {
        this.#arr.push(item);
    }

    remove() {
        return this.#arr.splice(0, 1)[0];
    }

    isEmpty() {
        return this.#arr.length == 0;
    }
}

class Stack {
    #arr = [];

    add(item) {
        this.#arr.push(item);
    }

    pop() {
        return this.#arr.splice(this.#arr.length-1, 1)[0];
    }

    top() {
        return this.#arr[this.#arr.length-1];
    }

    isEmpty() {
        return this.#arr.length == 0;
    }
}

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let graph = [];

let flexibleGraph = false;
document.querySelector("#flexible-graph").addEventListener('change', function() {
    if (this.checked) flexibleGraph = true;
    else flexibleGraph = false;
});

document.querySelector("#newgraph").addEventListener('click', () => {
    let size = document.querySelector("#newgraphsize").value;
    if (size == "") return;
    size = parseInt(size);

    graph = ALGraph(size);
});

document.querySelector("#newnode").addEventListener('click', addNode);
document.querySelector("#connect").addEventListener('click', () => {
    let node1index = document.querySelector("#connect1").value;
    let node2index = document.querySelector("#connect2").value;
    connectNodes(graph[node1index], graph[node2index]);
});

document.querySelector("#bfs").addEventListener('click', () => {
    let from = document.querySelector("#searchfrom").value;
    let to = document.querySelector("#searchto").value;
    BFS(graph, parseInt(from), parseInt(to));
});

document.querySelector("#dfs").addEventListener('click', () => {
    let from = document.querySelector("#searchfrom").value;
    let to = document.querySelector("#searchto").value;
    DFS(graph, parseInt(from), parseInt(to));
});


const r = 30;
let mouseDown = false;
let nodeOnCursor = undefined;

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
    let x = event.offsetX;
    let y = event.offsetY;

    nodeOnCursor = graph.find(node => Math.sqrt(Math.pow(x-node.x, 2) + Math.pow(y - node.y, 2)) <= r + 10);
});

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false;
    nodeOnCursor = undefined;
});

canvas.addEventListener('mousemove', (event) => {
    if (mouseDown && (nodeOnCursor != undefined)) {
    nodeOnCursor.x = event.offsetX;
    nodeOnCursor.y = event.offsetY;
    }
});

function addNode() {
    let same, x, y;
    do {
        same = false;
        x = Math.floor(Math.random()*7+1)*100;
        y = Math.floor(Math.random()*7+1)*100;
        graph.forEach(node => {if (x == node.x && y == node.y) same = true;});
    } while (same);
    graph.push(new Node(x, y, graph.length, new E1()));
    console.log("asd");
}

function connectNodes(node1, node2) {
    if (node1 == node2 || node1 == undefined || node2 == undefined) return;
    let current = node2.next;
    while (current.v != undefined) {
        if (current.v == node1.v) return;

        current = current.next;
    }
    let e = new E1(node1.v, node2.next);
    node2.next = e;
    e = new E1(node2.v, node1.next);
    node1.next = e;
}

function ALGraph(n) {
    if (n >=50) n=49;
    if (n <=1) return [];
    let graph = [];
    for (let i = 0; i<n; i++) {
        let same = false;
        let x;
        let y;
        do {
            same = false;
            x = Math.floor(Math.random()*7+1)*100;
            y = Math.floor(Math.random()*7+1)*100;
            graph.forEach(node => {if (x == node.x && y == node.y) same = true;});
        } while (same);
        let v = i;
        let next;

        let e = Math.floor(Math.random()*2+1);
        let current;
        for (let j = 0; j<e; j++) {
            let rand;
            do {
                rand = Math.floor(Math.random()*n);
            } while (rand == i);

            if (j == 0) {
                next = new E1(rand, new E1());
                current = next;
                continue;
            }
            current.next = new E1(rand, new E1());
            current = current.next;
        }
        graph.push(new Node(x, y, v, next));
    }

    graph.forEach(node => {
        let current = node.next;
        while (current.v != undefined) {
            let searchedNode = graph[current.v].next;
            let connected = false;
            while (searchedNode.v != undefined) {
                if (searchedNode.v == node.v) {
                    connected = true;
                    break;
                }
                searchedNode = searchedNode.next;
            }
            if (!connected) {
                let e = new E1(node.v, graph[current.v].next);
                graph[current.v].next = e;
            }

            current = current.next;
        }
    });

    return graph;
}

async function BFS(graph, s, to) {
    if (s < 0 || to < 0 || s >= graph.length || to >= graph.length) return;

    graph.forEach(node => node.color = "white");
    let pi = [];
    let d = [];

    for (let u = 0; u<graph.length; u++) {
        d.push(-1);
        pi.push(-1);
    }

    d[s] = 0;
    graph[s].color = "yellow";
    await new Promise(r => setTimeout(r, 1000));

    let q = new Queue();
    q.add(s);

    while (!q.isEmpty()) {
        let u = q.remove();
        let p = graph[u].next;
        while (p != undefined) {
            v = p.v;
            if (d[v] == -1) {
                d[v] = d[u] + 1;
                pi[v] = u;
                graph[v].color = "yellow";
                q.add(v);

                await new Promise(r => setTimeout(r, 1000));
            }
            p = p.next;
        }
        graph[u].color = "green";
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(BFSPath(pi, s, to));
}

async function DFS(graph, s, to) {
    graph.forEach(node => node.color = "white");

    let pi = [];

    for (let u = 0; u<graph.length; u++) {
        pi.push(-1);
    }

    graph[s].color = "yellow";
    await new Promise(r => setTimeout(r, 1000));

    let q = new Stack();
    q.add(s);

    while (!q.isEmpty()) {
        let u = q.pop();
        let p = graph[u].next;
        while (p.v != undefined) {
            v = p.v;
            if (graph[v].color == "white") {
                pi[v] = u;
                graph[v].color = "yellow";
                q.add(v);
                await new Promise(r => setTimeout(r, 1000));
            }
            p = p.next;
        }
        graph[u].color = "green";
        await new Promise(r => setTimeout(r, 1000));
    }

    DFVisit(graph, s, pi);

    console.log(BFSPath(pi, s, to));

}

function DFVisit(graph, u, pi) {
    /* RECURSIVE
    graph[u].color = "yellow";

    let p = graph[u].next;
    while (p.v != undefined) {
        if (graph[p.v].color == "white") {
            pi[p.v] = u;
            console.log("visiting: " + p.v);
            DFVisit(graph, p.v, pi);
        }
        p = p.next;
    }
    graph[u].color = "green";
    */ 
}

function BFSPath(pi, s, u) {
    if (u == s) return s;
    if (pi[u] == -1) return "No path";

    let v = new Stack();
    v.add(u);
    let i = u;

    while (i != s) {
        i = pi[i];
        v.add(i);
    }

    let ret = "";
    while (!v.isEmpty()) {
        ret += v.top() + " ";
        v.pop();
    }
    return ret;
}

function drawGraph(graph) {
    graph.forEach(node => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 6.28);
        ctx.stroke();
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(node.v, node.x-8, node.y+10);

        let p = node.next;
        while (p.v != undefined) {
            let dx = graph[p.v].x - node.x;
            let dy = graph[p.v].y - node.y;
            let length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            ctx.beginPath();
            ctx.moveTo(node.x + dx/length*r, node.y + dy/length*r);
            ctx.lineTo(graph[p.v].x - dx/length*r, graph[p.v].y - dy/length*r);
            ctx.stroke();
            p = p.next;
        }
    });
}

function draw() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGraph(graph);

    if (flexibleGraph) update();

    window.requestAnimationFrame(draw);
}

function distance(node1, node2) {
    return Math.sqrt(Math.pow(node1.x-node2.x, 2) + Math.pow(node1.y-node2.y, 2));
}

function update() {
    graph.forEach(node => {
        let current = node.next;
        while (graph[current.v] != undefined && graph[current.v] != nodeOnCursor) {
            if (distance(node, graph[current.v]) > 300) {
                let vx = node.x - graph[current.v].x;
                let vy = node.y - graph[current.v].y
    
                graph[current.v].x += vx/50;
                graph[current.v].y += vy/50;
            }
            current = current.next;
        }
    });
}

graph = ALGraph(8);

draw();