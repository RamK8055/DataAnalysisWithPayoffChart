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
  optionChainStrike : number[] = []

  selectedExpiry: string = ''

  //List data for positions
  total: number = 0
  expiry: string[] = []
  lot: number[] = []
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

  //Changeing expiry in dropdown change the option chain
  changeExpiry(event: any){
    this.selectedExpiry = event.target.value;
    this.apiService.getOptionForExpiry(event.target.value, this.optionChainStrike, this.ce, this.pe)
      .then((data)=>{
        this.optionChainStrike = JSON.parse(JSON.stringify(data)).strike;
        this.ce =  JSON.parse(JSON.stringify(data)).ce;
        this.pe =  JSON.parse(JSON.stringify(data)).pe;
      });
  }


  //--- Option chain activity ---//

  // Buy/Sell button on option chain
  positionAddorRemove(index:number,pe_ce:string,buy_sell:string){
    var selectedPeCe;
    var premium;
    if(pe_ce == 'PE'){
      selectedPeCe = 'PE'
      premium = this.pe[index]
    }
    else{
      selectedPeCe = 'CE'
      premium = this.ce[index]
    }

    if(premium!=0){ // Don't add 0 value premium

      //BUG? or remove below conosle.logs()
      this.expiry.push(this.selectedExpiry)
      this.strikeprice.push(this.optionChainStrike[index])
      this.lot.push(1)  //Default lot is 1
      //TODO: need to check this lot on buy/sell conflict??
    this.pe_ce.push(pe_ce)
    this.buy_sell.push(buy_sell)
    this.total++

    console.log(this.optionChainStrike)
    console.log(this.strikeprice)
    console.log(pe_ce)
    console.log(buy_sell)
    console.log(this.selectedExpiry)
    console.log(this.optionChainStrike[index])
    
    //TODO: call Calculation method
    }
    
  }
  

  //---- Functions for Positions ---//

  //Enable or disable the checkbox (don't delete but should not include)
  changeOnCheckBox(){
    //TODO: call Calculation method
  }

  //Change perticular positon's expiry
  changePositionExpiry(event: any,index: number){
    this.expiry[index] = event.target.value
    //TODO: call Calculation method
  }

  //Decrease the strike price
  reduceStrike(index: number){
    this.strikeprice[index] -= 50
    //BUG: in this method
    //TODO: call Calculation method   // this.getApiData()
  }

  //Increase the strike price
  increaseStrike(index: number){
    this.strikeprice[index] = 50 + parseInt(this.strikeprice+"") 
    //BUG: in this method
    //TODO: call Calculation method   // this.getApiData()
  }

  //Change Position's type (PE/CE)
  changePositionType(index:number){
    this.pe_ce[index] = (this.pe_ce[index]=='PE'?"CE":'PE')
    //TODO: call Calculation method
  }

  //Decrease Lot
  reduceLot(index: number){
    //TODO; check 0-5
    if(this.lot[index]>1)
      this.lot[index] -= 1
    //BUG: in this method
    //TODO: call Calculation method   // this.getApiData()
  }

  //Increase Lot
  increaseLot(index: number){
    if(this.lot[index]<5)
      this.lot[index] = 1 + this.lot[index]
    //BUG: in this method
    //TODO: call Calculation method    // this.getApiData()
  }

  //Change Buy/Sell type
  changePositionBuySell(index:number){
    this.buy_sell[index] = (this.buy_sell[index]=='BUY'?"SELL":'BUY')
    //TODO: call Calculation method
  }

  //Delete position (row)
  deletePosition(index: number){
    console.log(index)
    console.log("Before:")
    console.log(this.expiry)
    this.expiry = this.expiry.splice(index, 1)
    console.log("Afer:")
    console.log(this.expiry)
 
    //BUG:
    console.log(this.strikeprice)
      this.strikeprice = this.strikeprice.splice(index, 1)
    console.log(this.strikeprice)

      this.lot.splice(index, 1)
      this.pe_ce.splice(index, 1)
      this.buy_sell.splice(index, 1)
      this.total--;
    //TODO: call Calculation method
      
  }


  // Common functions for Positions table

  // Clear all positions
  clearAllPositions(){
    this.total = 0;
    this.expiry= []
    this.lot = []
    this.pe_ce = []
    this.buy_sell = []
    this.strikeprice = []
    //TODO: Reset calculation method
  }

  // Example for event call in input change
  expectedProfit(event: any){ 
    //TODO: use same like this method and remove this
    var selectedValue = event.target.value;
  }



















  //---- Capture required Data ---// TODO: will use these method??
 
  getApiData(){

    //Do validation if LTP of ce/pe is zero *******

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


  addTest(){
    this.expiry.push("exp")
    this.strikeprice.push(100)
    this.lot.push(2)
    this.pe_ce.push("CE")
    this.buy_sell.push("SELL")
    this.total++
  }





}
