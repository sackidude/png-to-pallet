const fs = require("fs");
const PNG = require('png-js')

const data = {}
const shouldWrite = true; // This is for debugging

let asyncPrompt = (_question) => {
    return new Promise((resolve, reject) => {
        let stdin = process.stdin,
            stdout = process.stdout;

        stdin.resume();
        stdout.write(_question);

        stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });

    });
}

asyncPrompt("Name: ").then(answer => {
    data.name = answer;
    return asyncPrompt("Comments: ");
}).then(answer => {
    data.comments = answer;
    return asyncPrompt("Editable(true/false): ");
}).then(answer => {
    if (answer == "true") {
        data.editable = true;
    } else {
        data.editable = false;
    }

    return asyncPrompt("File(in current directory): ");
}).then((file => {
    PNG.decode(`./${file}`, function (pixels) {
        let colors = []
        let color = [0, 0, 0]
        for (let i = 0; i < pixels.length; i++) {
            if (i % 4 === 0) {
                color[0] = pixels[i]
            } else if (i % 4 === 1) {
                color[1] = pixels[i]
            } else if (i % 4 === 2) {
                color[2] = pixels[i]
                if (colors.length === 0) {
                    colors.push(color);
                } else {
                    let j = 0;
                    while (j < colors.length) {
                        if (JSON.stringify(color) === JSON.stringify(colors[j])) {
                            j = colors.length - 1;

                        } else if (j === colors.length - 1) {
                            colors.push(color);
                        }
                        j++;
                    }
                }
                color = [0, 0, 0];
            }
            // it has alpha but i am not using it
        }
        objArr = []
        for (let i = 0; i < colors.length; i++) {
            let currData = rgbToHex(colors[i][0], colors[i][1], colors[i][2])
            objArr.push({
                data: currData,
                name: "no name"
            })
        }
        data.colors = objArr;
        if (shouldWrite) {
            fs.writeFile(`./${data.name}.json`, JSON.stringify(data), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
                process.exit();
            });
        } else {
            console.log("Nothing saved!(change the constant shouldWrite in the top of the file)");
            process.exit();
        }

    });


}));

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}