import { BOARD_SIZE } from '../../constants';

const getRandomWithLimit = (limit: number) => () => Math.floor(Math.random() * limit);

export const defaultState = [...new Array(BOARD_SIZE).keys()] as number[];
export const getRandomOnBoard = getRandomWithLimit(BOARD_SIZE);
export const getRandomBoolean = getRandomWithLimit(2);
