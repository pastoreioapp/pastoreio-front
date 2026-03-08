const GAP_X = 300;
export const GAP_Y = 180;
const BASE_X = 100;
const LEVEL_START_Y = 0;
const FALLBACK_COLUMNS = 1;

export const ORGANOGRAMA_CARD_WIDTH = 240;

function calculateHorizontalOffset(itemsInLevel: number, currentRowItems: number) {
    const effectiveCount = Math.min(itemsInLevel, currentRowItems);
    const rowWidth = (effectiveCount - 1) * GAP_X;

    return BASE_X - rowWidth / 2;
}

export function getLevelRowCount(itemsInLevel: number, columnsPerLine: number) {
    if (itemsInLevel <= 0) {
        return 0;
    }

    return Math.ceil(itemsInLevel / Math.max(columnsPerLine, FALLBACK_COLUMNS));
}

export function calculateLevelPosition(
    index: number,
    itemsInLevel: number,
    levelBaseY: number,
    columnsPerLine: number
) {
    const safeColumnsPerLine = Math.max(columnsPerLine, FALLBACK_COLUMNS);
    const row = Math.floor(index / safeColumnsPerLine);
    const column = index % safeColumnsPerLine;
    const isLastRow = row === Math.floor((itemsInLevel - 1) / safeColumnsPerLine);
    const itemsInCurrentRow = isLastRow
        ? ((itemsInLevel - 1) % safeColumnsPerLine) + 1
        : safeColumnsPerLine;
    const startX = calculateHorizontalOffset(itemsInLevel, itemsInCurrentRow);

    return {
        x: startX + column * GAP_X,
        y: LEVEL_START_Y + levelBaseY + row * GAP_Y,
    };
}
