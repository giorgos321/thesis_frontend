export interface appState {
  auth: boolean;
}

export enum actionsEnum {
  auth,
}

interface appStateActions {
  type: actionsEnum;
  payload: unknown;
}

export interface changeAuthAction extends appStateActions {
  type: actionsEnum.auth;
  payload: { auth: boolean };
}

export type actions = changeAuthAction;

export const appReducer = (state: appState, action: actions): appState => {
  switch (action.type) {
    case actionsEnum.auth:
      return { ...state, auth: action.payload.auth };
    default:
      return state;
  }
};
