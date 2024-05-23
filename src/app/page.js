'use client'

import React, { useState } from "react";
import OpenAI from "openai";


function App() {
  // State for sliders
  const [budgetPerWeek, setBudgetPerWeek] = useState(40); // Example initial value
  const [timePerNight, setTimePerNight] = useState(40); // Example initial value

  // State for choices
  const dietaryOptions = ["Vegetarian", "Vegan", "Pescatarian", "Gluten-free"];
  const daysToCook = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const initialDietaryState = dietaryOptions.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const initialCookingDays = daysToCook.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const [dietaryRequirements, setDietaryRequirements] = useState(initialDietaryState);
  const [cookingDays, setCookingDays] = useState(initialCookingDays);
  const [isMealPrepping, setIsMealPrepping] = useState(false);

  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // State for the suggested recipes
  const [suggestedRecipes, setSuggestedRecipes] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      budgetPerWeek,
      timePerNight,
      cookingDays,
      dietaryRequirements,
      isMealPrepping
    };

    setIsLoading(true) // Onclick, the loading spinner starts

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      project: process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID,
      dangerouslyAllowBrowser: true,
    });

    // number of cooking days that is true
    const numCookingDays = Object.values(cookingDays).filter((day) => day).length;

    // Make prompt based on form data
    const prompt = `Give me ${numCookingDays} recipes, Budget: £${budgetPerWeek}, Time: ${timePerNight} minutes per night, ${isMealPrepping ? "2 servings" : "1 serving"} per recipe, Dietary requirements: ${Object.keys(dietaryRequirements).filter((dietary) => dietaryRequirements[dietary]).join(", ")}`;

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a recipe assistant designed to output JSON of shape {recipes: Array[]{name: string, steps: string, cost_in_pound: integer, ingredients[]: {ingredient: string, amount: string} , time_in_mins_to_cook: integer, portions: integer}}" },
          { role: "user", content: prompt }
        ],
        response_format: {"type": "json_object"},
        model: "gpt-3.5-turbo",
      });

      setSuggestedRecipes(chatCompletion.choices[0].message.content)
    } finally {
      setIsLoading(false)
    }

    // TODO: Figure out a way to make chatGPT less likely to recommend the same thing
  };

  return (
    <form>
      <p>What's your budget for cooking per week?</p>
      <Slider value={budgetPerWeek} onChange={setBudgetPerWeek} />
      <p>How much time do you have for cooking per night?</p>
      <Slider value={timePerNight} onChange={setTimePerNight} />
      <p>Do you have any dietary requirements?</p>
      <Choices options={dietaryOptions} choices={dietaryRequirements} setChoices={setDietaryRequirements} />
      <p>What days are you cooking?</p>
      <Choices options={daysToCook} choices={cookingDays} setChoices={setCookingDays} />
      <p>Are you meal prepping for the next day?</p>
      <label class="cursor-pointer label">
        <span class="label-text">No</span> 
        <input type="checkbox" class="toggle toggle-primary" onChange={(e) => setIsMealPrepping(!isMealPrepping)} />
        <span class="label-text">Yes</span> 
      </label>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Suggest recipes</button>
      
      {isLoading && <div><p>Chef is cooking up your recipe</p><span className="loading loading-spinner loading-md"></span></div>}
      <RecipeCards isLoading={isLoading} suggestedRecipes={suggestedRecipes} ></RecipeCards>
    </form>
  );
}

function RecipeCards({isLoading, suggestedRecipes}) {
  if (!isLoading && suggestedRecipes != '') {
    // convert string to JSON
    const suggestedRecipesObj = JSON.parse(suggestedRecipes);
    const recipeCards = suggestedRecipesObj.recipes.map((recipe, index) => (
      <div key={index}>
        <h3>{recipe.name}</h3>
        <p>{recipe.steps}</p>
        <p>Cost: £{recipe.cost_in_pound}</p>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.ingredient}: {ingredient.amount}</li>
          ))}
        </ul>
        <p>Time to Cook: {recipe.time_in_mins_to_cook} minutes</p>
        <br></br>
        <br></br>
      </div>
    ));

    // Render the recipe cards
    return <div>{recipeCards}</div>;
  }
}

function Choices({ options, choices, setChoices }) {
  const handleClick = (option, e) => {
    e.preventDefault();
    setChoices(prevChoices => ({
      ...prevChoices,
      [option]: !prevChoices[option] // Toggle the state
    }));
  };

  return (
    <div>
      {options.map((option) => (
        <button
          key={option}
          className={`btn ${choices[option] ? 'btn-active' : ''}`} // Dynamically set class
          onClick={(e) => handleClick(option, e)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Slider({ value, onChange }) {
  return (
    <div className="slidercontainer">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        className="range range-accent"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default App;