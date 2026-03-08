const CARDS_PER_LINE = 4;
const GAP_X = 300;
export const GAP_Y = 180;
const BASE_X = 100;
const LEVEL_START_Y = 0;

export const ORGANOGRAMA_CARD_WIDTH = 240;

function calculateHorizontalOffset(itemsInLevel: number, currentRowItems: number) {
    const effectiveCount = Math.min(itemsInLevel, currentRowItems);
    const rowWidth = (effectiveCount - 1) * GAP_X;

    return BASE_X - rowWidth / 2;
}

export function getLevelRowCount(itemsInLevel: number) {
    if (itemsInLevel <= 0) {
        return 0;
    }

    return Math.ceil(itemsInLevel / CARDS_PER_LINE);
}

export function calculateLevelPosition(
    index: number,
    itemsInLevel: number,
    levelBaseY: number
) {
    const row = Math.floor(index / CARDS_PER_LINE);
    const column = index % CARDS_PER_LINE;
    const isLastRow = row === Math.floor((itemsInLevel - 1) / CARDS_PER_LINE);
    const itemsInCurrentRow = isLastRow
        ? ((itemsInLevel - 1) % CARDS_PER_LINE) + 1
        : CARDS_PER_LINE;
    const startX = calculateHorizontalOffset(itemsInLevel, itemsInCurrentRow);

    return {
        x: startX + column * GAP_X,
        y: LEVEL_START_Y + levelBaseY + row * GAP_Y,
    };
}
