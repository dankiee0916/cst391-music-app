"use client";

import { useState } from "react";

interface SearchFormProps {
  onSubmit: (text: string) => void;
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
  const [inputText, setInputText] = useState("");

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputText(value);
    console.log(value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(inputText);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="search-term">Search for</label>
          <input
            id="search-term"
            type="text"
            className="form-control"
            placeholder="Enter search term here"
            value={inputText}
            onChange={handleChangeInput}
          />
        </div>
      </form>
    </div>
  );
}
