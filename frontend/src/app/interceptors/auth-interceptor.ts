import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from local storage
  const authToken = localStorage.getItem('token');

  // If a token exists, clone the request and add the authorization header
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  }

  // If no token, pass the original request along
  return next(req);
};