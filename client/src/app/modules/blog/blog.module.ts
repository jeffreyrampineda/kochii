import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { AppMaterialModule } from '../../app-material.module';
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
  imports: [CommonModule, BlogRoutingModule, AppMaterialModule],
})
export class BlogModule {}
