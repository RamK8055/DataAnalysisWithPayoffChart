import { Component, OnInit } from '@angular/core';

import { ApiServicesService } from '../api-services.service';
import { ChartsService } from '../charts.service'
import { interval } from 'rxjs';  //For auto call method in every 'n' seconds

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})

export class AddInputComponent implements OnInit {
  
  expiryInDropDown: string[] = [];
  nifty: string = '';
  position_size : number = 50;

  constructor(
    private apiService: ApiServicesService,
    private chartsService: ChartsService
  ) { }
  
  ngOnInit(): void {
    this.getlistExpiries();
    this.getNifty();
    //TODO: add validation to check price of option chain
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
  checked: boolean[] = []
  max_profit: string[] = []
  max_loss: string[] = []
  isDuplicate: boolean[] = []

  //Resultant data 
  margin: string = '';
  
  //For charting
  isLoading: boolean = false;
  options : any = this.chartsService.getChartData()
  testAns: string = ''

  //Update Option Chain every 2 min in Backend
  mySubscription= interval(2 * 60 * 1000).subscribe((x =>{
    console.log("Updating Option Chain")
    // TODO: call update method   '/updateoptionchain'
    this.getNifty();
  }));


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
    this.refreshCurrentExpiry()
  }

  //Refreshing the current expiry
  refreshCurrentExpiry(){
    this.apiService.getOptionForExpiry(this.selectedExpiry, this.optionChainStrike, this.ce, this.pe)
    .then((data)=>{
      this.optionChainStrike = JSON.parse(JSON.stringify(data)).strike;
      this.ce =  JSON.parse(JSON.stringify(data)).ce;
      this.pe =  JSON.parse(JSON.stringify(data)).pe;
    });
  }


  //--- Option chain activity ---//

  // Buy/Sell button on option chain
  positionAddFromOC(index:number,pe_ce:string,buy_sell:string){
    //TODO: move belwo all codes (in all funcition to serice class)
    var selectedPeCe;
    var premium;
    if(pe_ce == 'PE'){
      selectedPeCe = 'PE'
      premium = this.pe[index]
      
      //TODO: Remove PL calculation here and move to backend 
      /*
      if(buy_sell == 'BUY'){
        this.max_profit.push("-")
        this.max_loss.push(Math.round(premium * this.position_size)+"")
      }
      else{
        this.max_loss.push("-")
        this.max_profit.push(Math.round(premium * this.position_size)+"")
      }
      */
    }
    else{
      selectedPeCe = 'CE'
      premium = this.ce[index]
      /*
      if(buy_sell == 'BUY'){
        this.max_profit.push("-")
        this.max_loss.push((premium * this.position_size)+"")
      }
      else{
        this.max_loss.push("-")
        this.max_profit.push((premium * this.position_size)+"")
      }
      */
    }

    if(premium!=0){ 
      // Don't add 0 value premium
      var i = this.total;

      this.expiry.push(this.selectedExpiry)
      this.strikeprice.push(this.optionChainStrike[index])
      this.lot.push(1)  //Default lot is 1
      this.pe_ce.push(pe_ce)
      this.buy_sell.push(buy_sell)
      this.checked.push(true)
      this.max_profit.push('')
      this.max_loss.push('')
      this.isDuplicate.push(false)
      this.total++
      
      this.validateDuplicatePositions()
      this.doCalculations(i) 
    }
    
  }
  

  //---- Functions for Positions ---//

  //Count of data in position table
  range(){
    return new Array(this.total);
  }

  //Enable or disable the checkbox (don't delete but should not include: logic in backend)
  isCheckBoxEnable(index:number){
    if(this.checked[index])
      this.checked[index] = false;
    else
      this.checked[index] = true;
    
    this.doCalculations(-1) //No need of doing PL

  }

  //Change perticular positon's expiry
  changePositionExpiry(event: any,index: number){
    this.expiry[index] = event.target.value
    this.validateDuplicatePositions()
    this.doCalculations(index)
  }

