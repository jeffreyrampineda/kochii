import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, tap } from 'rxjs';
import { Post } from '../interfaces/post';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogUrl = '/blog';
  private localSavedPosts: Post[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  getPosts(): Observable<Post[]> {
    const options = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };

    return this.http.get<Post[]>(this.blogUrl, options).pipe(
      tap((_) => this.log('fetched posts')),
      map((result) => {
        result.forEach((post) => {
          // Temporary for testing purpose
          post.saved = false;
          //---
          post.banner = this.sanitizer.bypassSecurityTrustUrl(
            'data:image/jpg;base64,' +
              this.convertArrayToBase64String(post.banner.data.data)
          );
          return post;
        });
        return result;
      })
    );
  }

  savePost(post: Post) {
    this.localSavedPosts.push(post);
  }

  unsavePost(post: Post) {
    //this.localPosts.filter(p => p._id != post._id);
  }

  getSavedPosts(): Post[] {
    return this.localSavedPosts;
  }

  getPostById(id: string): Observable<Post> {
    const options = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };

    return this.http.get<Post>(this.blogUrl + `/${id}`, options).pipe(
      tap((_) => this.log(`fetched post /w id=${id}`)),
      map((result) => {
        result.banner = this.sanitizer.bypassSecurityTrustUrl(
          'data:image/jpg;base64,' +
            this.convertArrayToBase64String(result.banner.data.data)
        );
        return result;
      })
    );
  }

  private convertArrayToBase64String(imageData: any): string {
    let TYPED_ARRAY = new Uint8Array(imageData);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);
    return base64String;
  }

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`BlogService: ${message}`);
  }
}
