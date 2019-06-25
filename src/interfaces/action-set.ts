import { Action } from "./action";

export interface ActionSet {
  id: number;
  name: string;
  actions: Action[];
}
