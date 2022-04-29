import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'kochii-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.blogService.getPosts().subscribe({
      next: (result) => {
        this.posts = result;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
