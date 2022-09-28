import React, { useState, useEffect, useCallback } from "react";
import "./DatePicker.component.css";

export default function DatePicker() {
  const [month, setMonth] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [year, setYear] = useState(2022);
  const [daysAway, setDaysAway] = useState(0);
  const [futureDate, setFutureDate] = useState(true);
  const [daysOfMonthSelectionRange, setDaysOfMonthSelectionRange] =
    useState(dayOfMonthSelections);

  const todaysDate = new Date();
  const todaysMonth = todaysDate.getMonth() + 1; // +1 because the months values are counting from 0 so it ends up being a month behind numerically
  const todaysDay = todaysDate.getDate();
  const todaysYear = todaysDate.getFullYear();

  const checkIfDateIsInThePast = useCallback((date) => {
    // today needed its own variable in the function because
    // an error gets thrown if you try to use todaysDate

    let today = new Date();

    today.setHours(0, 0, 0, 0);

    if (date >= today) {
      setFutureDate(true);
    } else {
      setFutureDate(false);
    }
  }, []);

  const calculateDaysAway = useCallback(
    (chosenMonth, chosenDay, chosenYear) => {
      if (chosenYear.length === 4) {
        let oneDay = 24 * 60 * 60 * 1000;
        let today = new Date(todaysYear, todaysMonth - 1, todaysDay);
        let chosenDate = new Date(chosenYear, chosenMonth - 1, chosenDay);
        let differenceInDays = Math.round(
          Math.abs((today - chosenDate) / oneDay)
        );

        checkIfDateIsInThePast(chosenDate);
        setDaysAway(differenceInDays);
      } else {
        return;
      }
    },
    [checkIfDateIsInThePast, todaysDay, todaysMonth, todaysYear]
  );

  const updateDateLocalStorage = (chosenMonth, chosenDay, chosenYear) => {
    let dateItem = { month: chosenMonth, day: chosenDay, year: chosenYear };
    localStorage.setItem("date", JSON.stringify(dateItem));
  };

  const handleMonthChange = (e) => {
    let newMonth = e.target.value;
    setMonth(newMonth);
    calculateDaysAway(newMonth, dayOfMonth, year);
    updateDateLocalStorage(newMonth, dayOfMonth, year);
  };

  const handleDayChange = (e) => {
    let newDayOfMonth = e.target.value;
    setDayOfMonth(newDayOfMonth);
    calculateDaysAway(month, newDayOfMonth, year);
    updateDateLocalStorage(month, newDayOfMonth, year);
  };

  const handleYearChange = (e) => {
    // limit is to make sure a max of 4 characters is able to be entered into the input field
    const limit = 4;
    let newYear = e.target.value.slice(0, limit);
    setYear(newYear);
    calculateDaysAway(month, dayOfMonth, newYear);
    updateDateLocalStorage(month, dayOfMonth, newYear);
  };

  useEffect(() => {
    const date = localStorage.getItem("date");

    if (date) {
      const parsedDate = JSON.parse(date);
      const parsedMonth = parsedDate.month;
      const parsedDay = parsedDate.day;
      const parsedYear = parsedDate.year;
      setMonth(parsedMonth);
      setDayOfMonth(parsedDay);
      setYear(parsedYear);
      calculateDaysAway(parsedMonth, parsedDay, parsedYear);
    } else {
      setMonth(todaysMonth);
      setDayOfMonth(todaysDay);
      setYear(todaysYear);
      calculateDaysAway(todaysMonth, todaysDay, todaysYear);
    }
  }, [calculateDaysAway, todaysDay, todaysMonth, todaysYear]);

  localStorage.clear();
  /*
  updating component to change the range of days available for each month
  depending on the month selected and if it's a leap year
  */
  useEffect(() => {
    let selectionRange = dayOfMonthSelections;
    let monthValue = Number(month);

    if (
      monthValue === 4 ||
      monthValue === 6 ||
      monthValue === 9 ||
      monthValue === 11
    ) {
      setDaysOfMonthSelectionRange(selectionRange.slice(0, 30));
    } else if (monthValue === 2 && year % 4 === 0) {
      setDaysOfMonthSelectionRange(selectionRange.slice(0, 29));
    } else if (monthValue === 2) {
      setDaysOfMonthSelectionRange(selectionRange.slice(0, 28));
    } else {
      setDaysOfMonthSelectionRange(selectionRange);
    }
  }, [month, year]);

  return (
    <div className="main-container">
      <div className="date-picker-container">
        <div className="selector-container-month">
          <label htmlFor="month-selection">Month</label>
          <select
            id="month-selection"
            className="months-selection"
            value={month}
            onChange={handleMonthChange}
            aria-label="select month"
          >
            {monthsSelections.map((month, index) => (
              <option key={index} value={month.value}>
                {month.month}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-container-day">
          <label htmlFor="day-of-month-selection">Day</label>
          <select
            id="day-of-month-selection"
            className="day-of-month-selection"
            value={dayOfMonth}
            onChange={handleDayChange}
            aria-label="select day of month"
          >
            {daysOfMonthSelectionRange.map((dayOfMonth, index) => (
              <option key={index} value={dayOfMonth.value}>
                {dayOfMonth.dayOfMonth}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container-year">
          <label htmlFor="year-selection">Year</label>
          <input
            id="year-selection"
            className="year-selection"
            type="number"
            value={year}
            onChange={handleYearChange}
            aria-label="type year or use spinner to increment/decrement"
          />
        </div>
      </div>

      <div className="date-display-container" aria-live="assertive">
        <h1>
          {futureDate ? (
            <>
              {month}/{dayOfMonth}/{year} is {daysAway} days from now{" "}
            </>
          ) : (
            <>
              {month}/{dayOfMonth}/{year} was {daysAway} days ago{" "}
            </>
          )}
        </h1>
      </div>
    </div>
  );
}

const monthsSelections = [
  {
    value: 1,
    month: "January",
  },
  {
    value: 2,
    month: "February",
  },
  {
    value: 3,
    month: "March",
  },
  {
    value: 4,
    month: "April",
  },
  {
    value: 5,
    month: "May",
  },
  {
    value: 6,
    month: "June",
  },
  {
    value: 7,
    month: "July",
  },
  {
    value: 8,
    month: "August",
  },
  {
    value: 9,
    month: "September",
  },
  {
    value: 10,
    month: "October",
  },
  {
    value: 11,
    month: "November",
  },
  {
    value: 12,
    month: "December",
  },
];

const dayOfMonthSelections = [
  {
    value: 1,
    dayOfMonth: "01",
  },
  {
    value: 2,
    dayOfMonth: "02",
  },
  {
    value: 3,
    dayOfMonth: "03",
  },
  {
    value: 4,
    dayOfMonth: "04",
  },
  {
    value: 5,
    dayOfMonth: "05",
  },
  {
    value: 6,
    dayOfMonth: "06",
  },
  {
    value: 7,
    dayOfMonth: "07",
  },
  {
    value: 8,
    dayOfMonth: "08",
  },
  {
    value: 9,
    dayOfMonth: "09",
  },
  {
    value: 10,
    dayOfMonth: "10",
  },
  {
    value: 11,
    dayOfMonth: "11",
  },
  {
    value: 12,
    dayOfMonth: "12",
  },
  {
    value: 13,
    dayOfMonth: "13",
  },
  {
    value: 14,
    dayOfMonth: "14",
  },
  {
    value: 15,
    dayOfMonth: "15",
  },
  {
    value: 16,
    dayOfMonth: "16",
  },
  {
    value: 17,
    dayOfMonth: "17",
  },
  {
    value: 18,
    dayOfMonth: "18",
  },
  {
    value: 19,
    dayOfMonth: "19",
  },
  {
    value: 20,
    dayOfMonth: "20",
  },
  {
    value: 21,
    dayOfMonth: "21",
  },
  {
    value: 22,
    dayOfMonth: "22",
  },
  {
    value: 23,
    dayOfMonth: "23",
  },
  {
    value: 24,
    dayOfMonth: "24",
  },
  {
    value: 25,
    dayOfMonth: "25",
  },
  {
    value: 26,
    dayOfMonth: "26",
  },
  {
    value: 27,
    dayOfMonth: "27",
  },
  {
    value: 28,
    dayOfMonth: "28",
  },
  {
    value: 29,
    dayOfMonth: "29",
  },
  {
    value: 30,
    dayOfMonth: "30",
  },
  {
    value: 31,
    dayOfMonth: "31",
  },
];
