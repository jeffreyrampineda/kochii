import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Views
import { PostCreationsComponent } from './_views/post-creations/post-creations.component';
import { PostCreationsEditComponent } from './_views/post-creations-edit/post-creations-edit.component';
import { PostListComponent } from './_views/post-list/post-list.component';
import { PostDetailComponent } from './_views/post-detail/post-detail.component';
import { PostCookComponent } from './_views/post-cook/post-cook.component';
import { CollectionsListComponent } from './_views/collections-list/collections-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'creations', component: PostCreationsComponent },
  { path: 'creations/:id', component: PostCreationsEditComponent },
  { path: 'catalog', component: PostListComponent },
  { path: 'catalog/:id/cook', component: PostCookComponent },
  { path: 'catalog/:id', component: PostDetailComponent },
  { path: 'collections', component: CollectionsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
