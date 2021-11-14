class Game {
    constructor() {
        this.mat = new BABYLON.StandardMaterial("snake");
        //this.mat.specularColor = new BABYLON.Color3(0.02, 0.56, 0.92);
        this.mat.specularColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        this.mat.diffuseColor = this.mat.specularColor;

        this.mat.backFaceCulling = false;

        this.deadMat = new BABYLON.StandardMaterial("dead");
        this.deadMat.specularColor = new BABYLON.Color3(0.92, 0.27, 0.19);
        this.deadMat.diffuseColor = new BABYLON.Color3(0.92, 0.27, 0.19);
        this.deadMat.backFaceCulling = false;

        this.init();
    }

    init() {
        this.addSnake();
        this.apples = [];
        this.cubes = [];
        this.addApple();
        this.updateCubes(500);
        this.dead = false;
        this.direction = [0, 1];
    }

    addSnake() {
        this.snake = [[0, 0], [0, 1]];

        this.tail = BABYLON.MeshBuilder.CreateBox("box", {});
        this.head = BABYLON.MeshBuilder.CreateBox("box", {});

        this.tail.position = new BABYLON.Vector3(0, 0.5, 0);
        this.tail.material = this.mat;
        this.head.position = new BABYLON.Vector3(0, 0.5, 1);
        this.head.material = this.mat;
    }

    addApple() {
        var apple = [];
        apple.push(Math.floor(Math.random() * 16) - 8);
        apple.push(Math.floor(Math.random() * 16) - 8);
        for (var part in this.snake) {
            if (this.snake[part][0] == apple[0] && this.snake[part][1] == apple[1]) {
                this.addApple();
                return;
            }
        }
        this.apples.push(apple);
    }

    updateCubes(time)
    {
        for(let index in this.snake) {
            if (index != this.snake.length -1) {
                let part = this.snake[index];

                if (!this.cubes[index]) {
                    this.cubes.push(BABYLON.MeshBuilder.CreateBox("box", {}));
                    this.cubes[this.cubes.length - 1].material = this.mat;
                }

                if (this.dead) {
                    this.cubes[index].material = this.deadMat;
                }

                let cube = this.cubes[index];
                cube.position.x = part[0];
                cube.position.y = 0.2;
                cube.position.z = part[1];
            }
        }

        if (this.dead) {
            this.head.material = this.deadMat;
            this.tail.material = this.deadMat;
        } else {
            moveMesh(this.head, new BABYLON.Vector3(this.snake[this.snake.length - 1][0], 0.2, this.snake[this.snake.length - 1][1]), time);
            moveMesh(this.tail, new BABYLON.Vector3(this.snake[0][0], 0.2, this.snake[0][1]), time);
        }
    }

    turn(direction) {
        if (direction == "w" || direction == "ArrowUp")
            this.direction = [0, 1];
        if (direction == "a" || direction == "ArrowLeft")
            this.direction = [-1, 0];
        if (direction == "s" || direction == "ArrowDown")
            this.direction = [0, -1];
        if (direction == "d" || direction == "ArrowRight")
            this.direction = [1, 0]
    }

    updateSnake() {
        if (this.dead) return;
        this.snake.push([this.snake[this.snake.length - 1][0] + this.direction[0], this.snake[this.snake.length - 1][1] + this.direction[1]]);
        if (!this.checkApple()) this.snake.splice(0, 1);
        if (this.checkDeath()) {
            this.dead = true;
        }
    }

    checkApple() {
        for (var index in this.apples) {
            var apple = this.apples[index];
            if (apple[0] == this.snake[this.snake.length - 1][0] && apple[1] == this.snake[this.snake.length - 1][1]) {
                apple.push(Math.floor(Math.random() * 16) - 8);
                this.apples.splice(index, 1);
                this.addApple();
                return true;
            }
        }

        return false;
    }

    checkDeath() {
        if (this.snake[this.snake.length - 1][0] < -8 || this.snake[this.snake.length - 1][0] > 8) return true;
        if (this.snake[this.snake.length - 1][1] < -8 || this.snake[this.snake.length - 1][1] > 8) return true;

        var x = this.snake[this.snake.length - 1][0];
        var y = this.snake[this.snake.length - 1][1];

        for (var i = 0; i < this.snake.length - 1; i++) {
            if (this.snake[i][0] == x && this.snake[i][1] == y) {
                return true;
            }
        }

        return false;
    }

    update() {
        this.updateSnake();
    }
}

BABYLON.FollowCamera.prototype.spinTo = function(targetVal) {
    BABYLON.Animation.CreateAndStartAnimation("at4", this, "target", 60, 30, this["target"], targetVal, 0);
}

BABYLON.FollowCamera.prototype.smoothMove = function(targetVal, time) {
    BABYLON.Animation.CreateAndStartAnimation("at4", this, "position", 60, Math.floor(60 / (1000 / time)), this["position"], targetVal, 0);
}

