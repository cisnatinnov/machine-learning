// Arithmetic

const mean = (numbers = []) => {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total / numbers.length;
}

const median = (numbers = []) => {
  const { length } = numbers;
  
  numbers.sort();
  
  if (length % 2 === 0) {
    return (numbers[length / 2 - 1] + numbers[length / 2]) / 2;
  }
  
  return numbers[(length - 1) / 2];
}

const mode = (numbers = []) => {
  const mode = {};
  let max = 0, count = 0;

  for(let i = 0; i < numbers.length; i++) {
    const item = numbers[i];
    
    if(mode[item]) {
      mode[item]++;
    } else {
      mode[item] = 1;
    }
    
    if(count < mode[item]) {
      max = item;
      count = mode[item];
    }
  }
   
  return max;
};

// Sorting

const range = (numbers = []) => {
  numbers.sort();
  
  return [numbers[0], numbers[numbers.length - 1]];
};

const sort = (numbers = []) => {
  numbers.sort();
  
  return numbers;
};

const max = (numbers = []) => {
  Array.prototype.max = () => {
    return Math.max.apply(null, this);
  };
  return numbers.max();
}

const min = (numbers = []) => {
  Array.prototype.min = () => {
    return Math.min.apply(null, this);
  };
  return numbers.min();
}

//

const quadratic = (a, b, c) => {
  // program to solve quadratic equation
  let root1, root2;

  // calculate discriminant
  let discriminant = b * b - 4 * a * c;

  // condition for real and different roots
  if (discriminant > 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  }
  // condition for real and equal roots
  else if (discriminant == 0) root1 = root2 = -b / (2 * a);
  // if roots are not real
  else {
    let realPart = (-b / (2 * a)).toFixed(2);
    let imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);

    return `The roots of quadratic equation are ${realPart} + ${imagPart}i and ${realPart} - ${imagPart}i`
  }
  let x1 = root1 % 1 != 0 ? root1.toFixed(2) : root1
  let x2 = root2 % 1 != 0 ? root2.toFixed(2) : root2
  return { x1: x1, x2: x2 }
}

// Geometry

// 2d

const rectangle = (l, b) => {
  let area = l*b
  let perimeter = 2*(l+b)

  return { area: area, perimeter: perimeter }
}

const square = (a) => {
  let area = a*a
  let perimeter = 4*a

  return { area: area, perimeter: perimeter }
}

const triangle = (b, h) => {
  let area = 1/2*b*h

  return { area: area }
}

const trapezoid = (b1, b2, h) => {
  let area = 1/2*(b1+b2)*h

  return { area: area }
}

const circle = (r) => {
  let area = 3.14*r*r
  let perimeter = 2*3.14*r

  return { area: area, perimeter: perimeter }
}

const ellipse = (a, b) => {
  let area = 3.14*a*b

  return { area: area }
}

// 3d

const cube = (a) => {
  let volume = a*a*a
  let curvedSurfaceArea = 4*(a*a)
  let totalSurfaceArea = 6*(a*a)

  return { volume: volume, curvedSurfaceArea: curvedSurfaceArea, totalSurfaceArea: totalSurfaceArea }
}

const cylinder = (r, h) => {
  let volume = 3.14*(r*r)*h
  let curvedSurfaceArea = 2*3.14*r*h
  let totalSurfaceArea = 2*3.14*r*(r+h)

  return { volume: volume, curvedSurfaceArea: curvedSurfaceArea, totalSurfaceArea: totalSurfaceArea }
}

const cuboid = (l, b, h) => {
  let volume = l*b*h
  let curvedSurfaceArea = 2*h*(l+b)
  let totalSurfaceArea = 2(l*b+b*h+h*l)

  return { volume: volume, curvedSurfaceArea: curvedSurfaceArea, totalSurfaceArea: totalSurfaceArea }
}

const convertToSeconds = (hour) => {
  return hour * 3600
}

const convertToMinutes = (hour) => {
  return hour * 60
}

const convertToHour = (hour) => {
  hour = Number(hour);
  var h = Math.floor(hour / 3600);
  var m = Math.floor(hour % 3600 / 60);
  var s = Math.floor(hour % 3600 % 60);

  var hDisplay = h > 0 ? `${h}${(h == 1 ? " hour" : " hours")}` : "";
  var mDisplay = m > 0 ? `, ${m}${(m == 1 ? " minute" : " minutes")}` : "";
  var sDisplay = s > 0 ? `, ${s}${(s == 1 ? " second" : " seconds")}` : "";
  return hDisplay + mDisplay + sDisplay;
}

module.exports = {
  mean, // Arithmetic
  median,
  mode,
  range, // Sorting
  sort,
  max,
  min,
  quadratic, //
  rectangle, // 2d
  square,
  triangle,
  trapezoid,
  circle,
  ellipse,
  cube, // 3d
  cylinder,
  cuboid,
  convertToSeconds,
  convertToMinutes,
  convertToHour
}