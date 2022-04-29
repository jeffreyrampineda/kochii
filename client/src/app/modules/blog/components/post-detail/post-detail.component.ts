import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'kochii-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const post_id = this.route.snapshot.paramMap.get('id');
    this.getPostById(post_id);
  }

  getPostById(id: string): void {
    this.blogService.getPostById(id).subscribe({
      next: (result) => {
        console.log(result);
        this.post = result;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  toggleSaved(): void {
    this.post.saved = !this.post.saved;
    if (this.post.saved) {
      this.blogService.savePost(this.post);
    } else {
      this.blogService.unsavePost(this.post);
    }
  }
}
