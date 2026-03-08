const CARDS_PER_LINE = 3;
const GAP_X = 300;
const GAP_Y = 180;
const LEADER_Y = 0;
const MEMBER_START_Y = GAP_Y;
const BASE_X = 100;
const SINGLE_LEADER_X = 400;
const TWO_LEADERS_POSITIONS = [250, 550] as const;

export const ORGANOGRAMA_CARD_WIDTH = 240;
export const ORGANOGRAMA_CANVAS_HEIGHT = 750;

export function calculateLeaderPosition(index: number, total: number) {
    if (total === 1) {
        return { x: SINGLE_LEADER_X, y: LEADER_Y };
    }

    if (total === 2) {
        return { x: TWO_LEADERS_POSITIONS[index] ?? SINGLE_LEADER_X, y: LEADER_Y };
    }

    return {
        x: BASE_X + index * GAP_X,
        y: LEADER_Y,
    };
}

export function calculateMemberPosition(index: number) {
    const row = Math.floor(index / CARDS_PER_LINE);
    const column = index % CARDS_PER_LINE;

    return {
        x: BASE_X + column * GAP_X,
        y: MEMBER_START_Y + row * GAP_Y,
    };
}
