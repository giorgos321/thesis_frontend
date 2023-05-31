import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  DateCalendar,
  LocalizationProvider,
  TimeClock,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Accordion, Button, Label, Modal, Radio, Select } from "flowbite-react";
import moment from "moment";
import "moment/locale/el";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api";

interface Lab {
  id?: number;
  lab_name: string;
  lab_description: string;
  lab_year: number;
  lab_semester: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Teacher {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LabInstance {
  id: number;
  startTime: string;
  endTime: string;
  daysOfWeek: number;
  startRecur: string;
  endRecur: string;
  labId: number;
  teacherId: number;
  color: string;
  lab?: Lab;
  teacher?: Teacher;
}

enum ModalMode {
  create,
  update,
}

const daysOfWeek = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];

const emptyLabInstance: LabInstance = {
  id: NaN,
  startTime: "",
  endTime: "",
  daysOfWeek: NaN,
  startRecur: "",
  teacherId: NaN,
  labId: NaN,
  endRecur: "",
  color: "",
};

const colorList = [
  "#2196F3", // Blue
  "#FFC107", // Amber
  "#4CAF50", // Green
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#FF5722", // Deep Orange
];

moment.locale("el");

const Calendar = ({ data }: { data: any }) => {
  const [modal, setModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>(
    ModalMode.create
  );

  const [labs, setLabs] = useState<Lab[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [startTime, setStartTime] = useState<any>(moment(moment(new Date())));
  const [endTime, setEndTime] = useState<any>(moment(moment(new Date())));

  const currLabInstance = useRef<LabInstance>(emptyLabInstance);

  const events = useMemo(
    () =>
      data.map((lab: LabInstance) => ({
        ...lab,
        title: lab.lab?.lab_name,
        startTime: lab.startTime,
        endTime: lab.endTime,
        daysOfWeek: [lab.daysOfWeek],
        startRecur: moment(lab.startRecur).format("YYYY-MM-DD"),
        endRecur: moment(lab.endRecur).format("YYYY-MM-DD"),
      })),
    [data]
  );

  const getTeachers = async () => {
    setTeachers([]);
    const { data } = await api.get<Teacher[]>("api/teacher/");
    setTeachers(data);
  };

  const getLabs = async () => {
    setLabs([]);
    const { data } = await api.get<Lab[]>("api/labs");
    setLabs(data);
  };
  useEffect(() => {
    getLabs();
    getTeachers();
  }, []);

  useEffect(() => {
    currLabInstance.current.startTime = startTime.format("HH:mm");
    currLabInstance.current.endTime = endTime.format("HH:mm");
  }, [startTime, endTime]);

  const closeModal = () => {
    setModal(false);
  };

  // const sendEdit = () => {
  //   setIsProcessing(false)
  // }

  const sendNew = async () => {
    modalMode;
    console.log("This works?");

    setIsProcessing(true);
    await api.post("api/labinstance", currLabInstance.current);
    setIsProcessing(false);
  };

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  //   const modalInfosEvent = useDisclosure(false);

  const handleAddEventSelectAndOpenModal = (_selectInfo: any) => {
    console.log(_selectInfo, "modalll");

    // setIsEditCard(false);
    // setEventInfos(selectInfo);
    // modalInfosEvent.handleOpen();
  };

  const eventClick = (_clickInfo: any) => {
    console.log(_clickInfo.event);
    setModal(true);
    setModalMode(ModalMode.update);
    // setIsEditCard(true);
    // setEventInfos(clickInfo);
    // modalInfosEvent.handleOpen();
  };

  const handleUpdateEventSelect = async (_changeInfo: any) => {
    console.log(_changeInfo);
    try {
      //wtvr
    } catch (err) {
      //   toast.error('Houve um erro ao atualizar o evento');
    }
  };

  return (
    <div className="w-full">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="el"
        weekends={weekends.weekendsVisible}
        select={handleAddEventSelectAndOpenModal}
        eventClick={eventClick}
        eventChange={handleUpdateEventSelect}
        events={events}
        longPressDelay={1000}
        eventLongPressDelay={1000}
        selectLongPressDelay={1000}
        selectable={true}
        dayMaxEvents={true}
        allDaySlot={false}
        editable={true}
        height="700px"
        buttonText={{
          today: "Σήμερα",
          month: "Μήνας",
          week: "Εβδομάδα",
          day: "Ημέρα",
          list: "Λίστα",
        }}
      />
      <Modal onClose={closeModal} position="center" show={modal}>
        <Modal.Header>{"Νέο Εργαστίριο"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-row gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Εργαστίριο" />
                </div>
                <Select
                  onChange={(e) =>
                    (currLabInstance.current.labId = parseInt(e.target.value))
                  }
                  required
                >
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.lab_name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Διδάσκον καθηγητής" />
                </div>
                <Select
                  onChange={(e) =>
                    (currLabInstance.current.teacherId = parseInt(
                      e.target.value
                    ))
                  }
                  required
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Ημέρα" />
                </div>
                <Select
                  defaultValue={1}
                  onChange={(e) =>
                    (currLabInstance.current.daysOfWeek = parseInt(
                      e.target.value
                    ))
                  }
                  required
                >
                  {daysOfWeek.map((day, i) => (
                    <option key={day} value={i}>
                      {day}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Χρώμα" />
                </div>
                <fieldset
                  className="flex flex-row justify-center items-center gap-6 h-[40px]"
                  id="radio"
                  onChange={(e) =>
                    (currLabInstance.current.color = (
                      e.target as HTMLInputElement
                    ).value)
                  }
                >
                  {colorList.map((color, i) => (
                    <Radio
                      id={color}
                      key={color}
                      defaultChecked={i === 0}
                      name={"colors"}
                      value={color}
                      style={{ color }}
                    />
                  ))}
                </fieldset>
              </div>
            </div>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Accordion collapseAll>
                <Accordion.Panel>
                  <Accordion.Title>
                    Επιλογή περιόδου εργαστιρίου
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className="flex flex-row">
                      <DateCalendar
                        onChange={(e: any) =>
                          (currLabInstance.current.startRecur =
                            moment(e).format("YYYY-MM-DD"))
                        }
                      />
                      <DateCalendar
                        onChange={(e: any) =>
                          (currLabInstance.current.endRecur =
                            moment(e).format("YYYY-MM-DD"))
                        }
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title>Επιλογή ώρας</Accordion.Title>
                  <Accordion.Content>
                    <div className="flex flex-row gap-2 text-base font-bold text-center">
                      <div className="flex-1">
                        Αρχή {startTime.format("hh:mm a")}
                      </div>
                      <div className="flex-1">
                        Τέλος {endTime.format("hh:mm a")}
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <TimeClock
                        showViewSwitcher={true}
                        ampm={false}
                        value={startTime}
                        ampmInClock={true}
                        className="flex-1"
                        onChange={(e: any) => setStartTime(moment(e))}
                      />
                      <TimeClock
                        showViewSwitcher={true}
                        ampm={false}
                        value={endTime}
                        ampmInClock={true}
                        className="flex-1"
                        onChange={(e: any) => setEndTime(moment(e))}
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </LocalizationProvider>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="gray" onClick={closeModal}>
            Άκυρο
          </Button>
          <Button isProcessing={isProcessing} onClick={sendNew}>
            Αποθήκευση
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
