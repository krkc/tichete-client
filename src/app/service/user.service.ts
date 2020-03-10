import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';

@Injectable()
export class UserService {
  private usersUrl = '/api/users';  // URL to users web api
  private userUrl = '/api/user'; // URL to user web api
  private headers: HttpHeaders;
  private options;
  constructor(
    private http: HttpClient,
  ) {
    this.headers.append('Content-Type', 'application/json');
    this.options = { 'headers': this.headers };
    this.headers = new HttpHeaders(this.options);
  }

  getUser(id: number): Promise<User> {
    return this.getUsers()
      .then(users => users.find(user => user.Id === id));
  }

  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .toPromise()
      .catch(this.handleError);
  }

  getAssignments(userId: number): Promise<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.userUrl}/${userId}/assigned`)
      .toPromise()
      .catch(this.handleError);
  }

  updateAssignments(userId: number, assignedTickets: number[], unassignedTickets: number[]): Promise<Ticket[]> {
    const url = `${this.userUrl}/${userId}/assign`;
    return this.http.put<Ticket[]>(url, JSON.stringify({ added: assignedTickets, removed: unassignedTickets }), this.options)
      .toPromise()
      .catch(this.handleError);
  }

  update(user: User): Promise<User> {
    const url = `${this.userUrl}/${user.Id}`;
    return this.http
      .put<User>(url, JSON.stringify(user), this.options)
      .toPromise()
      .catch(this.handleError);
  }

  async create(_username: string, _firstName: string, _lastname: string, _password: string): Promise<User> {
    return this.http
      .post<User>(this.userUrl,
        JSON.stringify({ Username: _username, FirstName: _firstName, LastName: _lastname, Password: _password }), this.options)
      .toPromise()
      .catch(err => this.handleError(err));
  }

  delete(id: number): Promise<void> {
    const url = `${this.userUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
