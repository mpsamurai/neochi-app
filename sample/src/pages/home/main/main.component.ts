import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ConfigPageComponent } from '../conf/conf.component';

// import { NeochiRedisServiceProvider } from '../../providers/neochi-redis-service/neochi-redis-service';
@Component({
  selector: 'page-home-main',
  templateUrl: 'main.component.html'
})
export class HomePageComponet implements OnInit {
  @ViewChild('lineCanvas')
  lineCanvas;
  lineChart: any;
  constructor(public navCtrl: NavController) {
  }
  onSetting() {
    this.navCtrl.push(ConfigPageComponent, {home: ""});
  }
  ngOnInit() {
    this.lineChartMethod();
  }
  // Grapsh 1
  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am'],
        datasets: [
          {
            label: '1: 順也',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50],
            spanGaps: false,
          },
          {
            label: '2: 航',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(192,192,75,0.4)',
            borderColor: 'rgba(192,192,75,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(192,192,75,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(192,192,75,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 25, 70, 66, 70, 85, 30, 25, 10],
            spanGaps: false,
          }
        ]
      }
    });
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }
}
