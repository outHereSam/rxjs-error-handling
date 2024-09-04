import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './interfaces/IProduct';
import { products } from '../assets/data';
import { delay, from, map, of, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'rxjs-error-handling';
  data: Product[] = products;

  simulateHttpRequest() {
    // With timer
    // return timer(2000).pipe(map(() => this.data));

    // with of and delay
    return of(this.data).pipe(delay(2000));
  }

  fetchData() {
    this.simulateHttpRequest().subscribe((response) => console.log(response));
  }
}
