import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable()
export class CategoryService {

  constructor(private apiService:ApiService) {}

  getListCategory(): any{
  	return this.apiService.getListCategory();
  }

  createCategory(data): any{
    if(!data.title.cn){
      data.title.cn = " ";
    }
    if(!data.description.cn){
      data.description.cn = " ";
    }

    return this.apiService.createCategory(data);
  }

  updateCategory(data): any{
    return this.apiService.updateCategory(data);
  }

  videoscategoryPromise():any{
    return this.apiService.videoscategoryPromise();
  }

}
