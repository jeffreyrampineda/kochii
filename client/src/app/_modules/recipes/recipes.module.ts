import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RecipesRoutingModule } from './recipes-routing.module';

// Views
import { PostCreationsComponent } from './_views/post-creations/post-creations.component';
import { PostCreationsEditComponent } from './_views/post-creations-edit/post-creations-edit.component';
import { PostListComponent } from './_views/post-list/post-list.component';
import { PostDetailComponent } from './_views/post-detail/post-detail.component';
import { PostCookComponent } from './_views/post-cook/post-cook.component';
import { CollectionsListComponent } from './_views/collections-list/collections-list.component';

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
