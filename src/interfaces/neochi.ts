import { IrSignal } from "./ir-signal";

export const NAV_PARAMS_PARAM_NAME = 'param';

export interface IrSignalPageNavParams {
  irSignal: IrSignal,
}

export interface ActionSetPageNavParams {
  id: number,
};