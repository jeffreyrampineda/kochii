import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, tap } from 'rxjs';
import { Post } from '../interfaces/post';
import { PostCollection } from '../interfaces/postcollection';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipesUrl = '/recipes';
  private collectionUrl = '/api/collection';

  private options = {
    headers: new HttpHeaders({ Accept: 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.recipesUrl, this.options).pipe(
      tap((_) => this.log('fetched posts')),
      map((result) => {
        result.forEach((post) => {
          post.banner = this.sanitizer.bypassSecurityTrustUrl(
            'data:image/jpg;base64,' + post.banner.data
            //this.convertArrayToBase64String(post.banner.data.data)
          );
          return post;
        });
        return result;
      })
    );
  }

  createPostCollection(id: string): Observable<any> {
    return this.http
      .post<any>(`${this.collectionUrl}/${id}`, null, this.options)
      .pipe(tap((_) => this.log('creating postCollection')));
  }

  deletePostCollection(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.collectionUrl}/${id}`, this.options)
      .pipe(tap((_) => this.log('deleting postCollection')));
  }

  getPostCollection(): Observable<PostCollection> {
    return this.http.get<PostCollection>(this.collectionUrl, this.options).pipe(
      tap((_) => this.log('fetched postCollection')),
      map((result) => {
        result.posts.forEach((post) => {
          post.banner = this.sanitizer.bypassSecurityTrustUrl(
            'data:image/jpg;base64,' + post.banner.data
            //this.convertArrayToBase64String(post.banner.data.data)
          );
          return post;
        });
        return result;
      })
    );
  }

  getPostById(id: string): Observable<Post> {
    const options = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.get<Post>(`/api/recipes/${id}`, options).pipe(
      tap((_) => this.log(`fetched post /w id=${id}`)),
      map((result) => {
        result.banner = this.sanitizer.bypassSecurityTrustUrl(
          'data:image/jpg;base64,' + result.banner.data
          //this.convertArrayToBase64String(result.banner.data.data)
        );
        return result;
      })
    );
  }

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`RecipesService: ${message}`);
  }
}
