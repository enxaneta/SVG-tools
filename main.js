//--------------Get the array of the svg commands---------

function formatedArgsArray(d) {
  //takes care of long commands
  /*The command letter can be eliminated on subsequent commands if the same command is used multiple times in a row (e.g., you can drop the second "L" in "M 100 200 L 200 100 L -100 -200" and use "M 100 200 L 200 100 -100 -200" instead).*/
  let ArgsRy = getArgsRys(d);
  let newArgsArray = [];
  ArgsRy.map((a, index) => {
    let prefix = a[0];
    let UCprefix = prefix.toUpperCase();

    let n, tempRy;
    if (UCprefix == "H" || UCprefix == "V") {
      n = 1;
    }
    if (UCprefix == "L" || UCprefix == "T" || UCprefix == "M") {
      n = 2;
    }
    if (UCprefix == "S" || UCprefix == "Q") {
      n = 4;
    }
    if (UCprefix == "C") {
      n = 6;
    }
    if (UCprefix == "A") {
      n = 7;
    }
    if (a.length > n + 1) {
      //if the length of the array a is longer than it should be
      tempRy = a.splice(1);
      //long_Absolute_command returns an array of arrays
      let newTempsArray = long_Absolute_command(tempRy, n, prefix);
      ArgsRy[index] = newTempsArray;
    }
  });

  ArgsRy.map(a => {
    if (Array.isArray(a[0])) {
      //if it's an array of arrays
      a.map(_a => {
        newArgsArray.push(_a);
      });
    } else {
      newArgsArray.push(a);
    }
  });

  return newArgsArray;
}

function long_Absolute_command(tempRy, n, prefix) {
  /* This function is splitting a long command like this:  ["L", 160", "160.622", "90", "160.622", "55", "100", "90", "39.378", "160", "39.378", "195", "100"] in several L commands: */
  //tempRy = ["160", "160.622", "90", "160.622", "55", "100", "90", "39.378", "160", "39.378", "195", "100"]
  //prefix = "L"
  //n = 2 (After the L comes 2 coords: x and y)

  let CommandsRy = [];

  while (tempRy.length > 0) {
    CommandsRy.push(tempRy.splice(0, n));
  }

  CommandsRy.forEach(c => {
    c = c.unshift(prefix);
  });

  // CommandsRy = [["L", "160", "160.622"],["L", "90", "160.622"],["L", "55", "100"],["L", "90", "39.378"],["L", "160", "39.378"],["L", "195", "100"]]

  return CommandsRy;
}

function getArgs(d) {
  //remove breaklines and tabs and spaces
  let _d = d.replace(/\r?\n|\r|\t|  +/g, "");

  let argsRX = /(?=[a-zA-Z])/;
  let args = _d.split(argsRX);

  return args;
}

function getArgsRys(d) {
  let args = getArgs(d);

  let ArgsRy = [];
  for (let i = 0; i < args.length; i++) {
    let values = args[i]
      .slice(1)// remove the letter command
      .replace(/\-/g, " -")// add a space in front of a - (minus)
      .split(/[ ,]+/);//split by a space or by a comma
    
    
    //sometimes you get a string like this: "c0 1.1.9 2 2 2" 
    //I need to add a space before .9 but not before .1
    
    // create a new array
    let vals = [];

    values.forEach(v=>{
    let ry = v.replace(/\./, "*")// replace the first dot with an *
              .replace(/\./g," .")//replace all the remaining dots with " ."
              .replace(/\*/,".")//replace back the * with a "."
              .split(" ");
  
    vals.push(...ry);
    })

    vals.map((p, i) => {
      if (p == "") {
        vals.splice(i, 1);
      }
    });

    let ry = [args[i].charAt(0)].concat(vals);
    ArgsRy.push(ry);
  }
  return ArgsRy;
}

//--------------END Get the array of the svg commands-----



function SVG2UpperCase(commands) {
  for (let i = 1; i < commands.length; i++) {
    let c = commands[i];
    let prev = commands[i - 1];

    let x_ = Number(prev[prev.length - 2]);
    let y_ = Number(prev[prev.length - 1]);

    if (c[0].toUpperCase() !== c[0]) {
      //if is lower case

      switch (c[0]) {
        case "v":
          
          c[0] = "L";
          c[2] = Number(c[1]) + y_; //y
          c[1] = x_; //x

          break;
        case "h":
          
          c[0] = "L";
          c[1] = Number(c[1]) + x_; //x
          c[2] = y_; //y
          break;
        case "q":
        case "s":
          c[1] = Number(c[1]) + x_; //x
          c[2] = Number(c[2]) + y_; //y
          c[3] = Number(c[3]) + x_; //x
          c[4] = Number(c[4]) + y_; //y
          break;
        case "c":
          c[1] = Number(c[1]) + x_; //x
          c[2] = Number(c[2]) + y_; //y
          c[3] = Number(c[3]) + x_; //x
          c[4] = Number(c[4]) + y_; //y
          c[5] = Number(c[5]) + x_; //x
          c[6] = Number(c[6]) + y_; //y
          break;
        case "z":
          c[0] = "Z";
          break;
        default:
          // l, t, m, a
          c[c.length - 2] = Number(c[c.length - 2]) + x_; //x
          c[c.length - 1] = Number(c[c.length - 1]) + y_; //y
      }
    } // END if is lower case

    c[0] = c[0].toUpperCase();
  }

  return commands;
}






