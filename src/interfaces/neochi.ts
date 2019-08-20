import { IrSignal } from "./ir-signal";

export const NAV_PARAMS_PARAM_NAME = 'param';

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
