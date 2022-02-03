import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from '../api-services.service';

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})
export class AddInputComponent implements OnInit {

  
  margin: string = '';
  
  
  expiry: string = ''
  lot: string = '1'
  strikeprice: number = 18000
  pe_ce : string ='PE'
  buy_sell: string = 'sell'


  constructor(private apiService: ApiServicesService) { }


  ngOnInit(): void {
  }


  //NOTE: This method is just for learning purpose
  syncAndAsync(){
    this.apiService.syncMethod().then((data)=>{ 
        /* Setting value here */ 
        var a = data; 
        console.log(a)
    });
    console.log("after sync")
    var b = this.apiService.asyncMethod()
    console.log(b)
    console.log("after aync")
  }



  getExpiry(event: any){
    this.expiry = event.target.value

  }
  getStrike(event: any){
    this.strikeprice = event.target.value
  }
  
  reduceStrike(){
    this.strikeprice -=50
    this.getApiData()

  }

  increaseStrike(){
    this.strikeprice = 50 +parseInt(this.strikeprice+"") 
    this.getApiData()

  }

  getPeCe(event: any){
    this.pe_ce = event.target.value
  }

  getLot(event: any){
    this.lot = event.target.value
  }

  getBuySell(event: any){
    this.buy_sell = event.target.value
  }

  getApiData(){
    var body = this.pe_ce+ " " + this.strikeprice + " " + this.lot;
    this.apiService.getApiData(body).then((data)=>{ this.margin = JSON.stringify(data)});

    // console.log(this.pe_ce+ " " + this.strikeprice + " " + this.lot)
  }

}
