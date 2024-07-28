import { Actions, createEffect, ofType } from "@ngrx/effects";
import { login } from "./user.actions";
import { switchMap } from "rxjs";

export class UserEffects {
  login$ = createEffect(() => {

    return this.actions$.pipe(
      ofType(login),
      switchMap((action:formData:any) => {
        return [loginSuccess({user:action.user,token:action.token})]
      })
    );
  })
  constructor(private actions$:Actions) {}
}

