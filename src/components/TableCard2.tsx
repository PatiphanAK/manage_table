import React from "react";
import moment from "moment";

interface TableCardProps {
  tableNum: number;
  startTime: moment.Moment;
  endTime: moment.Moment;
  currentTime: moment.Moment;
  onDelete: () => void;
  onAddTime: (minutes: number) => void;
}

const TableCard2: React.FC<TableCardProps> = ({
  tableNum,
  startTime,
  endTime,
  currentTime,
  onDelete,
  onAddTime,
}) => {
  const timeLeft = endTime.diff(currentTime, "minutes");
  const durationOver = currentTime.diff(endTime, "minutes");
  const isTimeOver = timeLeft < 0;

  const [isAddTimeModalOpen, setAddTimeModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

  return (
    <>
      <div
        className={`card ${
          timeLeft < 15
            ? "bg-[#ff645f] hover:bg-red-200 active:bg-red-200"
            : "bg-[#5071d4] hover:bg-blue-300 active:bg-blue-300"
        } text-white w-64 p-4 rounded-lg shadow-lg`}
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title text-lg">หมายเลขโต๊ะ {tableNum}</h2>
          <p className="text-sm">เวลาเปิดเตา: {startTime.format("HH:mm:ss")}</p>
          <p className="text-sm ">เวลาปิดเตา: {endTime.format("HH:mm:ss")}</p>
          <p className="text-sm text-[#b20808]">เวลาที่เหลือ: {timeLeft} นาที</p>
          {isTimeOver ? (
            <p className="text-[#b41111] text-sm">
              เวลาปิดเตาเกินไปแล้ว {durationOver}
            </p>
          ) : (
            <p className="text-[#b41111] text-sm">
              เวลาเหลือ: {Math.floor(timeLeft / 60)} ชั่วโมง {timeLeft % 60}{" "}
              นาที
            </p>
          )}
          <div className="card-actions justify-end">
            <button
              className="btn btn-sm bg-ghost"
              onClick={() => setAddTimeModalOpen(true)}
            >
              เพิ่มเวลา
            </button>
            <button
              className="btn btn-sm btn-white"
              onClick={() => setDeleteModalOpen(true)}
            >
              ปิดโต๊ะ
            </button>
          </div>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มเวลา */}
      {isAddTimeModalOpen && (
        <dialog className="modal" open>
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold">เพิ่มเวลา</h3>
            <p className="mt-2">กรุณาใส่จำนวนเวลาที่ต้องการเพิ่ม (นาที):</p>
            <input
              type="number"
              className="input input-bordered w-full mt-4"
              placeholder="จำนวนเวลา (นาที)"
              id="timeInput"
            />
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-secondary btn-sm mr-2"
                onClick={() => {
                  const minutes = parseInt(
                    (document.getElementById("timeInput") as HTMLInputElement)
                      .value
                  );
                  if (!isNaN(minutes)) {
                    onAddTime(minutes);
                    setAddTimeModalOpen(false);
                  } else {
                    alert("กรุณาใส่จำนวนเวลาที่ถูกต้อง");
                  }
                }}
              >
                ยืนยัน
              </button>
              <button
                className="btn btn-sm bg-{} mr-2"
                onClick={() => setAddTimeModalOpen(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal สำหรับยืนยันปิดโต๊ะ */}
      {isDeleteModalOpen && (
        <dialog className="modal" open>
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold">ยืนยันการปิดโต๊ะ</h3>
            <p className="mt-2">คุณแน่ใจหรือไม่ว่าต้องการปิดโต๊ะนี้?</p>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-error btn-sm mr-2"
                onClick={() => {
                  onDelete(); // เรียกฟังก์ชัน onDelete เมื่อยืนยัน
                  setDeleteModalOpen(false); // ปิด Modal
                }}
              >
                ยืนยัน
              </button>
              <button
                className="btn btn-sm bg-{} mr-2"
                onClick={() => setDeleteModalOpen(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default TableCard2;
