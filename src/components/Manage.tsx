import React, { useState, useEffect } from "react";
import moment from "moment";
import TableCard2 from "./TableCard2";

interface Table {
  tableNum: number;
  startTime: moment.Moment;
  endTime: moment.Moment;
}

const ManageTables: React.FC = () => {
  const closingTime = moment().set({ hour: 22, minute: 0, second: 0 }); // เวลา 22:00 น.
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableNum, setNewTableNum] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const [isAddTableModalOpen, setAddTableModalOpen] = useState(false);
  const [isClearAllModalOpen, setClearAllModalOpen] = useState(false); // State สำหรับ Modal ล้างทุกโต๊ะ
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ดึงข้อมูลโต๊ะจาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    const savedTables = localStorage.getItem("tables");
    if (savedTables) {
      const parsedTables = JSON.parse(savedTables);
      setTables(
        parsedTables.map((table: Table) => ({
          ...table,
          startTime: moment(table.startTime),
          endTime: moment(table.endTime),
        }))
      );
    }
  }, []);

  // อัปเดตเวลาปัจจุบันทุก 1 วินาที
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  // เพิ่มโต๊ะใหม่
  const addTable = () => {
    if (newTableNum !== null) {
      // ตรวจสอบว่าโต๊ะซ้ำหรือไม่
      const isDuplicate = tables.some((table) => table.tableNum === newTableNum);
      if (isDuplicate) {
        setErrorMessage("หมายเลขโต๊ะซ้ำ กรุณาใส่หมายเลขอื่น");
        return;
      }

      const newTable: Table = {
        tableNum: newTableNum,
        startTime: moment(),
        endTime: moment().add(2, "hours"),
      };

      const updatedTables = [...tables, newTable];
      setTables(updatedTables);
      localStorage.setItem("tables", JSON.stringify(updatedTables));
      setNewTableNum(null);
      setAddTableModalOpen(false); // ปิด Modal หลังจากเพิ่มโต๊ะ
      setErrorMessage(null); // ล้างข้อความผิดพลาด
    }
  };

  // เพิ่มเวลาให้โต๊ะ
  const handleAddTime = (tableNum: number, minutes: number) => {
    const updatedTables = tables.map((table) => {
      if (table.tableNum === tableNum) {
        const newEndTime = moment(table.endTime).add(minutes, "minutes");

        // ตรวจสอบว่าเวลาปิดเตาใหม่เกิน 22:00 น. หรือไม่
        if (newEndTime.isAfter(closingTime)) {
          newEndTime.set({ hour: 22, minute: 0, second: 0 }); // ปรับเวลาปิดเตาเป็น 22:00 น.
        }

        return { ...table, endTime: newEndTime };
      }
      return table;
    });

    setTables(updatedTables);
    localStorage.setItem("tables", JSON.stringify(updatedTables));
  };

  // ลบโต๊ะ
  const handleDeleteTable = (tableNum: number) => {
    const updatedTables = tables.filter((table) => table.tableNum !== tableNum);
    setTables(updatedTables);
    localStorage.setItem("tables", JSON.stringify(updatedTables));
  };

  // ล้างทุกโต๊ะ
  const handleClearAllTables = () => {
    setTables([]); // ล้างข้อมูลใน state
    localStorage.removeItem("tables"); // ล้างข้อมูลใน localStorage
    setClearAllModalOpen(false); // ปิด Modal หลังจากล้างข้อมูล
  };

  return (
    <div className="p-6">
      <h1 className="text-6xl font-bold mb-6">Laohu Shabu</h1>

      {/* ปุ่มเพิ่มโต๊ะ */}
      <button
        className="btn btn-blue mb-6"
        onClick={() => setAddTableModalOpen(true)}
      >
        เพิ่มโต๊ะ
      </button>

      {/* ปุ่มล้างทุกโต๊ะ */}
      <button
        className="btn btn-error mb-6 ml-4"
        onClick={() => setClearAllModalOpen(true)}
      >
        ล้างทุกโต๊ะ
      </button>
      {/* แสดงเวลาปัจจุบัน */}
      <p className="text-lg mb-6">เวลาปัจจุบัน: {currentTime.format("HH:mm:ss")}</p>
      {/* แสดงข้อความผิดพลาด */}
      {errorMessage && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Layout สำหรับการ์ด */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {tables.map((table) => (
          <TableCard2
            key={table.tableNum}
            tableNum={table.tableNum}
            startTime={table.startTime}
            endTime={table.endTime}
            currentTime={currentTime}
            onDelete={() => handleDeleteTable(table.tableNum)}
            onAddTime={(minutes) => handleAddTime(table.tableNum, minutes)}
          />
        ))}
      </div>

      {/* Modal สำหรับเพิ่มโต๊ะ */}
      {isAddTableModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">เพิ่มโต๊ะ</h3>
            <input
              type="number"
              className="input input-bordered w-full mb-4"
              placeholder="หมายเลขโต๊ะ"
              value={newTableNum || ""}
              onChange={(e) => setNewTableNum(parseInt(e.target.value, 10))}
            />
            <div className="flex justify-end gap-2">
              <button className="btn btn-primary" onClick={addTable}>
                ยืนยัน
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setAddTableModalOpen(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สำหรับล้างทุกโต๊ะ */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">ยืนยันการล้างทุกโต๊ะ</h3>
            <p className="mt-2">คุณแน่ใจหรือไม่ว่าต้องการล้างทุกโต๊ะ?</p>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-error mr-2"
                onClick={handleClearAllTables}
              >
                ยืนยัน
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setClearAllModalOpen(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTables;