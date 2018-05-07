import { Component, OnInit } from '@angular/core';
import {TagService} from "../tag.service";


@Component({
  selector: 'list-tag',
  templateUrl: './list-tag.component.html',
  styleUrls: ['./list-tag.component.scss']
})
export class ListTagComponent implements OnInit{
  listTag;
  selectedTag;
 openCreateTagSection = false;
  createTagTitle;

  constructor(private tSvs: TagService) {}

  ngOnInit() {
    this.tSvs.getListTag().subscribe(
      res => this.listTag = res,
      err => console.log(err)
    )
  }

  onDeleteTag(tag) {
    this.tSvs.deleteTag(tag.id).subscribe(
      res => this.listTag.splice(this.listTag.indexOf(tag), 1),
      err => console.log(err)
    )
  }

  onCreateTag() {
    this.tSvs.createTag(this.createTagTitle).subscribe(
      res => {
        this.listTag.push(res);
        this.openCreateTagSection = false
      },
      err => console.log(err)
    );
  }

}
