<template>
  <div class="game">
    <div class="new-game-splash" v-if="!grid">
      <div class="new-game-label">New game</div>
      <button
        v-for="level in ['simple', 'easy', 'intermediate', 'expert']"
        class="btn new-game-btn"
        :key="level"
        @click="createGame(level)"
      >
        {{ level }}
      </button>
    </div>
    <template v-if="grid">
      <Counter />
      <div class="board">
        <div
          class="row"
          v-for="(row, r) in grid"
          :key="r"
        >
          <div
            class="cell"
            :class="{ 'key': cell.isKey, 'selected': cell.isSelected, 'highlight': cell.isHighlighted, 'same': cell.isSame, 'error': cell.isError }"
            v-for="(cell, c) in row"
            :data-value="cell.value ? cell.value : false"
            :key="c"
            @click="select(r, c, cell)"
          >
            <div class="candidates-container" v-if="!cell.value">
              <div
                class="candidate"
                v-for="i in 9"
                :class="{ 'visible' : cell.candidates.includes(i), 'valid': cell.validCandidates.includes(i)}"
                :key="i"
                :data-value="i"
              >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="controls" v-if="grid">
        <button class="btn show-toolbar" @click="isToolbarVisible = !isToolbarVisible">
          {{ isToolbarVisible ? '-' : '+' }}
        </button>
        <div class="pads-container" v-if="!isToolbarVisible">
          <div class="pad">
            <div
              class="pad__btn pad__btn_candidate"
              :class="getCandidateBtnClassname(i)"
              v-for="i in 9"
              :key="i"
              :data-value="i"
              @click="toggleCandidate(i)"
            >
            </div>
          </div>
          <div class="pad">
            <div
              class="pad__btn pad__btn_value"
              :class="getValueBtnClassname(i)"
              v-for="i in 9"
              :key="i"
              :data-value="i"
              @click="toggleValue(i)"
            >
            </div>
          </div>
        </div>
        <div class="toolbar" v-if="isToolbarVisible">
          <button class="btn" @click="startNewGame()">New game</button>
          <button class="btn" @click="fillCandidates()">Fill candidates</button>
          <button class="btn" @click="removeInvalidCandidates()">Remove invalid candidates</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import Counter from './Counter.vue'
  import { createGrid } from '../lib/utils';
  const LS_KEY_GRID = 'sudoku_grid';

  export default {
    components: {
      Counter,
    },
    data: () => ({
      grid: null,
      isToolbarVisible: false,
    }),
    created() {
      window.app = this;
      this.tryLoadGame();
    },
    methods: {
      tryLoadGame() {
        const grid = localStorage.getItem(LS_KEY_GRID);
        if (grid) {
          this.grid = JSON.parse(grid);
        }
      },
      startNewGame() {
        this.grid = null;
        this.isToolbarVisible = false;
      },
      createGame(level) {
        this.grid = createGrid(level);
        this.saveState();
      },
      saveState() {
        localStorage.setItem(LS_KEY_GRID, JSON.stringify(this.grid));
      },
      forEachCell(cb) {
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            cb(r, c, this.grid[r][c]);
          }
        }
      },
      fillCandidates() {
        this.forEachCell((row, col, cell) => {
          if (!cell.value) {
            const candidates = this.getCellCandidates(row, col);
            cell.candidates = candidates;
            cell.validCandidates = [...candidates]; 
          }
        });
      },
      validateCandidates() {
        this.forEachCell((r, c, cell) => {
          cell.validCandidates = this.getCellCandidates(r, c);
        });
      },
      removeInvalidCandidates() {
        this.forEachCell((r, c, cell) => {
          cell.candidates = cell.candidates.filter(
            x => cell.validCandidates.includes(x)
          );
        });
      },
      getBoxRest(row, col) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        const rest = [];

        for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            if (r === row && c === col) {
              continue;
            }
            const val = this.grid[r][c].value;
            if (val) {
              rest.push(val);
            }
          }
        }
        return rest;
      },
      getRowRest(row, col) {
        const rest = [];
        for (let c = 0; c < 9; c++) {
          if (c === col) {
            continue;
          }
          const val = this.grid[row][c].value;
          if (val) {
            rest.push(val);
          }
        }
        return rest;
      },
      getColRest(row, col) {
        const rest = [];
        for (let r = 0; r < 9; r++) {
          if (r === row) {
            continue;
          }
          const val = this.grid[r][col].value;
          if (val) {
            rest.push(val);
          }
        }
        return rest;
      },
      getCellCandidates(row, col) {
        const source = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const values = [
          ...new Set([
            ...this.getBoxRest(row, col),
            ...this.getRowRest(row, col),
            ...this.getColRest(row, col),
          ])
        ];
        return source.filter(x => !values.includes(x));
      },
      clearHighlighting() {
        this.forEachCell((row, col, cell) => {
          cell.isSelected = false;
          cell.isHighlighted = false;
          cell.isSame = false;
        });
      },
      highlightLines(row, col) {
        for (let i = 0; i < 9; i++) {
          this.grid[row][i].isHighlighted = true;
          this.grid[i][col].isHighlighted = true;
        }
      },
      highlightBox(row, col) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            this.grid[r][c].isHighlighted = true;
          }
        }
      },
      highlightSame(cell) {
        if (!cell.value) {
          return;
        }
        this.forEachCell((r, c, cell_) => {
          if (cell.value === cell_.value) {
            cell_.isSame = true;
            // this.highlightLines(r, c);
            // this.highlightBox(r, c);
          }
        });
      },
      select(row, col, cell) {
        this.clearHighlighting();
        this.highlightBox(row, col);
        this.highlightLines(row, col);
        this.highlightSame(cell);
        this.grid[row][col].isSelected = true;
      },
      toggleCandidate(n) {
        const cell = this.selectedCell;
        if (cell && !cell.value) {
          if (cell.candidates.includes(n)) {
            cell.candidates = cell.candidates.filter(c => c !== n);
          } else {
            cell.candidates.push(n);
          }
          this.saveState();
        }
      },
      toggleValue(n) {
        const cell = this.selectedCell;
        if (!cell || cell.isKey) {
          return;
        }
        cell.value = cell.value === n ? null : n;
        if (cell.value) {
          cell.isError = cell.value !== cell.solution;
        }
        this.select(cell.row, cell.col, cell);
        this.validateCandidates();
        this.saveState();
      },
      getValueCount(n) {
        let i = 0;
        this.forEachCell((r, c, cell) => {
          if (cell.value === n) {
            i += 1;
          }
        });
        return i;
      },
      getValueBtnClassname(n) {
        const cn = {
          'active': false,
          'disabled': false,
          'finished': false,
        };
        const cell = this.selectedCell;
        if (cell) {
          cn['disabled'] = cell.isKey;
          cn['active'] = cell.value === n;
          cn['finished'] = this.getValueCount(n) === 9;
        } else {
          cn['disabled'] = true;
        }
        return cn;
      },
      getCandidateBtnClassname(n) {
        const cn = {
          'active': false,
          'disabled': false,
        };
        const cell = this.selectedCell;
        if (cell) {
          cn['active'] = cell.candidates.includes(n);
          cn['disabled'] = cell.isKey;
        }
        return cn;
      },
    },
    computed: {
      selectedCell() {
        let cell_ = null;
        this.forEachCell((r, c, cell) => {
          if (cell.isSelected) {
            cell_ = cell;
          }
        });
        return cell_;
      },
    },
  }
</script>
