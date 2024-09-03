
import canvasTypeRedux from "./canvasTypes";
import { UserTypeRedux } from "./userTypes";

export interface ReduxStateType {
    user: UserTypeRedux,
    canvas: canvasTypeRedux,
}