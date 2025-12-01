// src/app/profiles/application/profile-facade.service.ts
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../register/services/authentication.service';
import { combineLatest, map, Observable, of } from 'rxjs';
import { Profile, ProfileService } from '../services/profile.service';

export interface UserContext {
  profile: Profile | null;
  roles: string[];
  currentRole: 'SELLER' | 'BUYER' | 'MECHANIC' | 'USER';
}

@Injectable({ providedIn: 'root' })
export class ProfileFacade {

  userContext$: Observable<UserContext>;
  isSeller$: Observable<boolean>;
  isBuyer$: Observable<boolean>;

  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService
  ) {
    // 👇 ahora se inicializa dentro del constructor
    this.userContext$ = combineLatest([
      this.authService.roles$,
      this.profileService.currentProfile$
    ]).pipe(
      map(([roles, profile]) => {
        const currentRole =
          roles?.includes('SELLER')   ? 'SELLER'   :
            roles?.includes('MECHANIC') ? 'MECHANIC' :
              roles?.includes('BUYER')    ? 'BUYER'    :
                'USER';

        return { profile, roles: roles ?? [], currentRole };
      })
    );

    this.isSeller$ = this.authService.roles$.pipe(
      map(roles => roles.includes('SELLER'))
    );

    this.isBuyer$ = this.authService.roles$.pipe(
      map(roles => roles.includes('BUYER'))
    );
  }

  /** Devuelve el perfil actual (lo carga si no está en cache) */
  loadMyProfile(): Observable<Profile | null> {
    const cached = this.profileService.getCurrentProfileSnapshot();
    if (cached) return of(cached);
    return this.profileService.getMyProfile();
  }
}
