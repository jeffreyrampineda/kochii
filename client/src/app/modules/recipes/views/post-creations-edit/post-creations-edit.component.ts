import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'kochii-post-creations-edit',
  templateUrl: './post-creations-edit.component.html',
})
export class PostCreationsEditComponent implements OnInit {
  postForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == 'create') {
      // Create empty PostForm.
      this.createPostForm();
    } else {
      this.getPostById(this.route.snapshot.paramMap.get('id'));
    }
  }

  getPostById(id: string): void {
    this.recipesService.getPostById(id).subscribe({
      next: (result: Post) => {
        // Create PostForm and set values to result.
        this.createPostForm(result);
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  createPostForm(postFormData?: Post): void {
    this.postForm = this.formBuilder.group({
      _id: { value: postFormData?._id ?? undefined, disabled: true },
      title: [postFormData?.title ?? '', [Validators.required]],
      //tags: { value: [''], disabled: true },
      cooking_time: [postFormData?.cooking_time ?? ''],
      prep_time: [postFormData?.prep_time ?? ''],
      calories: [postFormData?.calories ?? ''],
      servings: [postFormData?.servings ?? ''],
      ingredients: this.formBuilder.array([]),
      instructions: this.formBuilder.array([]),
      summary: [postFormData?.summary ?? ''],
      //banner: [result.banner],
    });

    if (postFormData?.ingredients.length > 0) {
      postFormData.ingredients.forEach((ingredient) => {
        this.addIngredient(
          ingredient.name,
          ingredient.quantity,
          ingredient.unit_of_measurement,
          ingredient.description
        );
      });
    }

    if (postFormData?.instructions.length > 0) {
      postFormData.instructions.forEach((instruction) => {
        this.addInstruction(instruction.description);
      });
    }
  }

  // Ingredients

  get ingredients() {
    return this.postForm.controls['ingredients'] as FormArray;
  }

  addIngredient(
    name: string = '',
    quantity: number = 0,
    unit_of_measurement: string = '',
    description: string = ''
  ) {
    const ingredientForm = this.formBuilder.group({
      name: [name],
      quantity: [quantity],
      unit_of_measurement: [unit_of_measurement],
      description: [description],
    });
    this.ingredients.push(ingredientForm);
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // Instructions

  get instructions() {
    return this.postForm.controls['instructions'] as FormArray;
  }

  addInstruction(description: string = '') {
    const instructionForm = this.formBuilder.group({
      description: [description],
    });
    this.instructions.push(instructionForm);
  }

  deleteInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  // Actions

  onSave(): void {
    this.recipesService.savePost(this.postForm.getRawValue()).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['recipes/creations']);
        }
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  onDelete(): void {
    this.recipesService.deletePost(this.postForm.get('_id').value).subscribe({
      next: (result) => {
        if (result && result.success) {
          this.router.navigate(['recipes/creations']);
        }
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