function moveMesh(mesh, targetVal, time) {
    BABYLON.Animation.CreateAndStartAnimation("at4", mesh, "position", 60, Math.floor(60 / (1000 / time)), mesh["position"], targetVal, 0);
}

class Render {
    constructor(engine) {
        this.time = 500;

        this.scene = new BABYLON.Scene(engine);
        this.scene.clearColor = new BABYLON.Color3(0.29, 0.61, 0.74);

        this.camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(0, 3, 0));
        this.camera.setTarget(new BABYLON.Vector3(0, 0, 10));
        this.camera.attachControl(canvas, true);

        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0));
        this.light.intensity = 1;

        var gmat1 = new BABYLON.StandardMaterial("gmat1");
        gmat1.diffuseColor = new BABYLON.Color3(0.56, 0.80, 0.22);
        gmat1.specularColor = new BABYLON.Color3(0, 0, 0);


        var gmat2 = new BABYLON.StandardMaterial("gmat2");
        gmat2.diffuseColor = new BABYLON.Color3(0.65, 0.85, 0.28);
        gmat2.specularColor = new BABYLON.Color3(0, 0, 0);

        var multimat = new BABYLON.MultiMaterial("multi", this.scene);
        multimat.subMaterials.push(gmat1);
        multimat.subMaterials.push(gmat2);

        var grid = {
            'h': 17,
            'w': 17
        }

        this.ground = new BABYLON.MeshBuilder.CreateTiledGround("ground", {xmin: -8.5, zmin: -8.5, xmax: 8.5, zmax: 8.5, subdivisions: grid});

        const verticesCount = this.ground.getTotalVertices();
        const tileIndicesLength = this.ground.getIndices().length / (grid.w * grid.h);

        this.ground.subMeshes = [];
        let base = 0;
        for (let row = 0; row < grid.h; row++) {
            for (let col = 0; col < grid.w; col++) {
                this.ground.subMeshes.push(new BABYLON.SubMesh(row%2 ^ col%2, 0, verticesCount, base, tileIndicesLength, this.ground));
                base += tileIndicesLength;
            }
        }

        this.ground.material = multimat;

        BABYLON.SceneLoader.ImportMesh("", "./", "apple.obj", this.scene, result => {
            this.apples = result;

            for (var item in result) {
                result[item].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
                result[item].rotation.y = 90;
            }
        })

        this.game = new Game();
    }

    async update() {
        if (this.snake != undefined) this.snake.dispose();
        this.game.update();

        for (var index in this.apples) {
            var apple = this.game.apples[0];
            this.apples[index].position = new BABYLON.Vector3(apple[0], 0.2, apple[1]);
        }

        this.game.updateCubes(this.time);

        var i = this.game.snake.length - 1;
        var pos = new BABYLON.Vector3(this.game.snake[i][0], 12, this.game.snake[i][1] - 4);
        this.camera.smoothMove(pos, this.time);
        // var poly_tri = new BABYLON.PolygonMeshBuilder("polytri", this.genPoints());
        // this.snake = poly_tri.build(false, 1);
        // this.snake.position.y = 1;
        // this.snake.material = this.mat;
    }
}

var menu = document.getElementById("menu");
var backbtn = document.getElementById("back");

var canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var engine = new BABYLON.Engine(canvas, true);
var render = new Render(engine);

document.body.addEventListener("keydown", ev => {
    render.game.turn(ev.key);
})

engine.runRenderLoop(() => {
    render.scene.render();
});

var frame = -1;

function update() {
    if (frame == 0) {
        let i = render.game.snake.length - 1;
        render.camera.spinTo(new BABYLON.Vector3(render.game.snake[i][0], 0, render.game.snake[i][1]));
    }
    if (frame >= 0) {
        render.update();
        frame++;
    }

    var nextTime = 500 - render.game.snake.length * 10;
    if (nextTime < 50) nextTime = 50;

    render.time = nextTime;

    var normalscore = document.getElementById("normalscore");
    normalscore.innerText = "Score: " + render.game.snake.length;

    if (!localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", render.game.snake.length);
    }
    if (render.game.snake.length > localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", render.game.snake.length);
    }

    var highscore = document.getElementById("highscore");
    highscore.innerText = "Highscore: " + localStorage.getItem("highscore");

    setTimeout(() => {
        update();
    }, nextTime)
}

update();

document.addEventListener("fullscreenchange", ev => {
    if (frame != -1) {
        frame = -1;
        menu.style.display = "flex";
    } else {
        frame = 0;
    }
})

backbtn.addEventListener("click", () => {
    menu.style.display = "none";
    document.body.requestFullscreen();
    canvas.focus();
})

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize();
})