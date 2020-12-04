import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Ticket } from '../ticket';
import { Observable, of } from 'rxjs';
import { TicketService } from 'src/app/service/ticket/ticket.service';

@Injectable({
  providedIn: 'root'
})
export class TicketDetailResolverService implements Resolve<Observable<Ticket>> {

  constructor(private ticketService: TicketService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<Ticket>> {
    let id = route.paramMap.get('id');

    return of(this.ticketService.getOne(+id));
  }
}
