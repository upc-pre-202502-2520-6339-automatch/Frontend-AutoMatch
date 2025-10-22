import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles: any[] = [];
  private profilesSubject = new BehaviorSubject<any[]>([]);
  private register: any[] = [];
  private registersSubject = new BehaviorSubject<any[]>([]);
  constructor() {}

  addProfile(profile: any) {
    //Add an id for the profile
    const id = `profile${this.profiles.length + 1}`;
    this.profiles.push({ ...profile, id });
    this.profilesSubject.next(this.profiles);

    return of({ ...profile, id });
  }

  getProfiles() {
    return this.profilesSubject.asObservable();
  }
  getProfileById(id: string) {
    const profile = this.profiles.find(profile => profile.id === id);
    return of(profile);
  }
  updateProfile(updatedProfile: any) {
    const index = this.profiles.findIndex(profile => profile.id === updatedProfile.id);
    if (index !== -1) {
      this.profiles[index] = updatedProfile;
      this.profilesSubject.next(this.profiles);
    }
    return of(this.profiles[index]);
  }

  addRegister(register: any) {
    console.log(register);

    //Add an id for the register
    const id = `register${this.register.length + 1}`;
    this.register.push({ ...register, id });
    this.registersSubject.next(this.register);
  }

  getRegisters() {
    return this.registersSubject.asObservable();
  }

}
