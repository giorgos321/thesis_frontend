interface toast {
  show: boolean;
  toastType?: 'error' | 'success' | 'warning';
  message?: string;
}

interface showToast extends toast {
  show: boolean;
  toastType: 'error' | 'success' | 'warning';
  message: string;
}

interface hideToast extends toast {
  show: boolean;
}

type toastContent = showToast | hideToast
export interface appState {
  auth: boolean;
  toast: toastContent;
}

export enum actionsEnum {
  auth,
  toast
}

interface appStateActions {
  type: actionsEnum;
  payload: unknown;
}

export interface changeAuthAction extends appStateActions {
  type: actionsEnum.auth;
  payload: { auth: boolean };
}

export interface toastAction extends appStateActions {
  type: actionsEnum.toast;
  payload: toastContent;
}

export type actions = changeAuthAction | toastAction;

export const appReducer = (state: appState, action: actions): appState => {
  switch (action.type) {
    case actionsEnum.auth:
      return { ...state, auth: action.payload.auth };
    case actionsEnum.toast:
      return { ...state,toast: action.payload }
    default:
      return state;
  }
};
