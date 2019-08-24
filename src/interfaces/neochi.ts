import { IrSignal } from "./ir-signal";

export const NAV_PARAMS_PARAM_NAME = 'param';

export const UNIT_IMAGE_NUMBER = 5;
export const LABEL_NONE = 'none';
export const LABEL_MOVE = 'move';
export const LABEL_MOVE_LAYING = 'move_laying';
export const LABEL_NO_MOVE_LAYING = 'no_move_laying';

export interface DataSet {
  id: number,
  name: string,
};

export interface IrSignalPageNavParams {
  irSignal: IrSignal,
}

export interface ActionSetPageNavParams {
  id: number,
};

export interface DataSetPageNavParams {
  dataSet: DataSet,
};

export interface DataAdditionPageNavParams {
  dataSet: DataSet,
};
