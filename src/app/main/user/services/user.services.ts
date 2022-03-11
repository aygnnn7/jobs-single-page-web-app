import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {User} from "../../../auth/models/user.model";

@Injectable({
  providedIn: 'root'
})

export class UserServices{
  private url = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {
  }

  getUser$(id: number):Observable<User> {
    const url = `${this.url}/${id}`;

    return this.http.get<User>(url);
  }

  deleteUser$(id: number) : Observable<void>{
    const url = `${this.url}/${id}`;

    return this.http.delete<void>(url);
  }
  //create
  postUser$(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }
  //edit
  putUser$(user: User): Observable<User>{
    const url = `${this.url}/${user.id}`;
    return this.http.put<User>(url, user);
  }



}

