import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Car } from '../domain/models/car.model';
import { CarRepository } from '../infrastructure/repositories/car.repository';

@Injectable({ providedIn: 'root' })
export class CarFacade {
  private carSubject = new BehaviorSubject<Car | null>(null);
  car$ = this.carSubject.asObservable();

  constructor(private repository: CarRepository) {}

  addCar(car: Car) {
    return this.repository.addCar(car);
  }

  loadProfile() {
    return this.repository.getProfile();
  }
}