import React, { useState } from "react";
import moment from "moment";

interface TableCardProps {
  tableNum: number;
  onDelete: (tableNum: number) => void;
}

const TableCard: React.FC<TableCardProps> = ({ tableNum, onDelete }) => {
  const [startTime] = useState(moment());
  const [endTime] = useState(moment(startTime).add(2, "hours"));
  const [currentTime, setCurrentTime] = useState(moment());

  const durationOver = currentTime.diff(endTime, "minutes");
  const isTimeOver = durationOver > 0;

  // Update current time periodically
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card bg-neutral text-neutral-content w-96 mb-4">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Table : {tableNum}</h2>
        <p>เวลาเปิดเตา: {startTime.format("HH:mm:ss")}</p>
        <p>เวลาปิดเตา: {endTime.format("HH:mm:ss")}</p>
        {isTimeOver && (
          <p className="text-red-500">
            เวลาปิดเตาเกินไปแล้ว {durationOver} นาที
          </p>
        )}
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => alert("เพิ่มเวลาในอนาคต")}
          >
            เพิ่มเวลา
          </button>
          <button className="btn btn-ghost" onClick={() => onDelete(tableNum)}>
            ปิดโต๊ะ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
