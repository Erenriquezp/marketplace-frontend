import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  private configUrl = 'assets/config/config.json';

  loadConfig(): Observable<unknown> {
    return this.http.get(this.configUrl);
  }
}
