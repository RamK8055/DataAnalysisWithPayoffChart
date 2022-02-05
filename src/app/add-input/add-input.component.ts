import { Component, OnInit } from '@angular/core';

import { ApiServicesService } from '../api-services.service';
import { ChartsService } from '../charts.service'

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})

export class AddInputComponent implements OnInit {
  
  expiryInDropDown: string[] = [];
  nifty: string = '';

  constructor(
    private apiService: ApiServicesService,
    private chartsService: ChartsService
  ) { }
  
  ngOnInit(): void {
    this.getlistExpiries();
    this.getNifty();
    //add validation to check price of option chain
  }

  //For option chain
  ce : number[] = []
  pe : number[] = []
  strike : number[] = []

  selectedExpiry: string = ''

  //List data for positions
  total: number = 0
  expiry: string[] = []
  lot: string[] = []
  pe_ce : string[] = []
  buy_sell: string[] = []
  strikeprice: number[] = []

  //Resultant data 
  margin: string = '';
  
  //For charting
  isLoading: boolean = false;
  options : any = this.chartsService.getChartData()
  testAns: string = ''

  //---- PAGE ON LOAD ---//
  // Getting option chain data
  getlistExpiries(){
    this.apiService.listExpiries().then((data)=>{
      this.expiryInDropDown = JSON.parse(JSON.stringify(data));
    })
  }

  getNifty(){
    this.apiService.getNifytValue().then((data)=>{
      this.nifty = JSON.stringify(data);
    })
  }

  //---- Expiry change in drop down ---//
  changeExpiry(event: any){
    this.selectedExpiry = event.target.value;
    this.apiService.getOptionForExpiry(event.target.value, this.strike, this.ce, this.pe)
      .then((data)=>{
        this.strike = JSON.parse(JSON.stringify(data)).strike;
        this.ce =  JSON.parse(JSON.stringify(data)).ce;
        this.pe =  JSON.parse(JSON.stringify(data)).pe;
      });
  }

  //--- Option chain activity ---//
  // Buy/Sell button on option chain
  positionAddorRemove(index:number,pe_ce:string,buy_sell:string){
    var selectedPeCe;
    if(pe_ce == 'PE')
    selectedPeCe = this.pe[index]
    else
    selectedPeCe = this.ce[index]
   

      this.expiry.push(this.selectedExpiry)
      this.strikeprice.push(this.strike[index])
      this.lot.push("1")
      this.pe_ce.push(pe_ce)
      this.buy_sell.push(buy_sell)
      this.total++


    console.log(pe_ce)
    console.log(buy_sell)
    console.log(this.selectedExpiry)
    console.log(this.strike[index])
    //add new input
    // trigger calc
  }
  
  //---- Capture required Data ---// TODO: will use these method??
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

  //--- FOR POSTION ---//
  range(){
    return new Array(this.total);
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
    this.expiry.push("exp")
    this.strikeprice.push(100)
    this.lot.push("2")
    this.pe_ce.push("CE")
    this.buy_sell.push("sell")
    this.total++
  }





}
