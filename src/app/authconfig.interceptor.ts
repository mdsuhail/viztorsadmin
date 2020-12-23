import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { tap, filter } from 'rxjs/operators';
import { AuthenticateService } from "./auth/auth.service";
import { ToastrService } from 'ngx-toastr';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticateService,
    private toastr: ToastrService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const customHeaders = req.clone({
      headers: new HttpHeaders({
        'Authorization': authToken ? "jwt " + authToken : "",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
    return next.handle(customHeaders)
      .pipe(filter(event => event instanceof HttpResponse), tap((event: HttpResponse<any>) => {
        if (event.body.statusCode == 401) {
          this.toastr.error(event.body.message, 'Error', { timeOut: 4000 })
          setTimeout(() => {
            this.authService.logout()
          }, 4000);
        }
      },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.authService.logout();
          }
        }
		));
  }
}