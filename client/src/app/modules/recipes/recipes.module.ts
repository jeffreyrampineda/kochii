import { NgModule } from '@angular/core';

// Shared
import { SharedModule } from '../shared/shared.module';

// Views
import { RecipesRoutingModule } from './recipes-routing.module';
import { PostCreationsComponent } from './views/post-creations/post-creations.component';
import { PostCreationsEditComponent } from './views/post-creations-edit/post-creations-edit.component';
import { PostListComponent } from './views/post-list/post-list.component';
import { PostDetailComponent } from './views/post-detail/post-detail.component';
import { PostCookComponent } from './views/post-cook/post-cook.component';
import { CollectionsListComponent } from './views/collections-list/collections-list.component';

@NgModule({
  declarations: [
    PostListComponent,
    PostCreationsComponent,
    PostCreationsEditComponent,
    PostDetailComponent,
    PostCookComponent,
    CollectionsListComponent,
  ],
  imports: [SharedModule, RecipesRoutingModule],
})
export class RecipesModule {}
