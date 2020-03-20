import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Ticket } from './ticket';
import { Observable, of } from 'rxjs';
import { TicketService } from 'src/app/service/ticket.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketDetailResolverService implements Resolve<Ticket> {

  constructor(private userService: TicketService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Ticket | Observable<Ticket> | Observable<never> {
    let id = route.paramMap.get('id');

    return this.userService.getTicket(+id).pipe<Ticket>(
      mergeMap(ticket => {
        if (ticket) {
          return of(ticket);
        } else {
          this.router.navigate(['/tickets']);
          return null;
        }
      })
    );
  }
}
