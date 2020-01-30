/*
┌───────┬───────┬───────┐
│ 1     │ 7     │       │
│       │       │       │
│       │       │       │
├───────┼───────┼───────┤
│ 5 6 7 │     9 │       │
│ 4 1 2 │   8   │       │
│ 3 8 9 │       │       │
├───────┼───────┼───────┤
│       │ 4     │       │
│       │ 3 1 5 │       │
│       │       │       │
└───────┴───────┴───────┘
*/
function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class SudokuGrid {
  constructor() {
    this.grid = [];
  }

  generateBaseGrid(n = 3) {
    const grid = [];
    for (let i = 0; i < n * n; i++) {
      const row = [];
      for (let j = 0; j < n * n; j++) {
        row.push((i * n + Math.floor(i / n) + j) % (n * n) + 1);
      }
      grid.push(row);
    }
    this.grid = grid;
    return this;
  }

  transpose() {
    const grid = this.grid;
    this.grid = grid[0].map((_col, i) => grid.map(row => row[i]));
    return this;
  }

  getFancyString() {
    const grid = this.grid;
    let out = '┌───────┬───────┬───────┐\n';
    for (let i = 0; i < grid.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        out += '├───────┼───────┼───────┤\n';
      }
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        if (j % 3 === 0) { 
          out += '│ ';
        }
        out += row[j] + ' ';
      }
      out += '│\n';
    }
    out += '└───────┴───────┴───────┘';
    return out;
  }

  swapRowsSmall() {
    const area = getRandInt(0, 3);
    const line1 = getRandInt(0, 3);
    const N1 = area * 3 + line1;
    let line2 = getRandInt(0, 3);
    while (line1 === line2) {
      line2 = getRandInt(0, 3);
    }
    const N2 = area * 3 + line2;
    for (let i = 0; i < 9; i++) {
      const tmp = this.grid[N1];
      this.grid[N1] = this.grid[N2];
      this.grid[N2] = tmp;
    }
    return this;
  }

  swapRowsArea() {
    const grid = this.grid;
    const area1 = getRandInt(0, 3);
    let area2 = getRandInt(0, 3);
    while (area1 === area2) {
      area2 = getRandInt(0, 3);
    }

    for (let i = 0; i < 3; i++) {
      const N1 = area1 * 3 + i;
      const N2 = area2 * 3 + i;
      const tmp = grid[N1];
      grid[N1] = grid[N2];
      grid[N2] = tmp;
    }

    this.grid = grid;
    return this;
  }

  swapColsSmall() {
    return this
      .transpose()
      .swapRowsSmall()
      .transpose();
  }

  swapColsArea() {
    return this
      .transpose()
      .swapRowsArea()
      .transpose();
  }

  shuffle(count = 100) {
    const func = [
      'transpose',
      'swapRowsSmall',
      'swapColsSmall',
      'swapRowsArea',
      'swapColsArea',
    ];

    for (let i = 0; i < count; i++) {
      const funcName = func[getRandInt(0, func.length)];
      this[funcName]();
    }

    return this;
  }
}


const grid = (new SudokuGrid())
  .generateBaseGrid()
  .shuffle()
  .getFancyString();
console.log(grid);
