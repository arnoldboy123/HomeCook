import Image from "next/image";

export default function Home() {
  return (
    <>        
      <section>
        <h1>Your ultimate digital Sous Chef helping you get into the habit of cooking</h1>
        <p>Some copy about how hello fresh is inconvenient, you want to find recipes tailored to you, don't wanna crawl through a bunch of SEO paragraphs blah blah blah</p>
      </section>
      <section>
        <form>
          <p>What's your budget for cooking per week?</p>
          <select id="budget" name="amont">
            <option value="<20">Less than 20</option>
            <option value="<20-40">20-40</option>
            <option value="<40-60">40-60</option>
            <option value=">60">More than 50</option>
          </select>
          <p>How much time do you have for cooking per night?</p>
          <select id="time" name="duration">
            <option value="<20">Less than 20</option>
            <option value="<20-40">20-40</option>
            <option value="<40-60">40-60</option>
            <option value=">60">More than 50</option>
          </select>
          <p>What cuisines are your favourite</p>
          <select id="Cuisine" name="type" size="4" multiple>
            <option value="Chinese">Volvo</option>
            <option value="Japanese">Saab</option>
            <option value="Korean">Fiat</option>
            <option value="South East Asian">Audi</option>
          </select>
          <p>Do you have any dietary requirements?</p>
          <select id="Dietary requirements" name="type" size="4" multiple>
            <option value="Vegetarian">Volvo</option>
            <option value="Vegan">Saab</option>
            <option value="Pescatarian">Fiat</option>
            <option value="Gluten Free">Audi</option>
          </select>
          {/* Remove line break when we have css */}
          <br></br>
          <button>Suggest recipes</button>
        </form>
      </section>
    </>
  );
}