  //Decrease the strike price
  reduceStrike(index: number){
    this.strikeprice[index] -= 50
    this.validateDuplicatePositions()
    this.doCalculations(index)
  }

  //Increase the strike price
  increaseStrike(index: number){
    this.strikeprice[index] = 50 + parseInt(this.strikeprice[index]+"") 
    this.validateDuplicatePositions()
    this.doCalculations(index)
  }

  //Change Position's type (PE/CE)
  changePositionType(index:number){
    this.pe_ce[index] = (this.pe_ce[index]=='PE'?"CE":'PE')
    this.validateDuplicatePositions()
    this.doCalculations(index)
  }

  //Decrease Lot
  reduceLot(index: number){
    if(this.lot[index]>1){
      this.lot[index] -= 1
      this.doCalculations(index)
    }
  }

  //Increase Lot
  increaseLot(index: number){
    if(this.lot[index]<5){
      this.lot[index] = 1 + this.lot[index]
      this.doCalculations(index)
    }
  }

  //Change Buy/Sell type
  changePositionBuySell(index:number){
    this.buy_sell[index] = (this.buy_sell[index]=='BUY'?"SELL":'BUY')
    this.doCalculations(index)
  }

  //Delete position (row)
  deletePosition(index: number){
    this.expiry.splice(index, 1)
    this.strikeprice.splice(index, 1)
    this.checked.splice(index, 1)
    this.lot.splice(index, 1)
    this.pe_ce.splice(index, 1)
    this.buy_sell.splice(index, 1)
    this.max_profit.splice(index, 1)
    this.max_loss.splice(index, 1)
    this.isDuplicate.splice(index,1)

    this.total--;
      
    this.validateDuplicatePositions()
    this.doCalculations(-1)
  }

  //Validate and list all duplicate position's index
  validateDuplicatePositions(){
    //Inner method to get dupliacate map
    function getDuplicates<T>(input: T[]): Map<T, number[]> {
      return input.reduce((output, element, idx) => {
          const recordedDuplicates = output.get(element);
          if (recordedDuplicates) {
              output.set(element, [...recordedDuplicates, idx]);
          } else if (input.lastIndexOf(element) !== idx) {
              output.set(element, [idx]);
          }
  
          return output;
      }, new Map<T, number[]>());
    }

    var combined_position = [];
    for(let i = 0; i< this.total ; i++){
      combined_position.push(this.expiry[i]+" "+this.strikeprice[i]+" "+this.pe_ce[i])
    }

    var dupliacate_map = getDuplicates(combined_position)
    var duplicate_index: any[] = []

    dupliacate_map.forEach((value, key, map)=>{
      duplicate_index = [... duplicate_index, ...value] //appending
    });

    console.log(duplicate_index)
    // for(let i:number = 0 ; i < this.total ; i ++){
    //     if( duplicate_index .includes[i]){
    //       this.isDuplicate[i] = true
    //     }
    //     else{
    //       this.isDuplicate[i] = false
    //     }
    // }
   
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
    this.max_profit = []
    this.max_loss = []
    this.checked = []
    this.isDuplicate = []
    //TODO: Reset calculation method
  }

  // Example for event call in input change
  expectedProfit(event: any){ 
    //TODO: use same like this method and remove this
    var selectedValue = event.target.value;
  }



 




  //--- Calculations Part ---//

  //Call required calculations
  doCalculations(index: number){

    //1. calculatge margin & PL in single method
    // args: max_profit[index], max_loss[index] = [expiry[index], strike[index], pe_ce[index], lot[index], buy_sell[index]] | condition:[if index!=-1]
    this.calculateMargin();
  }

  calculateMargin(){
    console.log("===================================================")
    console.log(this.checked)
    console.log(this.expiry)
    console.log(this.lot)
    console.log(this.pe_ce)
    console.log(this.buy_sell)
    console.log(this.strikeprice)
    console.log(this.max_profit)
    console.log(this.max_loss)
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

  addExistingPosition(){

  }



}
