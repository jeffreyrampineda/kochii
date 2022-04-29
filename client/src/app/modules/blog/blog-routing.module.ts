import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostCookComponent } from './components/post-cook/post-cook.component';
import { CollectionsListComponent } from './components/collections-list/collections-list.component';

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
export class BlogRoutingModule {}
