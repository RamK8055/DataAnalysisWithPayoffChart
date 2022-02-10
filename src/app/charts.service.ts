import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor() { }

  public getChartDataForSelectedPositions(strike: number[], total : number[]){
    // console.log("dddd")

    // console.log(strike)
    // console.log(total)
    // console.log("dddd")
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['total']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: strike
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'total',
          type: 'line',
          stack: 'counts',
          areaStyle: { normal: {} },
          data: total
        }
      ]
    };
  
  }
  //Will clean up this service at the end
  public getChartData(){
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['X-1', 'X-2']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'X-1',
          type: 'line',
          stack: 'counts',
          areaStyle: { normal: {} },
          data: [-100, -40, 0, 0, 0, 0, -50]
        },
        {
          name: 'X-2',
          type: 'line',
          stack: 'counts',
          areaStyle: { normal: {} },
          data: [0, 0, 0, 100, 100, 0 , 0]
        }
      ]
    };
  }
}
