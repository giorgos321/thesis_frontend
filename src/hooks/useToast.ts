import { useContext } from "react";
import { AppContext } from "../app/Root";
import { actionsEnum } from "../appReducer";


const useToast = () => {
    const { dispatch } = useContext(AppContext);

    const showToast = (type: 'error' | 'warning' | 'success',message:string,autoClose?: number) => {
        dispatch({ type: actionsEnum.toast, payload: { show: true, toastType: type,message } });
        if(typeof autoClose === 'number' && autoClose > 0){
            setTimeout(() => {
                hideToast()
            },autoClose)
        }
    }

    const hideToast = () => {
        dispatch({ type: actionsEnum.toast, payload: { show: false } })
    }

    return { showToast,hideToast }
}

export default useToast;