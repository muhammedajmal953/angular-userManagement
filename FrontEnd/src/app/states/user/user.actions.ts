import { createAction, props } from "@ngrx/store";
import { User } from "../../interface/user";


export const login = createAction(
  '[USER] login',
  props<{ email: string; password: string }>()
);

export const loginSuccess= createAction(
  '[USER] login success',
  props<{ user: User , token: string}>()
)
