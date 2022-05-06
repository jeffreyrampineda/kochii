import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'kochii-post-creations',
  templateUrl: './post-creations.component.html',
})
export class PostCreationsComponent implements OnInit {
  posts = [];

  constructor(
    private recipesService: RecipesService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.recipesService
      .getPosts(this.accountService.currentAccountValue.accountName)
      .subscribe({
        next: (result) => {
          this.posts = result;
        },
        error: (err) => {},
        complete: () => {},
      });
  }
}
