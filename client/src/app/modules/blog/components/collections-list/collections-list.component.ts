import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'kochii-collections-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss'],
})
export class CollectionsListComponent implements OnInit {
  posts = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getSavedPosts();
  }

  getSavedPosts(): void {
    this.posts = this.blogService.getSavedPosts();
  }
}
