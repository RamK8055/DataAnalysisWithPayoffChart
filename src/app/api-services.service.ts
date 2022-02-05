import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment  } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(private httpClient: HttpClient) { }
  

  //This is sync method, so use promise and resolve it instead of return and handle with .then() in calling place
  public getOptionChainData(){
    const url = environment.apiEndPoint + '/optionchain'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.get(url).subscribe((data) =>{
        console.log(data)
        resolve(JSON.stringify(data));  
        //NOTE: Instead of return use resolve in promise (also change calling method)
      })
    })
  }

  public getApiData(body: string){
    const url = environment.apiEndPoint + '/calculate'
    return new Promise((resolve, reject) =>{
      var result = this.httpClient.post(url,body).subscribe((data) =>{
        console.log(data)
        resolve( JSON.stringify(data));  
      })
    })
  }

  
}

