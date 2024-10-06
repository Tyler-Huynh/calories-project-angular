import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { USDAApiService } from '../api/USDAapi.service';
import { Serializable } from 'child_process';
import { DOCUMENT } from '@angular/common';

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface Meal{
  foodItem: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fiber: number;
  sugars: number;
}

@Component({
  selector: 'app-calorie-tracker',
  templateUrl: './calorie-tracker.component.html',
  styleUrl: './calorie-tracker.component.scss'
})

export class CalorieTrackerComponent {
  form: FormGroup = new FormGroup({
    foodItem: new FormControl(""),
    mealType: new FormControl("breakfast"),
    calories: new FormControl({value: 0, disabled: true}),
    proteins: new FormControl({value: 0, disabled: true}),
    fats: new FormControl({value: 0, disabled: true}),
    carbs: new FormControl({value: 0, disabled: true}),
    fiber: new FormControl({value: 0, disabled: true}),
    sugars: new FormControl({value: 0, disabled: true}),
  });

  @ViewChild("boxTopper") boxTopperRef!: ElementRef;
  @ViewChild("titleBar") titleBarRef!: ElementRef;

  position: { x: number, y: number } = { x: 100, y: 100 };

  size: { w: number, h: number } = { w: 200, h: 200 };

  lastPosition: { x: number, y: number } = { x: 100, y: 100 };

  lastSize: { w: number, h: number } = { w: 200, h: 200 };

  minSize: { w: number, h: number } = { w: 200, h: 200 };


  foodList: any[] = [];
  meals: {[key in MealType]: Meal[]} = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  totalCalories: number = 0;
  totalProteins: number = 0;
  totalFats: number = 0;
  totalCarbs: number = 0;
  totalFiber: number = 0;
  totalSugars: number = 0;

  selectedTab: MealType = "breakfast";

  constructor(
    private usdaApiService: USDAApiService,
    @Inject(DOCUMENT) private _document: Document,
    private _el: ElementRef
  ){} //creating a api var to use with the searchfood one, this also has our moving windows constructor

  ngOnInit(): void {
    console.log("IT WORKS!");
  }

  searchFood(): void {
    const foodItem = this.form.get("foodItem")?.value;
    if(foodItem){
      this.usdaApiService.searchFood(foodItem).subscribe((response) => {
        console.log("API WORKS!", response);
        if(response.foods.length > 0){
          this.onFoodSelect(response.foods[0]);
          console.log("FOOD ITEM", response.food);
        }else{
          console.error("NO WORKY");
        }
      })
    }
  }

  getNutrientValue(nutrients: any[], nutrientName: string): number {
    const nutrient = nutrients.find((nutrient: any) => nutrient.nutrientName === nutrientName);
    return nutrient ? nutrient.value: 0;
  }

  onFoodSelect(food: any): void {
    const nutrients = food.foodNutrients;
    const calories = this.getNutrientValue(nutrients, "Energy");
    const proteins = this.getNutrientValue(nutrients, "Protein");
    const fats = this.getNutrientValue(nutrients, "Total lipid (fat)");
    const carbs = this.getNutrientValue(nutrients, "Carbohydrate, by difference");
    const fiber = this.getNutrientValue(nutrients, "Fiber, total dietary");
    const sugars = this.getNutrientValue(nutrients, "Total Sugars");

    this.form.patchValue({ //patch value basically is used to update forms with the new values from the api
      calories: calories,
      fats: fats,
      proteins: proteins,
      carbs: carbs,
      fiber: fiber,
      sugars: sugars
    });
  }

  calculateTotalNutrition(){
    this.totalCalories = 0; 
    this.totalProteins = 0;
    this.totalFats = 0;
    this.totalCarbs = 0;
    this.totalFiber = 0;
    this.totalSugars = 0;
    
    for (const mealType in this.meals){ //iterating over the dictionary to get the total values of the nutrition from the api 
      this.meals[mealType as MealType].forEach(meal => { 
        this.totalCalories += meal.calories; //adding it all up to get the total amount for the day
        this.totalProteins += meal.proteins;
        this.totalFats += meal.fats;
        this.totalCarbs += meal.carbs;
        this.totalFiber += meal.fiber;
        this.totalSugars += meal.sugars;
      })
    }
    
  }

  storeNutritionData(){
    const mealType: MealType = this.form.get("mealType")?.value || "breakfast";
    const foodItem = this.form.get("foodItem")?.value;
    const calories = this.form.get("calories")?.value;
    const proteins = this.form.get("proteins")?.value;
    const fats = this.form.get("fats")?.value;
    const carbs = this.form.get("carbs")?.value;
    const fiber = this.form.get("fiber")?.value;
    const sugars = this.form.get("sugars")?.value;

    const meal: Meal = {
      foodItem: foodItem,
      calories: calories,
      proteins: proteins,
      fats: fats,
      carbs: carbs,
      fiber: fiber,
      sugars: sugars
    };

    this.meals[mealType].push(meal);
    this.calculateTotalNutrition();
    this.form.reset();
  }

  switchTab(tab: MealType): void{
    this.selectedTab = tab;
  }

  startDrag($event: MouseEvent): void {
    $event.preventDefault();
    const mouseX = $event.clientX;
    const mouseY = $event.clientY;

    const positionX = this.position.x;
    const positionY = this.position.y;

    const duringDrag = (e:MouseEvent) => {
      const duringX = e.clientX - mouseX;
      const duringY = e.clientY - mouseY;
      this.position.x = positionX + duringX;
      this.position.y = positionY + duringY;
      this.lastPosition = { ...this.position };
    };

    const finishDrag = (e:MouseEvent) => {
      this._document.removeEventListener('mousemove', duringDrag);
      this._document.removeEventListener('mouseup', finishDrag);
    };

    this._document.addEventListener('mousemove', duringDrag);
    this._document.addEventListener('mouseup', finishDrag);
  }
}
