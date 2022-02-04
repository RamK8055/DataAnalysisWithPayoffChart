import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from '../api-services.service';

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})
export class AddInputComponent implements OnInit {

  
  margin: string = '';
  
  
  expiry: string[] = []
  lot: string[] = []
  strikeprice: number[] = []
  pe_ce : string[] = []
  buy_sell: string[] = []

  total: number = 0

  
  isLoading: boolean = false;
  options : any = this.apiService.getChartData()

  
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



  getExpiry(event: any, index: number){
    this.expiry[index] = event.target.value

  }
  getStrike(event: any, index: number){
    this.strikeprice[index] = event.target.value
  }
  
  reduceStrike(index: number){
    this.strikeprice[index] -=50
    this.getApiData()

  }

  increaseStrike(index: number){
    this.strikeprice[index] = 50 +parseInt(this.strikeprice+"") 
    this.getApiData()

  }

  getPeCe(event: any, index: number){
    this.pe_ce[index] = event.target.value
  }

  getLot(event: any, index: number){
    this.lot[index] = event.target.value
  }

  getBuySell(event: any, index: number){
    this.buy_sell[index] = event.target.value
  }

  getApiData(){
    var body = this.pe_ce+ " " + this.strikeprice + " " + this.lot;
    // this.apiService.getApiData(body)
    //   .then((data)=>
    //   { 
    //     this.margin = JSON.stringify(data)
    //   });

    // console.log(this.pe_ce+ " " + this.strikeprice + " " + this.lot)
  }


  createRange(){
    var items: number[] = [];
    for(var i = 1; i <= this.total; i++){
      items.push(i);
    }
    return items;

    // return ['1','2','3'];
  }

  addPosition(){
    if(this.total==0 || (this.expiry[this.total-1] 
      && this.strikeprice[this.total-1]
      && this.lot[this.total-1]
      && this.pe_ce[this.total-1]
      && this.buy_sell[this.total-1])){
        this.total++
      }
      else{
        console.log("Fill all values")
      }
  }

  isSelectedRow(index: number){

  }

  deleteRow(index: number){

  }
  addTest(){
    console.log(this.expiry)
    this.expiry.push("exp")
    this.strikeprice.push(100)
    this.lot.push("2")
    this.pe_ce.push("CE")
    this.buy_sell.push("sell")
    this.total++
  }
  optionChain(){
    var items: number[] = [];
    for(var i = 1; i <= 10; i++){
      items.push(i*100);
    }
    return items;
  }

  positionAdd(index:number,pe_ce:string,buy_sell:string){
    console.log(index)
    console.log(pe_ce)
    console.log(buy_sell)
    //add new input
    // trigger calc
  }



}
