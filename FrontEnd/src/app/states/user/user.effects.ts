import { Actions, createEffect, ofType } from "@ngrx/effects";
import { login, loginFailed, loginSuccess } from "./user.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

export class UserEffects {

  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private actions$: Actions = inject(Actions);

  login$ = createEffect(() => {
    console.log('dsfjhdsjfhkdjfh');

    return this.actions$.pipe(
      ofType(login),
      switchMap((action: { email: string; password: string }) => {
        return this.userService.loginUser(action).pipe(
          map((res) => {
            localStorage.setItem('token', res.token)
            this.router.navigate(['/'])
            return loginSuccess({ user: res.user, token: res.token })
          }),
          catchError((error) => {
            return of(loginFailed({ error: error }))
          })
        )
      })

    );
  })
}

