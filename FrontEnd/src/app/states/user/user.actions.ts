import { createAction, props } from "@ngrx/store";
import { User } from "../../interface/user";
import { loginData } from "./user.reducer";


export const login = createAction(
  '[USER] login',
  props<loginData>()
);

export const loginSuccess= createAction(
  '[USER] login success',
  props<{ user: User , token: string}>()
)

export const loginFailed = createAction(
  '[USER] login failed',
  props<{ error: any }>()
)

export const getUserdata = createAction(
  '[USER] get user data',
  props<{ user: User , token: string}>()

)
