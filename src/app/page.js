'use client'

import React, { useState } from "react";
import OpenAI from "openai";


function App() {
  // State for sliders
  const [budgetPerWeek, setBudgetPerWeek] = useState(40); // Example initial value
  const [timePerNight, setTimePerNight] = useState(40); // Example initial value

  // State for choices
  const cuisineOptions = ["Chinese", "Korean", "Japanese"];
  const dietaryOptions = ["Vegetarian", "Vegan", "Pescatarian", "Gluten-free"];
  const daysToCook = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const initialCuisineState = cuisineOptions.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const initialDietaryState = dietaryOptions.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const initialCookingDays = daysToCook.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const [cuisineChoices, setCuisineChoices] = useState(initialCuisineState);
  const [dietaryRequirements, setDietaryRequirements] = useState(initialDietaryState);
  const [cookingDays, setCookingDays] = useState(initialCookingDays);
  const [isMealPrepping, setIsMealPrepping] = useState(false);
  const [previousRecipe, setPreviousRecipe] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      budgetPerWeek,
      timePerNight,
      cuisineChoices,
      cookingDays,
      dietaryRequirements,
      isMealPrepping
    };
    console.log(formData); // Here you can store the data as needed

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      project: process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID,
      dangerouslyAllowBrowser: true,
    });

    // number of cooking days that is true
    const numCookingDays = Object.values(cookingDays).filter((day) => day).length;

    // Check if previous recipe is '', if not, add to prompt
    const previousRecipePrompt = previousRecipe != '' ? `Don't recommend these: ${previousRecipe}.` : '';

    // Make prompt based on form data
    const prompt = `Give me ${numCookingDays} recipes, Budget: £${budgetPerWeek}, Time: ${timePerNight} minutes per night, ${isMealPrepping ? "2 servings" : "1 serving"} per recipe, Cuisine: ${Object.keys(cuisineChoices).filter((cuisine) => cuisineChoices[cuisine]).join(", ")}, Dietary requirements: ${Object.keys(dietaryRequirements).filter((dietary) => dietaryRequirements[dietary]).join(", ")}, ${previousRecipePrompt}`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a recipe assistant designed to output JSON of shape {recipes: Array[]{name: string, steps: string, cost_in_pound: integer, ingredients[]: {ingredient: string, amount: string} , time_in_mins_to_cook: integer, portions: integer}}" },
        { role: "user", content: prompt }
      ],
      response_format: {"type": "json_object"},
      model: "gpt-3.5-turbo",
    });

    // TODO: Try not to recommend the same thing again

    // Log the response when it is completed
    console.log(chatCompletion.choices[0].message.content);
  };

  return (
    <form>
      <p>What's your budget for cooking per week?</p>
      <Slider value={budgetPerWeek} onChange={setBudgetPerWeek} />
      <p>How much time do you have for cooking per night?</p>
      <Slider value={timePerNight} onChange={setTimePerNight} />
      <p>What cuisines are your favourite?</p>
      <Choices options={cuisineOptions} choices={cuisineChoices} setChoices={setCuisineChoices} />
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
    </form>
  );
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