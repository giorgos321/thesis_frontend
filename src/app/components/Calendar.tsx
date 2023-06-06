import type {
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
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
import moment, { Moment } from "moment";
import "moment/locale/el";
import { useEffect, useMemo, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import api from "../../api";
// import useToast from "../../hooks/useToast";

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
  id?: number;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: string;
  startRecur?: string;
  endRecur?: string;
  labId?: number;
  teacherId?: number;
  color?: string;
  lab?: Lab;
  teacher?: Teacher;
  students?: Array<any>;
}

enum ModalMode {
  create,
  update,
}

// function isCalendarEvent(
//   evt: EventClickArg | MouseEventHandler
// ): evt is EventClickArg {
//   return (evt as EventClickArg).jsEvent !== undefined;
// }

const daysOfWeek = [
  // "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  // "Σάββατο",
];

const emptyLabInstance: LabInstance = {
  id: undefined,
  startTime: undefined,
  endTime: undefined,
  daysOfWeek: undefined,
  startRecur: undefined,
  teacherId: undefined,
  labId: undefined,
  endRecur: undefined,
  color: undefined,
};

const colorList = [
  "#2196F3", // Blue
  "#FFC107", // Amber
  "#4CAF50", // Green
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#FF5722", // Deep Orange
];

const weekends = {
  weekendsVisible: false,
  currentEvents: [],
};

moment.locale("el");

const Calendar = ({
  data,
  refresh,
}: {
  data: any;
  refresh: () => Promise<void>;
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>(
    ModalMode.create
  );

  const [form, setForm] = useState<LabInstance>(emptyLabInstance);
  const [invalid, setInvalid] = useState(true);

  const [labs, setLabs] = useState<Lab[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [startTime, setStartTime] = useState<Moment>(moment());
  const [endTime, setEndTime] = useState<Moment>(moment());

  const [startRecur, setStartRecur] = useState<Moment>(moment());
  const [endRecur, setEndRecur] = useState<Moment>(moment());
  const navigate = useNavigate();

  // const { showToast } = useToast();

  // const currLabInstance = useRef<LabInstance>(emptyLabInstance);

  const events = useMemo(
    () =>
      data.map((lab: LabInstance) => ({
        ...lab,
        instanceData: lab,
        title: `${lab.lab?.lab_name}`,
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
    if (modalMode === ModalMode.create) {
      setForm({
        ...form,
        labId: labs[0]?.id,
        teacherId: teachers[0]?.id,
        daysOfWeek: "1",
        color: colorList[0],
      });
    }
  }, [labs, teachers]);

  const getTimeFormat = (moment: Moment | string, forForm = false): string => {
    if (typeof moment === "string") {
      return moment;
    } else {
      return forForm ? moment.format("HH:mm") : moment.format("hh:mm a");
    }
  };

  const getDateFormat = (moment: Moment | string): string => {
    if (typeof moment === "string") {
      return moment;
    } else {
      return moment.format("YYYY-MM-DD");
    }
  };

  const handleChange = (event: any) => {
    let value: string | number = parseInt(event.target.value);
    if (event.target.id === "startRecur" || event.target.id === "endRecur") {
      const m = moment(event.target.value);
      value = m.format("YYYY-MM-DD");
      if (event.target.id === "startRecur") {
        setStartRecur(m);
      } else {
        setEndRecur(m);
      }
    } else if (
      event.target.id === "startTime" ||
      event.target.id === "endTime"
    ) {
      value = event.target.value;
      const m = moment(value, "HH:mm");
      if (event.target.id === "startTime") {
        setStartTime(m);
      } else {
        setEndTime(m);
      }
    } else {
      if (isNaN(value)) {
        value = event.target.value;
      }
    }

    setForm({
      ...form,
      [event.target.id]: value,
    });
    setTimeout(() => {
      event.target.focus();
    });
  };

  useEffect(() => {
    // currLabInstance.current.startTime = getTimeFormat(startTime);
    // currLabInstance.current.endTime = getTimeFormat(endTime);
    setForm({
      ...form,
      startTime: getTimeFormat(startTime, true),
      endTime: getTimeFormat(endTime, true),
    });
  }, [startTime, endTime]);

  useEffect(() => {
    // currLabInstance.current.startTime = getTimeFormat(startTime);
    // currLabInstance.current.endTime = getTimeFormat(endTime);
    setForm({
      ...form,
      startRecur: getDateFormat(startRecur),
      endRecur: getDateFormat(endRecur),
    });
  }, [startRecur, endRecur]);

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  // const sendEdit = () => {
  //   setIsProcessing(false)
  // }

  const sendNew = async () => {
    setIsProcessing(true);
    await api.post("api/labinstance", form);
    refresh().then(() => {
      closeModal();
    });
    setIsProcessing(false);
  };

  const sendEdit = async () => {
    setIsProcessing(true);
    await api.put(`api/labinstance/${form.id}`, form);
    refresh().then(() => {
      closeModal();
    });
    setIsProcessing(false);
  };

  const eventClick = (e: EventClickArg | EventContentArg) => {
    // if (isCalendarEvent(e)) {
    // e.jsEvent.stopPropagation();
    const eventObj = e.event.toPlainObject();

    const labInstance: LabInstance = eventObj.extendedProps.instanceData;
    labInstance.teacherId = labInstance.teacher?.id;
    labInstance.labId = labInstance.lab?.id;

    setStartRecur(moment(labInstance.startRecur));
    setEndRecur(moment(labInstance.endRecur));
    setStartTime(moment(labInstance.startTime, "HH:mm"));
    setEndTime(moment(labInstance.endTime, "HH:mm"));

    setModal(true);
    setForm(labInstance);
    setModalMode(ModalMode.update);
    // }
  };

  const eventChanged = async (e: EventChangeArg) => {
    const eventObj = e.event.toPlainObject();

    const labInstance: LabInstance = eventObj.extendedProps.instanceData;
    labInstance.teacherId = labInstance.teacher?.id;
    labInstance.labId = labInstance.lab?.id;
    labInstance.startTime = moment(e.event.startStr).format("HH:mm");
    labInstance.endTime = moment(e.event.endStr).format("HH:mm");
    labInstance.daysOfWeek = `${moment(e.event.endStr).day()}`;

    delete labInstance.teacher;
    delete labInstance.lab;
    delete labInstance.students;
    try {
      await api.put(`api/labinstance/${labInstance.id}`, labInstance);
      refresh();
    } catch (err) {
      e.revert();
    }
  };

  useEffect(() => {
    const timeIsNotGood = startTime.isSameOrAfter(endTime);
    const dateIsNotGood = moment(form.startRecur).isSameOrAfter(form.endRecur);
    if (timeIsNotGood || dateIsNotGood) {
      setInvalid(true);
      return;
    }
    let invalid = false;

    for (const [k, v] of Object.entries(form)) {
      if (k === "id") {
        continue;
      }
      if (v === undefined) {
        invalid = true;
      }
    }
    setInvalid(invalid);
  }, [form]);

  const resetForm = () => {
    setForm({
      id: undefined,
      labId: labs[0]?.id,
      teacherId: teachers[0]?.id,
      daysOfWeek: "1",
      color: colorList[0],
      startRecur: getDateFormat(moment()),
      endRecur: getDateFormat(moment()),
      startTime: getTimeFormat(moment(), true),
      endTime: getTimeFormat(moment(), true),
    });
    setStartRecur(moment());
    setEndRecur(moment());
    setStartTime(moment());
    setEndTime(moment());
  };

  // useEffect(() => {
  //   setStartRecur(moment(form.startRecur));
  //   setEndRecur(moment(form.endRecur));
  // }, [form.startRecur, form.endRecur]);

  // useEffect(() => {
  //   setStartTime(moment(form.startTime, "HH:mm"));
  //   setEndTime(moment(form.endTime, "HH:mm"));
  // }, [form.startTime, form.endTime]);
  // console.log(startRecur.format("yyyy-MM-DD"), form);

  const navigateToLabinstance = (id: number) => {
    navigate(`/subscriptions/${id}`);
  };

  const deleteLabInstance = async (id: number) => {
    await api.delete(`api/labinstance/${id}`);
    refresh();
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between pb-8">
        <div className="text-2xl">Πρόγραμμα Εργαστιρίων</div>
        <Button
          size={"md"}
          onClick={() => {
            resetForm();
            setModalMode(ModalMode.create);
            openModal();
          }}
        >
          <IoMdAdd className="mr-2" />
          Προσθήκη
        </Button>
      </div>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        locale="el"
        weekends={weekends.weekendsVisible}
        eventClick={(e) => {
          const obj = e.event.toPlainObject();
          navigateToLabinstance(obj.id);
        }}
        eventChange={eventChanged}
        events={events}
        eventContent={(event) => {
          const obj = event.event.toPlainObject();

          return (
            <div className="overflow-hidden" style={{ height: "inherit" }}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-1">
                  <span
                    data-tooltip-id="tooltip"
                    data-tooltip-content={obj.title}
                    className="overflow-hidden text-ellipsis font-semibold"
                  >
                    {obj.title}
                  </span>
                  <div className="flex grow flex-row justify-end">
                    <div className="h-fit w-fit rounded-full p-1">
                      <AiFillEdit
                        size={"15"}
                        className=" hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          eventClick(event);
                        }}
                      ></AiFillEdit>
                    </div>
                    <div className="h-fit w-fit rounded-full p-1">
                      <AiFillDelete
                        size={"15"}
                        className="hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteLabInstance(obj.id);
                        }}
                      ></AiFillDelete>
                    </div>
                  </div>
                </div>
                <div>
                  {moment(obj.start).format("HH:mm")} -{" "}
                  {moment(obj.end).format("HH:mm")}
                </div>
                <div className="overflow-hidden text-ellipsis">
                  {obj.extendedProps.teacher.name}
                </div>
              </div>
            </div>
          );
        }}
        longPressDelay={1000}
        eventLongPressDelay={1000}
        selectLongPressDelay={1000}
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
      <Modal onClose={closeModal} position="center" show={modal} size={"3xl"}>
        <Modal.Header>
          {modalMode === ModalMode.create
            ? "Νέο Εργαστίριο"
            : "Ενημέρωση εργαστιρίου"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-row gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Εργαστίριο" />
                </div>
                <Select
                  id="labId"
                  value={form.labId}
                  onChange={handleChange}
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
                  id="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
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
            {/* 
            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Άρχη περιόδου μαθήματος" />
                </div>
                <TextInput 
                  id="startRecur"
                  type="date"
                  value={form.startRecur}
                  onChange={handleChange}
                  required></TextInput>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Τέλος περιόδου μαθήματος" />
                </div>
                <TextInput 
                  id="endRecur"
                  type="date"
                  value={form.endRecur}
                  onChange={handleChange}
                  required></TextInput>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Ώρα έναρξης" />
                </div>
                <TextInput 
                  id="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  required ></TextInput>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Ώρα λήξης" />
                </div>
                <TextInput 
                  id="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  required></TextInput>
              </div>
            </div> */}

            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Ημέρα" />
                </div>
                <Select
                  id="daysOfWeek"
                  defaultValue={"1"}
                  value={form.daysOfWeek}
                  onChange={handleChange}
                  required
                >
                  {daysOfWeek.map((day, i) => (
                    <option key={day} value={`${i + 1}`}>
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
                  className="flex h-[40px] flex-row items-center justify-center gap-6"
                  id="color"
                  onChange={handleChange}
                >
                  {colorList.map((color, i) => (
                    <Radio
                      id={"color"}
                      key={color}
                      defaultChecked={i === 0}
                      checked={form.color === color}
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
                        value={startRecur}
                        onChange={(e: any) => setStartRecur(moment(e))}
                      />
                      <DateCalendar
                        value={endRecur}
                        onChange={(e: any) => setEndRecur(moment(e))}
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title>Επιλογή ώρας</Accordion.Title>
                  <Accordion.Content>
                    <div className="flex flex-row gap-2 text-center text-base font-bold">
                      <div className="flex-1">
                        Αρχή {getTimeFormat(startTime)}
                      </div>
                      <div className="flex-1">
                        Τέλος {getTimeFormat(endTime)}
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
            {/* <Alert color="failure" icon={IoMdAlert}>
              <span>
                <p>
                  <span className="font-medium">Info alert!</span>
                  Change a few things up and try submitting again.
                </p>
              </span>
            </Alert> */}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          {modalMode === ModalMode.update && (
            <Button
              color="light"
              className=" mr-auto"
              onClick={() => navigate(`/subscriptions/${form.id}`)}
            >
              <span className="mr-2">Έλεγχος Απουσιών</span>
              <BsBoxArrowInUpRight />
            </Button>
          )}
          <Button color="gray" onClick={closeModal}>
            Άκυρο
          </Button>
          <Button
            disabled={invalid}
            isProcessing={isProcessing}
            onClick={modalMode === ModalMode.update ? sendEdit : sendNew}
          >
            Αποθήκευση
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
