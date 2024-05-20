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
  const initialCuisineState = cuisineOptions.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const initialDietaryState = dietaryOptions.reduce((acc, option) => ({ ...acc, [option]: false }), {});
  const [cuisineChoices, setCuisineChoices] = useState(initialCuisineState);
  const [dietaryRequirements, setDietaryRequirements] = useState(initialDietaryState);
  const [isMealPrepping, setIsMealPrepping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      budgetPerWeek,
      timePerNight,
      cuisineChoices,
      dietaryRequirements,
      isMealPrepping
    };
    console.log(formData); // Here you can store the data as needed

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      project: process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID,
      dangerouslyAllowBrowser: true,
    });

    // Make prompt based on form data
    const prompt = `Budget: £${budgetPerWeek}, Time: ${timePerNight} minutes, Cuisine: ${Object.keys(cuisineChoices).filter((cuisine) => cuisineChoices[cuisine]).join(", ")}, Dietary requirements: ${Object.keys(dietaryRequirements).filter((dietary) => dietaryRequirements[dietary]).join(", ")}`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a recipe assistant designed to output JSON of shape {meals: Array[]{name: string, steps: string, cost_in_pound: integer, time_in_mins_to_cook: integer}}" },
        { role: "user", content: prompt }
      ],
      response_format: {"type": "json_object"},
      model: "gpt-3.5-turbo",
    });

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