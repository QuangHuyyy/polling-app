import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponse} from "@poll-base/data/schema/response/user_response.class";
import {ResponseMessage} from "@poll-base/data/schema/response/response-message.class";
import {LoginData} from "@poll-base/data/schema/request/login.class";
import {JwtResponse} from "@poll-base/data/schema/response/jwt-response.class";

// const AUTH_API: string = "http://localhost:8081/api/auth";
const AUTH_API: string = "https://quanghuy-api-poll-app.up.railway.app/api/auth";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginData: LoginData): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AUTH_API + "/login", loginData, httpOptions);
  }

  register(name: string, email: string, password: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      AUTH_API + "/register",
      {
        name,
        email,
        password,
      },
      httpOptions
    );
  }

  update(uuid: string, name: string, /*email: string, */ avatar: File | null): Observable<UserResponse> {
    let formData: FormData = new FormData();
    if (name != "") {
      formData.append("name", name);
    }
    /*if (email != "") {
      formData.append("email", email);
    }*/
    if (avatar) {
      formData.append("avatar", avatar);
    }

    return this.http.put<UserResponse>(AUTH_API + "/" + uuid, formData);
  }

  removeAvatar(uuid: string): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(AUTH_API + "/" + uuid + "/avatar", {});
  }

  logout(): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(AUTH_API + "/logout", {}, httpOptions);
  }

  sendEmailResetPassword(email: string): Observable<ResponseMessage> {
    let formData: FormData = new FormData();
    formData.append("email", email);
    return this.http.post<ResponseMessage>(AUTH_API + "/reset-password", formData);
  }

  savePasswordReset(password: string, token: string): Observable<ResponseMessage> {
    let params: HttpParams = new HttpParams().set("newPassword", password).set("token", token);
    return this.http.put<ResponseMessage>(AUTH_API + "/save-password", {}, { params: params });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ResponseMessage> {
    let params: HttpParams = new HttpParams().set("oldPassword", currentPassword).set("newPassword", newPassword);
    return this.http.put<ResponseMessage>(AUTH_API + "/change-password", {}, { params: params });
  }
}
