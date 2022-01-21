import { htmlToElement } from './util';

interface Move {
  piece: string;
  source: string;
  target: string;
  isCapture?: boolean;
}

export class MoveList {
  private moves: Move[] = [];

  constructor(private element: HTMLElement) {}

  add(move: Move) {
    this.moves.push(move);
    this.updateDomForAdd();
  }

  remove() {
    if (this.moves.length === 0) {
      throw new Error('MoveList.remove() called but there are no moves to remove');
    }
    this.moves.pop();
    this.updateDomForRemove();
  }

  lastMove(): Move | undefined {
    const move = this.moves.slice(-1)[0]; // TODO Add lib for .at()?
    return move ? {...move} : undefined;
  }

  private updateDomForAdd() {
    const move = this.lastMove();
    if (!move) {
      return;
    }
    const moveString = moveToString(move);
    this.element.appendChild(htmlToElement(`
      <div>${moveString}</div>
    `));
  }

  private updateDomForRemove() {
    if (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild);
    }
  }
}


function moveToString(move: Move): string {
  return move.piece + (move.isCapture ? 'x' : '') + move.target;
}
