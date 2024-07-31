import { createReducer,on } from "@ngrx/store";
import { User } from "../../interface/user";
import { getUserdata, getUserDataFailed, getUserDataSuccess, login, loginFailed, loginSuccess } from "./user.actions";

export type loginData = {
  email: string
  password: string
}
export interface UserState {
  user:User|null
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

  on(loginSuccess, (state:UserState, {user , token}) => {
    return {
      ...state,
      user,
      loading: false,
      error: null
    }
  }),

  on(loginFailed, (state: UserState, action: { error: any }) => {
    return {
      ...state,
      user: null,
      loading: false,
      error: action.error
    }
  }),
  on(getUserdata,(state:UserState) => {

    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on (getUserDataSuccess,(state:UserState,{user,token}) => {
    return {
      ...state,
      user,
      loading: false,
      error: null
    }
  }),
  on(getUserDataFailed,(state:UserState,{error}) => {
    return {
      ...state,
      user: null,
      loading: false,
      error
    }
  })
)

