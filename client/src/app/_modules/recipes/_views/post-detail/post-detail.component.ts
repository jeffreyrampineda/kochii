import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post!: Post;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getPostById(id);
    }
  }

  getPostById(id: string): void {
    this.loading = true;
    this.recipesService.getPostById(id).subscribe({
      next: (result) => {
        this.post = result;
      },
      error: () => {
        // Error
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
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
