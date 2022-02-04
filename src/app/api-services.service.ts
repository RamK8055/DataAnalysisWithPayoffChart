import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(private httpClient: HttpClient) { }
  
  ans: string = ''

  //NOTE:
  public syncMethod(){
    return new Promise((resolve, reject) =>{
        this.sleep()
        resolve("sync  in method");
    })
  }

  //NOTE:
  public asyncMethod(){
    return "aync in  methood";
  }

  public sleep(){
    return new Promise((resolve, reject) =>{
     setTimeout(resolve, 15000)
    })
  }








  public getApiData(body: string){
    const url = 'http://127.0.0.1:5000/calculate'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.post(url,body).subscribe((data) =>{
        console.log(data)
        this.ans = JSON.stringify(data)
        resolve(this.ans);  //NOTE: Instead of return use resolve in promise (also change calling method)
      })

    })
  }

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

