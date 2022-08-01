  // will compare value with given boundaries
  export const compareVal = (val, min, max) => {
    if (val >= min && val <= max) return val;
    if (val > max) return max;
    if (val < min) return min;
  };


  // will delay function execution by given timeout
  export  const delay = (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    };