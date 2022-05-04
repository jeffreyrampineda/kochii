import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'kochii-post-detail',
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    this.getPostById(this.route.snapshot.paramMap.get('id'));
  }

  getPostById(id: string): void {
    this.recipesService.getPostById(id).subscribe({
      next: (result) => {
        this.post = result;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  createPostCollection(id: string): void {
    this.post.saved = true;
    this.recipesService.createPostCollection(id).subscribe();
  }

  deletePostCollection(id: string): void {
    this.post.saved = false;
    this.recipesService.deletePostCollection(id).subscribe();
  }
}