// THERE IS NO FUNCTION TO CHANGE A TO C :(

function SVG2C(UC_d_ry) {
  let C_d_ry = [UC_d_ry[0]];
  for (let i = 1; i < UC_d_ry.length; i++) {
    let c = UC_d_ry[i];
    let prev = UC_d_ry[i - 1];

    switch (c[0]) {
      case "S":
        C_d_ry.push(S2C(prev, c));
        break;
      case "Q":
        C_d_ry.push(T2C(prev, c));
        break;
      case "T":
        C_d_ry.push(T2C(prev, c));
        break;
      case "L":
        C_d_ry.push(L2C(prev, c));
        break;
      default:
        C_d_ry.push(c);
    }
  }

  return C_d_ry;
}
// a function to change Q to C
function Q2C(previous, command) {
  for (let i = 1; i < previous.length; i++) {
    previous[i] = parseFloat(previous[i]);
  }
  for (let i = 1; i < command.length; i++) {
    command[i] = parseFloat(command[i]);
  }

  let Q = [
    [previous[previous.length - 2], previous[previous.length - 1]],
    command
  ];

  let cp1 = {};
  let cp2 = {};
  cp1.x = Number(Q[0][0] + 2 / 3 * (Q[1][1] - Q[0][0]));
  cp1.y = Number(Q[0][1] + 2 / 3 * (Q[1][2] - Q[0][1]));
  cp2.x = Number(Q[1][3] + 2 / 3 * (Q[1][1] - Q[1][3]));
  cp2.y = Number(Q[1][4] + 2 / 3 * (Q[1][2] - Q[1][4]));

  return [
    "C",
    cp1.x,
    cp1.y,
    cp2.x,
    cp2.y,
    Number(command[3]),
    Number(command[4])
  ];
}
// a function to change L to C
function L2C(previous, command) {
  //line to cubic Bézier
  let x0 = Number(previous[previous.length - 2]);
  let y0 = Number(previous[previous.length - 1]);
  let x3 = Number(command[1]);
  let y3 = Number(command[2]);
  let x1 = Number(x0 + (x3 - x0) / 3);
  let y1 = Number(y0 + (y3 - y0) / 3);
  let x2 = Number(x0 + 2 * (x3 - x0) / 3);
  let y2 = Number(y0 + 2 * (y3 - y0) / 3);

  return ["C", x1, y1, x2, y2, x3, y3];
} //helper to change a L to C
//a function to change the T command to a Q command
function T2Q(previous, command) {
  let reflected = getReflectedPoint(previous, command);
  return ["Q", reflected.x, reflected.y, command[1], command[2]];
}
//a function to change the T command to a C command
function T2C(previous, command) {
  let Q = T2Q(previous, command);
  return Q2C(previous, command);
}
//a function to change the S command to a C command
function S2C(previous, command) {
  let reflected = getReflectedPoint(previous, command);
  return [
    "C",
    reflected.x,
    reflected.y,
    command[1],
    command[2],
    command[3],
    command[4]
  ];
}
// a function to get the reflected point for the T & S commands
function getReflectedPoint(previous, command) {
  let x2 = Number(previous[previous.length - 4]); //cp x
  let y2 = Number(previous[previous.length - 3]); //cp y
  let x3 = Number(previous[previous.length - 2]); //joining point x
  let y3 = Number(previous[previous.length - 1]); //joining point y

  ///////////////////////////////////////
  // the reflected control point
  let reflected = {};
  reflected.x = 2 * x3 - x2;
  reflected.y = 2 * y3 - y2;
  ///////////////////////////////////////

  return reflected;
}

////////////////////////















function joinRy2d(argsRy) {
  //Joins the `argsRy` to a `d` attribute.
  let d = "";

  for (let i = 0; i < argsRy.length; i++) {
    let arg = argsRy[i];
    let _str = arg[0]; //the commend
    for (let j = 1; j < arg.length; j++) {
      _str += Number(arg[j]);
      if (j % 2 == 0) {
        _str += " ";
      } else {
        _str += ", ";
      }
    }

    d += _str;
  }

  return d;
}





function setViewBox(d) {
  path_input.setAttributeNS(null, "d", d);
  let BB = path_input.getBBox();
  let vb = `${BB.x - 5} ${BB.y - 5} ${BB.width + 10} ${BB.height + 10}`
  svg_input.setAttributeNS(
    null,
    "viewBox",
    vb
  );
  svg_output.setAttributeNS(
    null,
    "viewBox",
    vb
  );
}
