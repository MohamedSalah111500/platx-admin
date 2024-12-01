import { ActionReducerMap } from "@ngrx/store";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";
import { CartReducer, CartState } from "./Cart/cart.reducer";
import { projectReducer, projectState } from "./ProjectsData/project.reducer";
import { UserReducer, UserState } from "./UserGrid/user.reducer";
import { UserListReducer, UserlistState } from "./UserList/userlist.reducer";
import { CandidateReducer, CandidateState } from "./Candidate/candidate.reducer";
import { tasklistReducer, tasklistState } from "./Tasks/tasks.reducer";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";


export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
    CartList: CartState;
    Projectlist: projectState;
    usergrid: UserState;
    userList: UserlistState;
    CandidateList: CandidateState;
    Tasklist: tasklistState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    CartList: CartReducer,
    Projectlist: projectReducer,
    usergrid: UserReducer,
    userList: UserListReducer,
    CandidateList: CandidateReducer,
    Tasklist: tasklistReducer,
}