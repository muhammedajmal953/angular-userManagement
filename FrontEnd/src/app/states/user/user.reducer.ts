import { createReducer,on } from "@ngrx/store";
import { User } from "../../interface/user";
import { login, loginSuccess } from "./user.actions";



export interface UserState{
  user: User|null
  error: string|null
  loading: boolean
}


export const initialState: UserState = {
  user: null,
  error: null,
  loading: false
}

export const userReducer = createReducer(
  initialState,
  on(login, (state:UserState) => {

    return {
      ...state,
      loading: true,
      error: null
    }

  }),
  
  on(loginSuccess, (state:UserState, action) => {
    return {
      ...state,
      user: action.user,
      loading: false,
      error: null
    }
  })

)

