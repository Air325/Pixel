function get_result_from_cookie() {
    let cookies = document.cookie.split("; ")
    for (let i=0; i<cookies.length; i+=1) {
        let cookie = cookies[i].split("=")
        console.log(cookie)
        if (cookie[0] == "pixel-result") {
            return cookie[1]
        }
    }
    return "0" * 450
}

var CURRENT_COLOR = "rgb(199, 47, 30)";
var DEFAULT_COLOR = "rgb(62, 62, 62)";
var IS_CLICKED = false;
var FILL_MODE = false;

var COLOR_MAP = {
    "red": "rgb(199, 47, 30)",
    "green": "rgb(67, 199, 30)",
    "yellow": "rgb(237, 215, 12)",
    "blue": "rgb(15, 42, 217)",
    "purple": "rgb(190, 15, 217)"
};

var COLORS = [
    "rgb(62, 62, 62)",
    "rgb(199, 47, 30)",
    "rgb(67, 199, 30)",
    "rgb(237, 215, 12)",
    "rgb(15, 42, 217)",
    "rgb(190, 15, 217)"
];

document.addEventListener("mousedown", function() {
    IS_CLICKED = true;
});

document.addEventListener("mouseup", function() {
    IS_CLICKED = false;
});

let field = document.querySelector(".field")

let temp_result = get_result_from_cookie()
if (temp_result != "0") {
    for (let i=0; i<450; i+=1) {
        let cell = document.createElement("div")
        cell.classList.add("cell")
        cell.setAttribute("id", `${i}`)
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
        field.appendChild(cell)
    }
}
    else {
        for (let i=0; i<450; i+=1) {
            let cell = document.createElement("div")
            cell.classList.add("cell")
            cell.setAttribute("id", `${i}`)
            field.appendChild(cell)
        }   
    }

let cells = document.querySelectorAll(".cell")
for (let i=0; i<cells.length; i++) {
    let cell = cells[i];

    cell.addEventListener("click", function() {
        cell.style.backgroundColor = CURRENT_COLOR;
    })

    cell.addEventListener("mouseover", function() {
        if (IS_CLICKED) {
            cell.style.backgroundColor = CURRENT_COLOR;
        }
    })

    cell.addEventListener("mousedown", function() {
        if (FILL_MODE) {
            let cell_id = parseInt(cell.getAttribute("id"));

            anime ({
                targets: ".cell",
                backgroundColor: CURRENT_COLOR,
                easing: "easeInOutQuad",
                duration: 500,
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
            });

            setTimeout(() => {
                for (let j=0; j < cells.length; j++) {
                    cells[j].style.backgroundColor = CURRENT_COLOR;
                }
            }, 1000);

        } else {
            cell.style.backgroundColor = CURRENT_COLOR;
        }
    })
}

let color_cells = document.querySelectorAll(".color-cell")
for (let i=0; i < color_cells.length; i++) {
    let color_cell = color_cells[i]
    color_cell.addEventListener("click", function() {
        let colorClass = ""; 
        if (color_cell.classList.contains("red")) colorClass = "red";
        else if (color_cell.classList.contains("green")) colorClass = "green";
        else if (color_cell.classList.contains("yellow")) colorClass = "yellow";
        else if (color_cell.classList.contains("blue")) colorClass = "blue";
        else if (color_cell.classList.contains("purple")) colorClass = "purple";

        CURRENT_COLOR = COLOR_MAP[colorClass];
        FILL_MODE = false;

        document.querySelector(".selected").classList.remove("selected")
        color_cell.classList.add("selected")
    })
}

document.querySelector(".eraser").addEventListener("click", function() {
    CURRENT_COLOR = DEFAULT_COLOR;
    FILL_MODE = false;

    document.querySelector(".selected").classList.remove("selected")

    this.classList.add("selected")
})

document.querySelector(".fill-tool").addEventListener("click", function() {
    FILL_MODE = true;

    document.querySelector(".selected").classList.remove("selected")
    this.classList.add("selected")
})

setInterval(function() {
    let result = "";
    let temp_cells = document.querySelectorAll(".cell")

    for (let i=0; i<temp_cells.legth; i+=1) {
        let cell = temp_cells[i];
        let color = cell.style.backgroundColor;

        let colorIndex = "0";
        for (let j=0; j<COLORS.length; j++) {
            if (color === COLORS[j]) {
                colorIndex = j.toString();
                break;
            }
        }

        result += colorIndex;
    }
    document.cookie = `pixel-result=${result}; max-age=100000`;
}, 60000);

document.querySelector(".btnimage").addEventListener("click", function() {
    domtoimage.toJpeg(field, { quality: 2 })
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
    });
})
