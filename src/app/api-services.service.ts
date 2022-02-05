import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment  } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(private httpClient: HttpClient) { }
  

  //This is sync method, so use promise and resolve it instead of return and handle with .then() in calling place
  public getApiData(body: string){
    const url = environment.apiEndPoint + '/calculate'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.post(url,body).subscribe((data) =>{
        resolve( JSON.stringify(data));  
        //NOTE: Instead of return use resolve in promise (also change calling method)
      })
    })
  }

  public listExpiries(){
    const url = environment.apiEndPoint + '/expiries'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.get(url).subscribe((data) =>{
        resolve(JSON.parse(JSON.stringify(data)));  
      })
    })
  }

  public getNifytValue(){
    const url = environment.apiEndPoint + '/nifty'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.get(url).subscribe((data) =>{
        resolve(data);  
      })
    })
  }
  
  public getOptionForExpiry(body:string, strike:number[], ce:number[], pe: number[]){
    const url = environment.apiEndPoint + '/getexpiry'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.post(url,body).subscribe((data) =>{
        pe = JSON.parse(JSON.stringify(data)).PE
        ce = JSON.parse(JSON.stringify(data)).CE
        strike = JSON.parse(JSON.stringify(data)).STRIKE
        resolve({strike, ce, pe});  
      })
    })
  }
}

