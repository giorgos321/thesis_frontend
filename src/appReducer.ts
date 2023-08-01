interface toast {
  show: boolean;
  toastType?: "error" | "success" | "warning";
  message?: string;
}

interface showToast extends toast {
  show: boolean;
  toastType: "error" | "success" | "warning";
  message: string;
}

interface hideToast extends toast {
  show: boolean;
}

type toastContent = showToast | hideToast;

export enum Roles {
  teacher = "1",
  student = "2",
  admin = "3",
}

export type User = {
  id: number;
  username: string;
  role: string;
  email: string;
};
export interface appState {
  auth: boolean;
  toast: toastContent;
  currentUser?: User;
}

export enum actionsEnum {
  auth,
  toast,
  currentUser,
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

export interface currentUserAction extends appStateActions {
  type: actionsEnum.currentUser;
  payload: User | undefined;
}

export type actions = changeAuthAction | toastAction | currentUserAction;

export const appReducer = (state: appState, action: actions): appState => {
  switch (action.type) {
    case actionsEnum.auth:
      return { ...state, auth: action.payload.auth };
    case actionsEnum.toast:
      return { ...state, toast: action.payload };
    case actionsEnum.currentUser:
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};
