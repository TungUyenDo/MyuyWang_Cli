import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable()
export class FaqService {

 
  constructor(private apiService:ApiService) { }

  getListFAQ(): any{
  	return this.apiService.getListFAQ();
  }

  updateFAQ(param , type , id): any{
    let newValue ={};
    if(type){
      newValue = { 
        question: {
          en: param.question.en,
          cn: param.question.cn
        },
        answer: {
          en: param.answer.en,
          cn: param.answer.cn
        },
        action: "create"
      };
      if(type == "edit"){
        newValue["action"] = "update";
        newValue["id"] = id;
      }
    }else{
      newValue= {
        action:"delete",
        id:id
      }
    }
    
    
  	return this.apiService.updateFAQ(newValue);
  }
}
