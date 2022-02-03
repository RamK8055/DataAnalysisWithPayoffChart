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
}

