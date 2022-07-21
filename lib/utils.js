export const importAll=(r)=> {
    let files = [];
    let keys = r.keys()
    keys.slice(0,keys.length/2).map((item, index) => { 
      files[index] = r(item); 
    });
    return files;
  }


// export const importAllToObject=(r)=> {
//     let files = {};
//     r.keys().map((item, index) => { files[item.replace('./', '')] = r(item); });
//     return files;
//   }