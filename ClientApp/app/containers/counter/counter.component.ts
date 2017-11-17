import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit, OnDestroy {
    public currentCount = 0;
    public ticks: number;

    private timer: Observable<any>;
    private timerSub: Subscription;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.startTimer(10);
        }
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            this.timerSub.unsubscribe();
        }
    }

    public incrementCounter() {
        this.currentCount++;
    }

    private startTimer(seconds: number = 10) {
        this.ticks = seconds;
        this.timer = Observable.timer(1000, 1000)
            .timeInterval()
            .pluck('value')
            .take(seconds);
        if (this.timerSub) this.timerSub.unsubscribe();
        this.timerSub = this.timer.subscribe(t => {
            console.log('Timer', t);
            if (t >= seconds - 1) {
                this.incrementCounter();
                this.startTimer(seconds);
            } else {
                this.ticks--;
            }
        }, (err) => console.error('Timer error', err));
    }
}
