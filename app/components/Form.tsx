'use client';
import { useState } from 'react';
import styles from './Form.module.css';
import axios from 'axios';

const Form: React.FC = () => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [joke, setJoke] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  //Set the value of the day the user inputs
  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDay(event.target.value);
  };

  //Set the value of the month the user inputs
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(event.target.value);
  };

  //Form submission logic
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnimateOut(true); 

  //Store sign value based on user input
    const sign = determineHoroscopeSign(Number(month), Number(day));
    setHoroscope(sign);

    setTimeout(() => {
      setSubmitted(true);
      setAnimateOut(false);
      setAnimateIn(true); 

      // Set joke to "Generating joke..." before fetching
      setJoke('Generating joke...');

      // Fetch the joke after setting the state for animation
      getHoroscopeJoke(sign).then(response => {
        setJoke(response.joke);
      });
    }, 500); 
  };

  //Check the day and month of the user input to determine what sign they are
  const determineHoroscopeSign = (month: number, day: number) => {
    switch (true) {
      case (month === 1 && day >= 20) || (month === 2 && day <= 18):
        return 'Aquarius';
      case (month === 2 && day >= 19) || (month === 3 && day <= 20):
        return 'Pisces';
      case (month === 3 && day >= 21) || (month === 4 && day <= 19):
        return 'Aries';
      case (month === 4 && day >= 20) || (month === 5 && day <= 20):
        return 'Taurus';
      case (month === 5 && day >= 21) || (month === 6 && day <= 20):
        return 'Gemini';
      case (month === 6 && day >= 21) || (month === 7 && day <= 22):
        return 'Cancer';
      case (month === 7 && day >= 23) || (month === 8 && day <= 22):
        return 'Leo';
      case (month === 8 && day >= 23) || (month === 9 && day <= 22):
        return 'Virgo';
      case (month === 9 && day >= 23) || (month === 10 && day <= 22):
        return 'Libra';
      case (month === 10 && day >= 23) || (month === 11 && day <= 21):
        return 'Scorpio';
      case (month === 11 && day >= 22) || (month === 12 && day <= 21):
        return 'Sagittarius';
      case (month === 12 && day >= 22) || (month === 1 && day <= 19):
        return 'Capricorn';
      default:
        return 'Invalid date';
    }
  };

  //Return the corresponding image based on the result of DetermineHoroscopeSign
  const getHoroscopeImage = (sign: string) => {
    return `img/horoscope_icons/${sign.toLowerCase()}.png`;
  };

  //Save value of API call response
  const getHoroscopeJoke = async (horoscope: string) => {
    try {
      const response = await axios.post('/api/joke', { horoscope });
      return response.data;
    } catch (error) {
      console.error('Error fetching joke:', error);
      return { joke: 'Failed to fetch a joke.' };
    }
  };

  //Change state of program after clicking Edit Birthday button
  const handleEditBirthday = () => {
    setSubmitted(false);
    setAnimateIn(false);
    setJoke('');
  };

  //Change state of program after clicking New Joke button
  const handleNewJoke = async () => {
    setJoke('Generating joke...');
    const response = await getHoroscopeJoke(horoscope);
    setJoke(response.joke);
  };

  return (
    <div className={styles.formContainer}>
      {!submitted && (
        <>
          <h3 className={`${styles.instructions} ${animateOut ? styles.fadeOut : ''}`}>Enter your birthday</h3>
          <form className={`${styles.formWrapper} ${animateOut ? styles.fadeOut : ''}`} onSubmit={handleFormSubmit}>
            <div className={`${styles.inputContainer} ${animateOut ? styles.fadeOut : ''}`}>
              <label htmlFor="month" className={styles.formLabel}>Month</label>
              <select id="month" value={month} onChange={handleMonthChange} required className={`${styles.formInput} ${styles.inputStyle}`}>
                <option value="">Select month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div className={`${styles.inputContainer} ${animateOut ? styles.fadeOut : ''}`}>
              <label htmlFor="day" className={`${styles.formLabel} ${styles.inputStyle}`}>Day</label>
              <input
                type="number"
                id="day"
                value={day}
                onChange={handleDayChange}
                required
                min="1"
                max="31"
                className={`${styles.formInput} ${styles.numberInput}`}
              />
            </div>
            <button type="submit" className={styles.formButton}>Get Joke</button>
          </form>
        </>
      )}
      {submitted && (
        <div className={`${styles.horoscopeResult} ${animateIn ? styles.fadeIn : ''}`}>
          <h2 className={styles.horoscopeName}>{horoscope} Joke</h2>
          <img src={getHoroscopeImage(horoscope)} alt={horoscope} className={styles.horoscopeImage} />
          <p className={styles.jokeText}>{joke}</p>
          <div className={styles.buttonContainer}>
            <button onClick={handleEditBirthday} className={styles.formButton}>Edit Birthday</button>
            <button onClick={handleNewJoke} className={styles.formButton}>New Joke</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;