import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/post';
import { AccountService } from 'src/app/services/account.service';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-post-creations',
  templateUrl: './post-creations.component.html',
})
export class PostCreationsComponent implements OnInit {
  posts: Post[] = [];

  constructor(
    private recipesService: RecipesService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.recipesService
      .getPosts(this.accountService.currentAccountValue.username)
      .subscribe({
        next: (result) => {
          this.posts = result;
        },
        error: () => {},
        complete: () => {},
      });
  }
}
