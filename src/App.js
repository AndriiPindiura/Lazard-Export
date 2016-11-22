import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: [
        {
          id: 'mn',
          description: 'monday',
          selected: [
            {
              bt: 240,
              et: 779,
            },
          ],
        },
        {
          id: 'tu',
          description: 'tuesday',
          selected: [],
        },
        {
          id: 'wd',
          description: 'wednesday',
          selected: [],
        },
        {
          id: 'th',
          description: 'thursday',
          selected: [
            {
              bt: 240,
              et: 779,
            },
            {
              bt: 1140,
              et: 1319,
            },
          ],
        },
        {
          id: 'fr',
          description: 'friday',
          selected: [
            {
              bt: 660,
              et: 1019,
            },
          ],
        },
        {
          id: 'st',
          description: 'saturday',
          selected: [
            {
              bt: 0,
              et: 1439,
            },
          ],
        },
        {
          id: 'su',
          description: 'sunday',
          selected: [],
        },
      ],
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8 ,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    }
  }

  onMouseDown = (dayId, hour) => {
    this.setState({
      mouseSelectDay: dayId,
      mouseSelectStart: hour,
    })
  }

  onMouseUp = (hour) => {
    const schedule = [...this.state.schedule];
    const mouseSelectedHours = [];
    mouseSelectedHours[23] = 0;
    for (let i = this.state.mouseSelectStart; i < hour; i++) {
      mouseSelectedHours[i] = true;
    }
    const selectedHours = [];
    selectedHours[23] = 0;

    for(let i = 0, l = schedule.length; i < l; i++) {
      if (schedule[i].id === this.state.mouseSelectDay) {
        schedule[i].selected.length && schedule[i].selected.forEach(time => {
          for (let k = time.bt / 60; k < (time.et + 1) / 60; k++) {
            selectedHours[k] = 1;
          }
        });
        for(let h = 0; h < 24; h++) {
          selectedHours[h] = selectedHours[h] ? selectedHours[h] ^ mouseSelectedHours[h] : mouseSelectedHours[h];
        }
        const resultSelectedHours = [];
        let bt;
        for (let h = 0; h < 24; h++) {
          if (!selectedHours[h] && !isNaN(bt)) {
            resultSelectedHours.push({ bt: bt * 60, et: h * 60 - 1})
            bt = NaN;
          } else if (selectedHours[h]){
            bt = isNaN(bt) ? h : bt;
          }
        }
        if (!isNaN(bt)) {
          resultSelectedHours.push({ bt: bt * 60, et: 24 * 60 - 1})
        }
        // console.log(mouseSelectedHours);
        // console.log(selectedHours);
        // console.log(resultSelectedHours);
        schedule[i].selected = resultSelectedHours;
      }
    }
    this.setState({ schedule})
  }

  selectDay = (dayId) => {
    const schedule = [...this.state.schedule].map(day => {
      if (day.id === dayId) {
        day.selected = day.selected.length > 0 ? [] : [{ bt: 0, et: 1439 }];
      }
      return day;
    });
    this.setState({ schedule });
  }

  clearSchedule = () => {
    const schedule = [...this.state.schedule].map(day => {
      const clearDay = day;
      clearDay.selected = [];
      return clearDay;
    });
    this.setState({ schedule });
  }

  saveChanges = () => {
    axios.post('http://example.org', this.state.schedule)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  render() {
    const { schedule, hours } = this.state;
    return (
      <section className="App">
        <div>
          <section>
            <h3>Set schedule</h3>
            <header>
              <div className="x2"></div>
              <div className="x2">All day</div>
              <div className="x3">00:00</div>
              <div className="x3">03:00</div>
              <div className="x3">06:00</div>
              <div className="x3">09:00</div>
              <div className="x3">12:00</div>
              <div className="x3">15:00</div>
              <div className="x3">18:00</div>
              <div className="x3">21:00</div>
            </header>
            <main>
              {schedule.map((day, index) => {
                let total = 0;
                day.selected.map(selected => {
                  total += selected.et - selected.bt + 1;
                });
                return (
                <div key={index}>
                  <div className="x2 title">{day.id}</div>
                  <div className={`x2 day ${total / 60 === 24 ? 'all' : ''}`} onClick={() => this.selectDay(day.id)}/>
                  {hours.map((hour, hIndex) => (
                    <div
                      key={hour}
                      className={`x1 cell ${day.selected.filter(time => hour * 60 >= time.bt && (hour + 1) * 60 - 1 <= time.et).length > 0 ? 'selected' : ''}`}
                      onMouseDown={() => this.onMouseDown(day.id, hour)}
                      onMouseUp={() => this.onMouseUp(hour + 1)}
                      onDragStart={e => e.preventDefault()}
                    />
                  ))}
                </div>
              )})}
            </main>
            <footer>
              <button onClick={this.clearSchedule}>Clear</button>
              <button onClick={this.saveChanges}>Save Changes</button>
            </footer>
          </section>
        </div>
      </section>
    );
  }
}

export default App;
