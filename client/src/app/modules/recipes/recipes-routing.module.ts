import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Views
import { PostListComponent } from './views/post-list/post-list.component';
import { PostDetailComponent } from './views/post-detail/post-detail.component';
import { PostCookComponent } from './views/post-cook/post-cook.component';
import { CollectionsListComponent } from './views/collections-list/collections-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
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
