import './DateDifferenceCalculator.css';

function DateDifferenceCalculator({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <div className="Time_set">
      <div className="field">
        <label>Ngày bắt đầu:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Ngày kết thúc:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
}

export default DateDifferenceCalculator;
