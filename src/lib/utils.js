import boards from './boards';

export function getRandomInt(min, max) {
  min = Math.ceil(min); // eslint-disable-line
  max = Math.floor(max); // eslint-disable-line
  return Math.floor(Math.random() * (max - min)) + min;
}

export function createGrid(level) {
  const l = boards[level];
  const [board, solution] = l[getRandomInt(0, l.length)].split(',');
  const grid = [];
  for (let i = 0; i < 9; i += 1) {
    const row = [];
    for (let j = 0; j < 9; j += 1) {
      const index = i * 9 + j;
      const v = parseInt(board[index], 10);
      const s = parseInt(solution[index], 10);
      const cell = {
        row: i,
        col: j,
        value: Number.isNaN(v) ? null : v,
        isKey: v === s,
        solution: s,
        candidates: [],
        validCandidates: [],
        isSelected: false,
        isHighlighted: false,
        isSame: false,
        isError: false,
      };
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
}
