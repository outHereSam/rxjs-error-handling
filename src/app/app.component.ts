import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './interfaces/IProduct';
import { products } from '../assets/data';
import {
  catchError,
  count,
  delay,
  finalize,
  from,
  map,
  of,
  retry,
  tap,
  throwError,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'rxjs-error-handling';
  data: Product[] = [];
  loading: boolean = false;
  error: string | null = null;

  simulateHttpRequest() {
    // With timer
    // return timer(2000).pipe(map(() => this.data));

    const isSuccess = Math.random() > 0.5;

    // with of and delay
    return isSuccess
      ? of(products).pipe(delay(2000))
      : throwError(() => new Error('Http request failed'))
          .pipe(delay(2000))
          .pipe(
            tap(() => console.log('Initial request started')),
            retry({
              count: 3,
              resetOnSuccess: true,
              delay: (error, retryCount) => {
                console.log(
                  `Retry attempt #${retryCount} after error:`,
                  error.message
                );
                return of(error).pipe(delay(1000)); // Delay before retrying
              },
            }),
            tap({
              next: (data) =>
                console.log('Received successful response:', data), // Log successful responses
              error: (error) =>
                console.error('Error encountered:', error.message), // Log errors
            }),
            catchError((error) => {
              if (Math.random() > 0.5) {
                console.warn('Retries exhausted, providing fallback data.');
                return of([
                  {
                    id: 0,
                    category: 'Fallback',
                    name: 'Fallback Product',
                    price: 0,
                  },
                ]);
              } else {
                this.error = error.message;
                return throwError(() => error);
              }
            }),
            finalize(() => {
              this.loading = false;
            })
          );
  }

  fetchData() {
    this.loading = true;
    this.data = [];
    this.simulateHttpRequest().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
        this.error = null;
      },
      error: (error) => (this.error = error.message),
    });
  }
}
