import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { RecipesRoutingModule } from './recipes-routing.module';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostCookComponent } from './components/post-cook/post-cook.component';
import { CollectionsListComponent } from './components/collections-list/collections-list.component';

@NgModule({
  declarations: [
    PostListComponent,
    PostDetailComponent,
    PostCookComponent,
    CollectionsListComponent,
  ],
  imports: [SharedModule, RecipesRoutingModule],
})
export class RecipesModule {}
