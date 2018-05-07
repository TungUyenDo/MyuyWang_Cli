import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable()
export class StaticArticleService {

  constructor(private apiService:ApiService) { }

  getListStaticArticle(): any{
  	return this.apiService.getListStaticArticle();
  }

  updateStaticArticle(param): any{
  	return this.apiService.updateStaticArticle(param);
  }

  createStaticArticle(param): any{
    return this.apiService.createStaticArticle(param);
  }

  deleteStaticArticle(param): any{
    return this.apiService.deleteStaticArticle(param);
  }
}
