export const importAll = (r) => {
  let files = [];
  let keys = r.keys();
  keys.slice(0, keys.length / 2).map((item, index) => {
    files[index] = r(item);
  });
  return files;
};

export const savePng = async (currDesign, alert) => {
  const dataURL = await getCanvasImgData(currDesign, alert);
  const blob = await fetch(dataURL).then((r) => r.blob());
  console.log(blob);
  saveAs(blob, currDesign.text + ".png");
};

export const fillArray = (length, value) => {
  return new Array(length).fill(value);
};

export const getCanvasImgData = async (currDesign, alert) => {
  let canvas = document.getElementsByTagName("canvas");
  canvas = canvas[canvas.length - 1];
  const canvas2d = document.createElement("canvas");
  var context = canvas2d.getContext("2d");
  canvas2d.width = canvas.width;
  canvas2d.height = canvas.height;
  context.font = "12px Rubik";
  context.fillRect(0, 0, canvas2d.width, canvas2d.height);
  context.fillStyle = "white";
  const imObjFunction = () => {
    return new Promise((resolve) => {
      var imageObj = new Image();
      imageObj.onload = function () {
        context.drawImage(imageObj, 0, 0);
        context.fillText(`Width: ${currDesign.length}mm`, 20, 20);
        context.fillText(`Thickness: ${currDesign.thickness}mm`, 120, 20);
        context.fillText(`Stone Size: ${currDesign.stoneSize}mm`, 220, 20);
        context.fillText(`Base: ${currDesign.base}`, 320, 20);
        context.fillText(`No. of Bails: ${currDesign.bails.length}`, 420, 20);
        context.fillText(`Stone Size: ${currDesign.stoneSize}`, 520, 20);
        resolve(true);
      };
      imageObj.src = canvas.toDataURL("image/png");
    });
  };
  const isDrawn = await imObjFunction();
  // document.body.appendChild(canvas2d)
  if (isDrawn) return canvas2d.toDataURL("image/png");

  canvas2d.remove();
  alert.error("An Error Occurred!");
};

export const getOccurences = (array,target) => {
  let counter = 0;
  for (let val of array) {
    if (val.type === target) {
      counter++;
    }
  }
  return counter
};

// export const importAllToObject=(r)=> {
//     let files = {};
//     r.keys().map((item, index) => { files[item.replace('./', '')] = r(item); });
//     return files;
//   }
