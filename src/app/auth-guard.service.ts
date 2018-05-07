import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {environment} from "../environments/environment";
import {Injectable} from "@angular/core";
import {GlobalService} from "./services/global.service";

@Injectable()

export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private globalService:GlobalService) {}

  canActivate(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    if(!this.globalService.getCookie(environment.prefix+"-login")){
      this.router.navigate(["login"]);
    }
    return true
  }

  canActivateChild(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    if(!this.globalService.getCookie(environment.prefix+"-login")){
      this.router.navigate(["login"]);
    } 
    return true
  }
}
