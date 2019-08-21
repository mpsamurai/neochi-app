import { IrSignal } from "./ir-signal";

export const NAV_PARAMS_PARAM_NAME = 'param';

export const UNIT_IMAGE_NUMBER = 5;
export const LABEL_AWAKE = 'awake';
export const LABEL_SLEEPING = 'sleeping';

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
