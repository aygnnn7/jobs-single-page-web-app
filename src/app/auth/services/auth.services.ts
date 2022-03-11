import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Login} from "../models/login.model";
import {User} from "../models/user.model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})


export class AuthServices {
  constructor(private http: HttpClient) {
  }

  login$(data: Login): Observable<User >  {

    // @ts-ignore
    return this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
      map((response:User[]) => {
        const user = response.find(u => u.email === data.email
          && u.password == data.password);

        if(user){
          return user;
        }
        return null;
      }))
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
  }

  storeUserData(user: User): void {
    delete user.password;
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getUserFromStorage(): User  {

    // @ts-ignore
    return JSON.parse(localStorage.getItem('loggedUser'));
  }
}
