import { BoardConfig, ChessBoardInstance, Piece, PositionType, OrientationType } from 'chessboardjs';

import { Move , redrawMoveList} from './move-list';

// import jsChessEngine from 'js-chess-engine';

declare const Chessboard: any;


const zeroMove: Move = {
  newPosition: 'start'
} as any;

const state = {
  moves: [
    zeroMove
  ] as Move[],
  selectedMove: 0 as number,  // TODO rename to selectedMoveIndex
};

// let moveList: MoveList;
// const positionStack: string[] = [];
let board: ChessBoardInstance;

const config: BoardConfig = {
  draggable: true,
  dropOffBoard: 'trash',
  onDrop: onDrop as any,
  position: 'start'
};

board = Chessboard('myBoard', config);
(window as any).board = board;


// TODO type source and target
function onDrop(
  source: string,
  target: string,
  coloredPiece: Piece,
  newPos: PositionType,
  oldPos: PositionType,
  orientation: OrientationType
) {
  {
    const fen = Chessboard.objToFen(newPos);
    console.log(`https://lichess.org/analysis/${fen}_w_KQkq_-_0_1`);
    console.log(`https://lichess.org/analysis/${fen}_b_KQkq_-_0_1`);
    console.log('');
  }
  if (source === target) {
    return;
  } else if (target !== 'offboard') {
    // positionStack.push(Chessboard.objToFen(oldPos));
    const color = coloredPiece[0];
    const piece = coloredPiece[1];
    const isCapture = Object.keys(newPos).length < Object.keys(oldPos).length;

    // If in the past, remove the future moves before adding the new move
    if (state.selectedMove < state.moves.length - 1) {
      state.moves.splice(state.selectedMove + 1);
    }

    // Add new move
    state.moves.push({
      color,
      source,
      target,
      piece,
      isCapture,
      oldPosition: Chessboard.objToFen(oldPos),
      newPosition: Chessboard.objToFen(newPos),
    });
    state.selectedMove = state.moves.length - 1;
    redrawMoveList(state.moves, state.selectedMove);

    // moveList.select(moveList.moves.length - 1);
    return;
  } else if (
    state.selectedMove > 0
  ) {
    const move = state.moves[state.selectedMove];
    move.isCapture = true;
    move.newPosition = Chessboard.objToFen(newPos);
    redrawMoveList(state.moves, state.selectedMove);
    return;
  } else {
    return 'snapback';
  }
}

document.addEventListener('keydown', (event: KeyboardEvent) => {
  // TODO1 Implement a position stack and use it to update board -- or maybe store position info inside the moves
  if (event.key === 'ArrowLeft') {
    // TODO DRY ArrowRight
    state.selectedMove = Math.max(state.selectedMove - 1, 0)
    redrawMoveList(state.moves, state.selectedMove);
    board.position(state.moves[state.selectedMove].newPosition, false);
  } else if (event.key === 'ArrowRight') {
    // TODO DRY ArrowLeft
    state.selectedMove = Math.min(state.selectedMove + 1, state.moves.length - 1)
    redrawMoveList(state.moves, state.selectedMove);
    let animate = false;
    animate = true;
    board.position(state.moves[state.selectedMove].newPosition, animate); // Could animate forward moves, but this is a bit more complicated than just changing this last param to true. I like how lichess handles this.
  } else if (event.key === 'ArrowUp') {
    state.selectedMove = 0;
    redrawMoveList(state.moves, state.selectedMove);
    board.position(state.moves[state.selectedMove].newPosition, false);
  } else if (event.key === 'ArrowDown') {
    state.selectedMove = state.moves.length - 1;
    redrawMoveList(state.moves, state.selectedMove);
    board.position(state.moves[state.selectedMove].newPosition, false);
  } else if (event.key === '`') {
    onEngineClick();
  }
});

function onMergeClick(): void {
  if (state.moves.length >= 3) {
    const removedMove = state.moves.pop()!;
    const lastMove = state.moves[state.selectedMove - 1];
    lastMove.newPosition = removedMove.newPosition;
    state.selectedMove = Math.min(state.selectedMove, state.moves.length - 1)
    redrawMoveList(state.moves, state.selectedMove);
  }
}

function onPromoteClick(): void {
  if (state.moves.length >= 2) {
    const lastMove = state.moves[state.selectedMove];
    const position: {[key: string]: string} = board.position();
    const piece = window.prompt('What piece? P, N, B, R, Q, K, or blank to cancel.')?.trim()?.toUpperCase();
    if (piece && Array.from('PNBRQK').includes(piece)) {
      position[lastMove.target] = lastMove.color + piece;
      board.position(position, false);
      lastMove.newPosition = board.fen();
      lastMove.promotedTo = piece;
      redrawMoveList(state.moves, state.selectedMove);
    }
  }
}

function onEngineClick(): void {
  const jce = (window as any)['js-chess-engine'];
  if (!jce) {
    return;
  }
  // console.log({jce});
  const result = jce.aiMove(board.fen() + ' b - - 0 1');
  console.log(result);
  if (result && Object.keys(result).length > 0) {
    let source = Object.keys(result)[0];
    let target = result[source];
    source = source.toLowerCase();
    target = target.toLowerCase();
    const oldPosition = board.fen();
    board.move(`${source}-${target}`);
    const newPosition = board.fen();
    const color = 'b';
    const piece = '?';
    const move = { color, piece, source, target, oldPosition, newPosition };
    state.moves.push(move);
    // TODO if move was in the past change history
    state.selectedMove = state.moves.length - 1;
    redrawMoveList(state.moves, state.selectedMove);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#merge')!.addEventListener('click', onMergeClick);
  document.querySelector('#promote')!.addEventListener('click', onPromoteClick);
  document.querySelector('#engine')!.addEventListener('click', onEngineClick);
});
