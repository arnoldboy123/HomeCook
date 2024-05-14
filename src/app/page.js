'use client'

import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  return (
    <html data-theme="cupcake">        
      <section>
        <h1>Your ultimate digital Sous Chef helping you get into the habit of cooking</h1>
        <p>Some copy about how hello fresh is inconvenient, you want to find recipes tailored to you, don't wanna crawl through a bunch of SEO paragraphs blah blah blah</p>
      </section>
      <section>
        <form>
          <p>What's your budget for cooking per week?</p>
          <Slider />
          <p>How much time do you have for cooking per night?</p>
          <Slider />
          <p>What cuisines are your favourite</p>
          <Choices options={["Chinese", "Korean", "Japanese"]}/>
          <p>Do you have any dietary requirements?</p>
          <Choices options={["Vegetarian", "Vegan", "Pescatarian", "Gluten-free"]}/>
          <button class="btn btn-primary" onClick={(e) => e.preventDefault()}>Suggest recipes</button>
        </form>
      </section>
    </html>
  );
}

function Choices({ options }) {
  // Assuming options is defined and passed correctly as shown in previous examples
  const initialState = options.reduce((acc, option) => {
    acc[option] = false; // false indicates inactive, true indicates active
    return acc;
  }, {});

  const [choices, setChoices] = useState(initialState);

  const handleClick = (e) => {
    e.preventDefault();
    const choiceId = e.target.id;
    setChoices(prevChoices => ({
      ...prevChoices,
      [choiceId]: !prevChoices[choiceId] // Toggle the state
    }));
  };

  return (
    <div>
      {Object.entries(choices).map(([choice, isSelected]) => (
        <button
          key={choice}
          className={`btn ${isSelected ? 'btn-active' : ''}`} // Dynamically set class
          id={choice}
          onClick={handleClick}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}

function Slider() {
  const [value, setValue] = useState(40)

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div class = "slidercontainer">
    <input type="range" min="0" max="100" value={value} className="range range-accent" onChange={handleChange}/>
  </div>
  )
}